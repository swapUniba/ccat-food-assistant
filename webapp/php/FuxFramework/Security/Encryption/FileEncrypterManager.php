<?php

namespace Fux\Security\Encryption;

use App\Utils\StringUtils;

class FileEncrypterManager
{
    const FILE_ENCRYPTION_BLOCKS = 255;

    /**
     * The encryption key.
     *
     * @var string
     */
    protected $key;

    /**
     * The algorithm used for encryption.
     *
     * @var string
     */
    protected $cipher;

    /**
     * The supported cipher algorithms and their properties.
     *
     * @var array
     */
    private static array $supportedCiphers = [
        'aes-128-cbc' => ['size' => 16, 'aead' => false],
        'aes-256-cbc' => ['size' => 32, 'aead' => false],
    ];

    /**
     * Create a new encrypter instance.
     *
     * @param string $key
     * @param string $cipher
     * @return void
     *
     * @throws \RuntimeException
     */
    public function __construct($key, $cipher = DEFAULT_CIPHER)
    {
        $key = (string)$key;

        if (!static::supported($key, $cipher)) {
            $ciphers = implode(', ', array_keys(self::$supportedCiphers));

            throw new \RuntimeException("Unsupported cipher or incorrect key length. Supported ciphers are: {$ciphers}.");
        }

        $this->key = $key;
        $this->cipher = $cipher;
    }

    /**
     * Determine if the given key and cipher combination is valid.
     *
     * @param string $key
     * @param string $cipher
     * @return bool
     */
    public static function supported($key, $cipher)
    {
        if (!isset(self::$supportedCiphers[strtolower($cipher)])) {
            return false;
        }

        return mb_strlen($key, '8bit') === self::$supportedCiphers[strtolower($cipher)]['size'];
    }


    /**
     * Encrypts the source file and saves the result in a new file.
     *
     * @param string $sourcePath Path to file that should be encrypted
     * @param string $destPath File name where the encryped file should be written to.
     * @return bool
     * @throws \Exception
     */
    public function encrypt($sourcePath, $destPath)
    {
        $fpOut = $this->openDestFile($destPath);
        $fpIn = $this->openSourceFile($sourcePath);

        // Put the initialzation vector to the beginning of the file
        $ivLength = openssl_cipher_iv_length($this->cipher);
        $iv = openssl_random_pseudo_bytes($ivLength);
        fwrite($fpOut, $iv);

        $numberOfChunks = ceil(filesize($sourcePath) / ($ivLength * self::FILE_ENCRYPTION_BLOCKS));

        $i = 0;
        while (! feof($fpIn)) {
            $plaintext = fread($fpIn, $ivLength * self::FILE_ENCRYPTION_BLOCKS);
            $ciphertext = openssl_encrypt($plaintext, $this->cipher, $this->key, OPENSSL_RAW_DATA, $iv);

            // Because Amazon S3 will randomly return smaller sized chunks:
            // Check if the size read from the stream is different than the requested chunk size
            // In this scenario, request the chunk again, unless this is the last chunk
            if (strlen($plaintext) !== 16 * self::FILE_ENCRYPTION_BLOCKS
                && $i + 1 < $numberOfChunks
            ) {
                fseek($fpIn, $ivLength * self::FILE_ENCRYPTION_BLOCKS * $i);
                continue;
            }

            // Use the first 16 bytes of the ciphertext as the next initialization vector
            $iv = substr($ciphertext, 0, $ivLength);
            fwrite($fpOut, $ciphertext);

            $i++;
        }

        fclose($fpIn);
        fclose($fpOut);

        return true;
    }


    /**
     * Decrypts the source file and saves the result in a new file.
     *
     * @param string $sourcePath Path to file that should be decrypted
     * @param string $destPath File name where the decryped file should be written to.
     * @return bool
     * @throws \Exception
     */
    public function decrypt($sourcePath, $destPath)
    {
        $fpOut = $this->openDestFile($destPath);
        $fpIn = $this->openSourceFile($sourcePath);

        // Get the initialzation vector from the beginning of the file
        $ivLenght = openssl_cipher_iv_length($this->cipher);
        $iv = fread($fpIn, $ivLenght);

        $numberOfChunks = ceil((filesize($sourcePath) - $ivLenght) / ($ivLenght * (self::FILE_ENCRYPTION_BLOCKS + 1)));

        $i = 0;
        while (! feof($fpIn)) {
            // We have to read one block more for decrypting than for encrypting because of the initialization vector
            $ciphertext = fread($fpIn, $ivLenght * (self::FILE_ENCRYPTION_BLOCKS + 1));
            $plaintext = openssl_decrypt($ciphertext, $this->cipher, $this->key, OPENSSL_RAW_DATA, $iv);

            // Because Amazon S3 will randomly return smaller sized chunks:
            // Check if the size read from the stream is different than the requested chunk size
            // In this scenario, request the chunk again, unless this is the last chunk
            if (strlen($ciphertext) !== 16 * (self::FILE_ENCRYPTION_BLOCKS + 1)
                && $i + 1 < $numberOfChunks
            ) {
                fseek($fpIn, 16 + 16 * (self::FILE_ENCRYPTION_BLOCKS + 1) * $i);
                continue;
            }

            if ($plaintext === false) {
                throw new \Exception('Decryption failed');
            }

            // Get the the first 16 bytes of the ciphertext as the next initialization vector
            $iv = substr($ciphertext, 0, $ivLenght);
            fwrite($fpOut, $plaintext);

            $i++;
        }

        fclose($fpIn);
        fclose($fpOut);

        return true;
    }

    protected function openDestFile($destPath)
    {
        if (($fpOut = fopen($destPath, 'w')) === false) {
            throw new \Exception('Cannot open file for writing');
        }

        return $fpOut;
    }

    /**
     * @throws \Exception
     */
    protected function openSourceFile($sourcePath)
    {
        $contextOpts = StringUtils::startsWith($sourcePath, 's3://') ? ['s3' => ['seekable' => true]] : [];

        if (($fpIn = fopen($sourcePath, 'r', false, stream_context_create($contextOpts))) === false) {
            throw new \Exception('Cannot open file for reading');
        }

        return $fpIn;
    }

}