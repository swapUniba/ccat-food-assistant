<?php

namespace Fux\Database\Pagination\Offset;

class PaginationPage implements \JsonSerializable
{
    /** @property array $items */
    private $items;

    /** @property int $totalItems */
    private $totalItems;

    /** @property int $maxItems */
    private $maxItems;

    /** @property int $prevPage */
    private $prevPage;

    /** @property int $nextPage */
    private $nextPage;


    public function __construct($items, $totalItems, $maxItems, $prevPage, $nextPage)
    {
        $this->items = $items;
        $this->totalItems = $totalItems;
        $this->maxItems = $maxItems;
        $this->prevPage = $prevPage;
        $this->nextPage = $nextPage;
    }


    public function toArray()
    {
        return [
            "data" => $this->items,
            "max_items" => $this->maxItems,
            "total" => $this->totalItems,
            "prev" => $this->prevPage,
            "next" => $this->nextPage,
            "pages" => ceil($this->totalItems/$this->maxItems)
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
     * @param callable $cb
     */
    public function applyItems($cb): void
    {
        $this->items = array_map($cb, $this->items);
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
    public function getPrevPage()
    {
        return $this->prevPage;
    }

    /**
     * @param mixed $prevPage
     */
    public function setPrevPage($prevPage): void
    {
        $this->prevPage = $prevPage;
    }

    /**
     * @return mixed
     */
    public function getNextPage()
    {
        return $this->nextPage;
    }

    /**
     * @param mixed $nextPage
     */
    public function setNextPage($nextPage): void
    {
        $this->nextPage = $nextPage;
    }
}
