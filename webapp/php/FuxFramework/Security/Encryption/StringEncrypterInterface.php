<?php

/**
 * Extracted from Laravel framework
 * @see https://github.com/laravel/framework/blob/9.x/src/Illuminate/Hashing/AbstractHasher.php
 */

namespace Fux\Security\Encryption;

interface StringEncrypterInterface
{
    /**
     * Encrypt a string without serialization.
     *
     * @param  string  $value
     * @return string
     *
     * @throws \Fux\Security\Encryption\Exceptions\EncryptException
     */
    public function encryptString($value);

    /**
     * Decrypt the given string without unserialization.
     *
     * @param  string  $payload
     * @return string
     *
     * @throws \Fux\Security\Encryption\Exceptions\DecryptException
     */
    public function decryptString($payload);
}
