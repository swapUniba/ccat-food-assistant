<?php

namespace Fux\Database\Pagination\Cursor;

class PaginationPage implements \JsonSerializable
{
    /** @property array $items */
    private $items;

    /** @property int $totalItems */
    private $totalItems;

    /** @property int $maxItems */
    private $maxItems;

    /** @property CursorInterface $prevCursor */
    private $prevCursor;

    /** @property array $nextCursor */
    private $nextCursor;


    public function __construct($items, $totalItems, $maxItems, $prevCursor, $nextCursor)
    {
        $this->items = $items;
        $this->totalItems = $totalItems;
        $this->maxItems = $maxItems;
        $this->prevCursor = $prevCursor;
        $this->nextCursor = $nextCursor;
    }


    public function toArray()
    {
        return [
            "data" => $this->items,
            "max_items" => $this->maxItems,
            "total" => $this->totalItems,
            "prev" => $this->prevCursor,
            "next" => $this->nextCursor
        ];
    }

    /**
     * @return mixed
     */
    public function jsonSerialize(): mixed
    {
        return $this->toArray();
    }

    /**
     * @return mixed
     */
    public function getItems()
    {
        return $this->items;
    }

    /**
     * @param mixed $items
     */
    public function setItems($items): void
    {
        $this->items = $items;
    }


    /**
     * @return mixed
     */
    public function getTotalItems()
    {
        return $this->totalItems;
    }

    /**
     * @param mixed $totalItems
     */
    public function setTotalItems($totalItems): void
    {
        $this->totalItems = $totalItems;
    }

    /**
     * @return mixed
     */
    public function getMaxItems()
    {
        return $this->maxItems;
    }

    /**
     * @param mixed $maxItems
     */
    public function setMaxItems($maxItems): void
    {
        $this->maxItems = $maxItems;
    }

    /**
     * @return mixed
     */
    public function getPrevCursor()
    {
        return $this->prevCursor;
    }

    /**
     * @param mixed $prevCursor
     */
    public function setPrevCursor($prevCursor): void
    {
        $this->prevCursor = $prevCursor;
    }

    /**
     * @return mixed
     */
    public function getNextCursor()
    {
        return $this->nextCursor;
    }

    /**
     * @param mixed $nextCursor
     */
    public function setNextCursor($nextCursor): void
    {
        $this->nextCursor = $nextCursor;
    }
}