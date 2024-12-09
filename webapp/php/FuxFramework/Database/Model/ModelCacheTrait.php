<?php

namespace Fux\Database\Model;

trait ModelCacheTrait
{

    protected static array $_pk_cache = [];

    private static function getCacheKey($pkValues)
    {
        return implode(":", array_map(function ($f) use ($pkValues) {
            return $pkValues[$f] ?? 'NULL';
        }, static::getPrimaryKey()));
    }

    public function addToCache()
    {
        static::$_pk_cache[static::getCacheKey($this->data)] = $this;
    }

    public function removeFromCache()
    {
        unset(static::$_pk_cache[static::getCacheKey($this->data)]);
    }

    public static function getFromCache($pk)
    {
        return static::$_pk_cache[static::getCacheKey($pk)] ?? null;
    }

}
