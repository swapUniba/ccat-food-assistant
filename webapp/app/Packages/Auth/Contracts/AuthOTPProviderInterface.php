<?php

namespace App\Packages\Auth\Contracts;

use Fux\Database\Model\Model;

interface AuthOTPProviderInterface
{

    /**
     * Generate and store an OTP for a given Authenticatable instance
     *
     * @param \App\Packages\Auth\Contracts\Authenticatable | Model $user
     * @param int $seconds_ttl
     *
     * @return string
     *
     * @throws \App\Packages\Auth\Exceptions\OtpGenerationException
     */
    public static function generateOtp($user, $seconds_ttl);

    /**
     * Generate and store an OTP for a given Authenticatable instance
     *
     * @param \App\Packages\Auth\Contracts\Authenticatable | Model $user
     * @param string $otp
     *
     * @return bool
     * @throws \App\Packages\Auth\Exceptions\OtpNotValidException
     */
    public static function checkOtp($user, $otp);

    /**
     * Check if the OTP can be sent for a given Authenticatable instance
     *
     * @param \App\Packages\Auth\Contracts\Authenticatable | Model $user
     *
     * @return bool
     */
    public static function checkOtpThrottling($user);

    /**
     * Return the number of seconds of the throttling limit
     *
     * @param \App\Packages\Auth\Contracts\Authenticatable | Model $user
     *
     * @return bool
     */
    public static function getOtpThrottlingSeconds();

    /**
     * Send a given OTP for a given Authenticatable instance
     *
     * @param \App\Packages\Auth\Contracts\Authenticatable | Model $user
     * @param string $otp
     *
     * @return bool
     */
    public static function sendOtp($user, $otp);

}