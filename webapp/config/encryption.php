<?php


/**
 * @MARK Encryption related constants
 * Note: the encryption key is always the APP_KEY
 */

const CIPHER_AES_128_CBC = 'aes-128-cbc';
const CIPHER_AES_256_CBC = 'aes-256-cbc';
const CIPHER_AES_128_GCM = 'aes-128-gcm';
const CIPHER_AES_256_GCM = 'aes-256-gcm';
const DEFAULT_CIPHER = CIPHER_AES_256_CBC;