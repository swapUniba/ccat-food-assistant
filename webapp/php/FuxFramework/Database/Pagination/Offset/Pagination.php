<?php

namespace Fux\Database\Pagination\Offset;

use Fux\Exceptions\FuxException;
use Fux\FuxQueryBuilder;

class Pagination
{

    /** @property FuxQueryBuilder $queryBuilder */
    private $queryBuilder;


    /** @property int $pageItems The maximum number of items for each page */
    private $pageSize;

    /** @property string $sortType Either 'ASC' or 'DESC' */
    private $sortFields = [];


    /**
     * Create a pagination object that is able to fetch dinamically data from the database with the help of the pre
     * configured query builder provided
     *
     * @param FuxQueryBuilder $queryBuilder A pre-configured query builder instance
     * @param string[] $cursorFields
     * @param int $pageSize
     * @param array $sortFields = [
     *     "field_name1" => "ASC",
     *     "field_name2" => "DESC",
     * ]
     *
     */
    public function __construct(FuxQueryBuilder $queryBuilder, int $pageSize, array $sortFields = [])
    {
        foreach ($sortFields as $f => $st) if ($st != 'ASC' && $st != 'DESC') throw new \Exception("Invalid sort type '$st' for field $f");
        $this->queryBuilder = $queryBuilder;
        $this->pageSize = $pageSize;
        $this->sortFields = $sortFields;
    }


    /**
     * Retrieve a "page" of items on the basis of the given offset
     *
     * @param string | null $cursor
     *
     * @return array|bool
     */
    private function getDataWithOffset($offset)
    {
        $qb = clone $this->queryBuilder;
        foreach ($this->sortFields as $fname => $sortType) $qb->orderBy($fname, $sortType);
        return $qb->useFoundRows(true)->offset($offset)->limit($this->pageSize)->execute();
    }

    /**
     * Retrieve a "page" of items on the basis of the given cursor
     *
     * @param int $page
     *
     * @return PaginationPage
     */
    public function get($page = 1)
    {
        $offset = ($page - 1) * $this->pageSize;
        $data = $this->getDataWithOffset($offset);
        $maxPages = ceil($data['total'] / $this->pageSize);
        $hasPrevPage = $page > 1;
        $hasNextPage = $page < $maxPages;

        return new PaginationPage(
            $data['rows'],
            $data['total'],
            $this->pageSize,
            $hasPrevPage ? $page - 1 : null,
            $hasNextPage ? $page + 1 : null
        );
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
     * @return int
     */
    public function getPageSize(): int
    {
        return $this->pageSize;
    }

    /**
     * @param int $pageSize
     */
    public function setPageSize(int $pageSize): void
    {
        $this->pageSize = $pageSize;
    }

    /**
     * @return mixed|string
     */
    public function getSortFields()
    {
        return $this->sortFields;
    }

    /**
     * @param mixed|string $sortFields
     */
    public function setSortFields($sortFields): void
    {
        $this->sortFields = $sortFields;
    }


}
