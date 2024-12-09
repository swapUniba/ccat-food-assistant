<?php

namespace Fux\Security\Hashing;

class HashFactory
{

    /**
     * Return an hasher instance based on the given parameter or default config
     *
     * @return HasherInterface
     */
    public static function make($algo = null, $options = [])
    {
        switch ($algo ?? DEFAULT_HASH_ALGO) {
            case HASH_ARGON:
                return new ArgonHasher($options);
            default:
                return new BcryptHasher($options);
        }
    }


}