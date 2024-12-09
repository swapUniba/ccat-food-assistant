<?php

namespace Fux\Database\Pagination\Cursor;


/**
 * Represent an actual cursor information. It stores the fields:value pairs for the pagination and sorting criterion and
 * the direction (next or prev)
 */
class Cursor implements CursorInterface
{

    /** @property array $fields field:value pairs which represent the cursor data */
    private $fields;

    /** @property array $type Cursor type 'next' or 'prev' */
    private $type;

    public function __construct($fields, $type)
    {
        $this->fields = $fields;
        $this->type = $type;
    }

    /**
     * Return an encoded string representation of the cursor
     *
     * @return string
     */
    public function encode()
    {
        return base64_encode(json_encode([
            "fields" => $this->fields,
            "type" => $this->type
        ]));
    }

    /**
     * Create a cursor instance from an encoded string representation
     *
     * @param string $encodedCursor Encoded representation of the cursor
     *
     * @return CursorInterface
     */
    public static function decode($encodedCursor){
        $data = json_decode(base64_decode($encodedCursor), true);
        return new Cursor($data['fields'], $data['type']);
    }

    /**
     * @return mixed
     */
    public function getFields()
    {
        return $this->fields;
    }

    /**
     * @param mixed $fields
     */
    public function setFields($fields): void
    {
        $this->fields = $fields;
    }

    /**
     * @return mixed
     */
    public function getType()
    {
        return $this->type;
    }

    /**
     * @return bool
     */
    public function isNext()
    {
        return $this->type === CursorInterface::TYPE_NEXT;
    }

    /**
     * @return bool
     */
    public function isPrev()
    {
        return $this->type === CursorInterface::TYPE_PREV;
    }

    /**
     * @param mixed $type
     */
    public function setType($type): void
    {
        $this->type = $type;
    }

}