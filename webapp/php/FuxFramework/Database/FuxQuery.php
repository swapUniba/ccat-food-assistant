<?php

namespace Fux\Database;

class FuxQuery
{
    private $sql = "";

    public function __construct($sql)
    {
        $this->sql = $sql;
    }

    public function __toString()
    {
        return $this->sql;
    }
}