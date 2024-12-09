<?php

namespace Fux\Security\Encryption;


/**
 * This class can be used to access to the default FileEncrypter instances via Facade pattern
 */
class FileEncrypter
{

    private static ?FileEncrypterManager $encrypter = null;

    /**
     * Return the current hashing
     */
    private static function encrypter()
    {
        if (!self::$encrypter) self::$encrypter = new FileEncrypterManager(app_key(), DEFAULT_CIPHER);
        return self::$encrypter;
    }

    /**
     * Encrypts the source file and saves the result in a new file.
     *
     * @param string $sourcePath Path to file that should be encrypted
     * @param string $destPath File name where the encryped file should be written to.
     * @return bool
     * @throws \Exception
     */
    public static function encrypt(string $sourcePath, string $destPath): bool
    {
        return self::encrypter()->encrypt($sourcePath, $destPath);
    }

    /**
     * Decrypts the source file and saves the result in a new file.
     *
     * @param string $sourcePath Path to file that should be decrypted
     * @param string $destPath File name where the decryped file should be written to.
     * @return bool
     * @throws \Exception
     */
    public static function decrypt(string $sourcePath, string $destPath): bool
    {
        return self::encrypter()->decrypt($sourcePath, $destPath);
    }

}