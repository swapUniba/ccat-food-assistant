<?php

namespace Fux\Security\Encryption;


use Fux\Security\Encryption\Exceptions\DecryptException;
use Fux\Security\Encryption\Exceptions\EncryptException;

/**
 * This class can be used to access to the default Hasher instances via Facade pattern
 */
class Encrypter
{

    private static ?EncrypterManager $encrypter = null;

    /**
     * Return the current hashing
     */
    private static function encrypter()
    {
        if (!self::$encrypter) self::$encrypter = new EncrypterManager(app_key(), DEFAULT_CIPHER);
        return self::$encrypter;
    }

    /**
     * Encrypt the given value.
     *
     * @param mixed $value
     *
     * @return string
     *
     * @throws EncryptException
     */
    public static function encrypt($value): string
    {
        return self::encrypter()->encrypt($value);
    }

    /**
     * Decrypt the given value.
     *
     * @param mixed $value
     *
     * @return string
     *
     * @throws DecryptException
     */
    public static function decrypt($value): string
    {
        return self::encrypter()->decrypt($value);
    }

}