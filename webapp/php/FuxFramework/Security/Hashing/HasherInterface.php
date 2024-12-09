<?php

/**
 * Extracted from Laravel framework
 * @see https://github.com/laravel/framework/blob/9.x/src/Illuminate/Contracts/Hashing/Hasher.php
 */

namespace Fux\Security\Hashing;

interface HasherInterface
{
    /**
     * Get information about the given hashed value.
     *
     * @param string $hashedValue
     * @return array
     */
    public function info($hashedValue);

    /**
     * Hash the given value.
     *
     * @param string $value
     * @param array $options
     * @return string
     */
    public function hash($value, array $options = []);

    /**
     * Check the given plain value against a hash.
     *
     * @param string $value
     * @param string $hashedValue
     * @param array $options
     * @return bool
     */
    public function check($value, $hashedValue, array $options = []);

    /**
     * Check if the given hash has been hashed using the given options.
     *
     * @param string $hashedValue
     * @param array $options
     * @return bool
     */
    public function needsRehash($hashedValue, array $options = []);
}