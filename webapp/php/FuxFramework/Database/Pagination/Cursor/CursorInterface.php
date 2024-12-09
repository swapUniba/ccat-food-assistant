<?php

namespace Fux\Database\Pagination\Cursor;

interface CursorInterface
{

    const TYPE_NEXT = 'next';
    const TYPE_PREV = 'prev';

    /**
     * Return an encoded string representation of the cursor
     *
     * @return string
     */
    public function encode();

    /**
     * Create a cursor instance from an encoded string representation
     *
     * @param string $encodedCursor Encoded representation of the cursor
     *
     * @return CursorInterface
     */
    public static function decode($encodedCursor);

    /**
     * @return mixed
     */
    public function getFields();

    /**
     * @param mixed $fields
     */
    public function setFields($fields): void;

    /**
     * @return mixed
     */
    public function getType();

    /**
     * @return bool
     */
    public function isPrev();

    /**
     * @return bool
     */
    public function isNext();

    /**
     * @param mixed $type
     */
    public function setType($type): void;


}