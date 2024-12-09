<?php

namespace Fux\Security\Hashing;


/**
 * This class can be used to access to the default Hasher instances via Facade pattern
 */
class Hasher
{

    private static ?HasherInterface $hasher = null;

    /**
     * Return the current hashing
     */
    private static function hasher()
    {
        if (!self::$hasher) self::$hasher = HashFactory::make();
        return self::$hasher;
    }

    /**
     * Get information about the given hashed value.
     *
     * @param string $hashedValue
     * @return array
     */
    public static function info($hashedValue)
    {
        return self::hasher()->info($hashedValue);
    }

    /**
     * Hash the given value.
     *
     * @param string $value
     * @param array $options
     * @return string
     */
    public static function hash($value, array $options = [])
    {
        return self::hasher()->hash($value, $options);
    }

    /**
     * Check the given plain value against a hash.
     *
     * @param string $value
     * @param string $hashedValue
     * @param array $options
     * @return bool
     */
    public static function check($value, $hashedValue, array $options = [])
    {
        return self::hasher()->check($value, $hashedValue, $options);
    }

    /**
     * Check if the given hash has been hashed using the given options.
     *
     * @param string $hashedValue
     * @param array $options
     * @return bool
     */
    public static function needsRehash($hashedValue, array $options = [])
    {
        return self::hasher()->needsRehash($hashedValue, $options);
    }

}