<?php

namespace App\Packages\Auth\Contracts;

interface Authenticatable
{
    /**
     * Get the name of the unique identifier for the user.
     *
     * @return string
     */
    public static function getAuthIdentifierName();

    /**
     * Get the unique identifier for the user.
     *
     * @return mixed
     */
    public function getAuthIdentifier();

    /**
     * Get the name of the password field for the user.
     *
     * @return string
     */
    public static function getAuthPasswordName();

    /**
     * Get the password for the user.
     *
     * @return string
     */
    public function getAuthPassword();

    /**
     * Check if the user account is "confirmed", if the return value is not TRUE the authentication will throw an
     * Exception
     *
     * @return bool
     */
    public function isConfirmed();

    /**
     * Check if the given token is still valid
     *
     * @return bool
    */
    public function checkRememberToken($token);

    /**
     * Generate a NEW valid remember token
     *
     * @return string
     */
    public function getRememberToken();

    /**
     * Delete a remember token
     *
     * @param  string  $value
     * @return void
     */
    public function deleteRememberToken($value);

    /**
     * Get the name of the otp field for the user.
     *
     * @return string
     */
    public static function getOtpIdentifierName();


    /**
     * Return an associative array of regular expression that must be validated in order to have a "valid" password for the instance.
     * Each key is a regular expression, each value is a human-readable explanation of the regex that will be showed
     * on the client site in case of errors.
     *
     * @return string[]
    */
    public static function getPasswordStrengthRules();

}