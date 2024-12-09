<?php

/**
 * Extracted from Laravel framework
 * @see https://github.com/laravel/framework/blob/9.x/src/Illuminate/Hashing/AbstractHasher.php
 */

namespace Fux\Security\Encryption;

interface EncrypterInterface
{
    /**
     * Encrypt the given value.
     *
     * @param  mixed  $value
     * @param  bool  $serialize
     * @return string
     *
     * @throws \Fux\Security\Encryption\Exceptions\EncryptException
     */
    public function encrypt($value, $serialize = true);

    /**
     * Decrypt the given value.
     *
     * @param  string  $payload
     * @param  bool  $unserialize
     * @return mixed
     *
     * @throws \Fux\Security\Encryption\Exceptions\DecryptException
     */
    public function decrypt($payload, $unserialize = true);

    /**
     * Get the encryption key that the encrypter is currently using.
     *
     * @return string
     */
    public function getKey();
}