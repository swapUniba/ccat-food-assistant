<?php


namespace App\Utils;


class OpenSSLUtils
{

    const CIPHER = "aes-256-cbc";

    public static function getIVLength()
    {
        return openssl_cipher_iv_length(self::CIPHER);
    }

    public static function getIV()
    {
        return openssl_random_pseudo_bytes(self::getIVLength());
    }

    public static function getSecretKey()
    {
        return openssl_digest(LEGACY_APP_KEY, 'SHA256', TRUE);
    }

    public static function encryptContent($content)
    {
        $key = self::getSecretKey();
        $iv = self::getIV();
        $ciphertext_raw = openssl_encrypt($content, self::CIPHER, $key, 0, $iv);
        $hmac = hash_hmac('sha256', $ciphertext_raw, $key, true);
        return base64_encode($iv . $hmac . $ciphertext_raw);
    }


    public static function decryptContent($encryptedContent)
    {
        $key = self::getSecretKey();
        $c = base64_decode($encryptedContent);
        $ivlen = self::getIVLength();
        $iv = substr($c, 0, $ivlen);
        $sha256_len = 32;
        $hmac = substr($c, $ivlen, $sha256_len);
        $ciphertext_raw = substr($c, $ivlen + $sha256_len);
        $decryptedText = openssl_decrypt($ciphertext_raw, self::CIPHER, $key, 0, $iv);
        $new_hmac = hash_hmac('sha256', $ciphertext_raw, $key, true);
        if (hash_equals($hmac, $new_hmac)) {
            return $decryptedText;
        }
        return null;
    }


    public static function signData($data, $privateKeyString, $privateKeyPassphrase = null, $algo = OPENSSL_ALGO_SHA256)
    {
        $privateKey = openssl_pkey_get_private($privateKeyString, $privateKeyPassphrase);
        if (!$privateKey) {
            throw new \Exception('Invalid private key: ' . openssl_error_string());
        }

        openssl_sign($data, $signature, $privateKey, $algo);
        return base64_encode($signature);
    }


    public static function verifySignature($data, $signature, $publicKeyString, $algo = OPENSSL_ALGO_SHA256)
    {
        $publicKey = openssl_pkey_get_public($publicKeyString);
        if (!$publicKey) {
            throw new \Exception('Invalid public key');
        }

        $signature = base64_decode($signature);
        $result = openssl_verify($data, $signature, $publicKey, $algo);

        return $result === 1;
    }

}
