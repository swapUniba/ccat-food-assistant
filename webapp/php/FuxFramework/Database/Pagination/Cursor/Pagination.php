<?php

namespace Fux\Database\Pagination\Cursor;

use Fux\DB;
use Fux\FuxQueryBuilder;

class Pagination extends \Fux\FuxQueryBuilder
{

    const CURSOR_SIGN_MAP = [
        CursorInterface::TYPE_NEXT => [
            'ASC' => '>',
            'DESC' => '<'
        ],
        CursorInterface::TYPE_PREV => [
            'ASC' => '<',
            'DESC' => '>'
        ],
    ];

    const SWAP_SORTING = [
        'ASC' => 'DESC',
        'DESC' => 'ASC'
    ];

    /** @property FuxQueryBuilder $queryBuilder */
    private $queryBuilder;

    /** @property string[] $cursorFields */
    private $cursorFields;

    /** @property int $pageItems The maximum number of items for each page */
    private $pageItems;

    /** @property string $sortType Either 'ASC' or 'DESC' */
    private $sortType = 'ASC';

    /** @property CursorInterface $cursorClass */
    private $cursorClass = Cursor::class;


    /**
     * Create a pagination object that is able to fetch dinamically data from the database with the help of the pre
     * configured query builder provided
     *
     * @param FuxQueryBuilder $queryBuilder A pre-configured query builder instance
     * @param string[] $cursorFields
     * @param int $pageItems
     *
     */
    public function __construct($queryBuilder, $cursorFields, $pageItems, $sortType = 'ASC')
    {
        $this->queryBuilder = $queryBuilder;
        $this->cursorFields = $cursorFields;
        $this->pageItems = $pageItems;
        $this->sortType = $sortType;
    }


    /**
     * Retrieve a "page" of items on the basis of the given cursor
     *
     * @param string | null $cursor
     * @param int $items
     *
     * @return PaginationPage
     */
    private function getDataWithCursor($cursor, $items)
    {
        $qb = clone $this->queryBuilder;
        if ($cursor) $cursor = $this->cursorClass::decode($cursor);

        /* @MARK: Sorting conditions */
        /*
         * If the cursor point to the previous page the items have to be reversed from an SQL sorting perspective.
         * The condition for a "prev-type" cursor is represented by the math-operator "<" which will select ALL items
         * lower than a certain values. The prev page should only get the last X elements of this list, but using the
         * normal sorting method we will always get the same X elements (which are at the top of the list and are
         * selected using the LIMITc clause). For this reason we invert the order by clause when working with "prev-type"
         * cursors. In order to maintain the same output, we reverse the data once retrieved from DB.
         * */
        $needSortingSwap = $cursor && $cursor->isPrev();
        $fields = array_flip($this->cursorFields);
        foreach ($fields as $fname => $fvalue) {
            $qb->orderBy($fname, !$needSortingSwap ? $this->sortType : self::SWAP_SORTING[$this->sortType]);
        }

        if ($cursor) {
            //Adding tuple comparision
            $columnTuples = implode(",", array_keys($cursor->getFields()));
            $valuesTuples = implode("','", array_values(array_map(fn($f)=>DB::sanitize($f), $cursor->getFields())));
            $sign = self::CURSOR_SIGN_MAP[$cursor->getType()][$this->sortType];
            $qb->SQLWhere("($columnTuples) $sign ('$valuesTuples')");
        }

        $data = $qb->useFoundRows(true)->limit($items)->execute();

        if ($needSortingSwap){
            $data['rows'] = array_reverse($data['rows']);
        }

        return $data;
    }

    /**
     * Retrieve a "page" of items on the basis of the given cursor
     *
     * @param string | null $cursor
     *
     * @return PaginationPage
     */
    public function get($cursor = null)
    {

        $data = $this->getDataWithCursor($cursor, $this->pageItems);

        $prevCursor = !$cursor ? null : $this->getPrevCursor($data['rows']);
        $nextCursor = $this->getNextCursor($data['rows']);

        if ($prevCursor) {
            $prevDataLookup = $this->getDataWithCursor($prevCursor, 1);
            if (!$prevDataLookup['rows']) $prevCursor = null;
        }

        if ($nextCursor) {
            $nextDataLookup = $this->getDataWithCursor($nextCursor, 1);
            if (!$nextDataLookup['rows']) $nextCursor = null;
        }

        return new PaginationPage(
            $data['rows'],
            $data['total'],
            $this->pageItems,
            $prevCursor,
            $nextCursor
        );
    }


    /**
     * Generate an encoded representation of the next cursor for the current item list
     *
     * @param array $items
     *
     * @return string
     */
    private function getNextCursor($items)
    {
        $lastItem = end($items);
        if (!$lastItem) return null;

        $fields = [];
        foreach ($this->cursorFields as $cursorField) {
            $cursorField = array_reverse(explode('.', $cursorField));
            $key = (($cursorField[1] ?? '') ? "$cursorField[1]." : '') . $cursorField[0];
            $fields[$key] = $lastItem[$cursorField[0]];
        }

        /** @var CursorInterface $cursor */
        $cursor = new $this->cursorClass($fields, CursorInterface::TYPE_NEXT);
        return $cursor->encode();
    }


    /**
     * Generate an encoded representation of the prev cursor for the current item list
     *
     * @param array $items
     *
     * @return string
     */
    private function getPrevCursor($items)
    {
        if (!$items) return null;

        $fields = [];
        foreach ($this->cursorFields as $cursorField) {
            $cursorField = array_reverse(explode('.', $cursorField));
            $key = (($cursorField[1] ?? '') ? "$cursorField[1]." : '') . $cursorField[0];
            $fields[$key] = $items[0][$cursorField[0]];
        }

        /** @var CursorInterface $cursor */
        $cursor = new $this->cursorClass($fields, CursorInterface::TYPE_PREV);
        return $cursor->encode();
    }

    /**
     * @return FuxQueryBuilder
     */
    public function getQueryBuilder(): FuxQueryBuilder
    {
        return $this->queryBuilder;
    }

    /**
     * @param FuxQueryBuilder $queryBuilder
     */
    public function setQueryBuilder(FuxQueryBuilder $queryBuilder): void
    {
        $this->queryBuilder = $queryBuilder;
    }

    /**
     * @return string[]
     */
    public function getCursorFields(): array
    {
        return $this->cursorFields;
    }

    /**
     * @param string[] $cursorFields
     */
    public function setCursorFields(array $cursorFields): void
    {
        $this->cursorFields = $cursorFields;
    }

    /**
     * @return int
     */
    public function getPageItems(): int
    {
        return $this->pageItems;
    }

    /**
     * @param int $pageItems
     */
    public function setPageItems(int $pageItems): void
    {
        $this->pageItems = $pageItems;
    }

    /**
     * @return mixed|string
     */
    public function getSortType()
    {
        return $this->sortType;
    }

    /**
     * @param mixed|string $sortType
     */
    public function setSortType($sortType): void
    {
        $this->sortType = $sortType;
    }

    /**
     * @return string
     */
    public function getCursorClass(): string
    {
        return $this->cursorClass;
    }

    /**
     * @param string $cursorClass
     */
    public function setCursorClass(string $cursorClass): void
    {
        $this->cursorClass = $cursorClass;
    }


}
