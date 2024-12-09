<?php

namespace App\Packages\Auth;

use App\Packages\Auth\Contracts\AuthOTPProviderInterface;
use Fux\Database\Model\Model;

class BaseOtpProvider implements AuthOTPProviderInterface
{

    protected static $resend_protection_timeout = 15; //seconds
    protected static $ttl = 60 * 60 * 24; //24h

    /**
     * Generate and store an OTP for a given Authenticatable instance
     *
     * @param \App\Packages\Auth\Contracts\Authenticatable | Model $user
     * @param int $seconds_ttl Override the default $ttl value of the class (can be dangerous if using the resend
     * protection timeout feature and you don't care about the new TTL value)
     *
     * @return string
     *
     * @throws \App\Packages\Auth\Exceptions\OtpGenerationException
     */
    public static function generateOtp($user, $seconds_ttl = null)
    {
        if (!$seconds_ttl) $seconds_ttl = static::$ttl;
        $otp = rand(1111, 9999) . rand(1111, 9999);
        $expire_date = new \DateTime();
        $expire_date->add(new \DateInterval("PT" . $seconds_ttl . "S"));
        $user->{$user::getOtpIdentifierName()} = $otp;
        $user->{$user::getOtpIdentifierName() . "_expire_date"} = $expire_date->format('Y-m-d H:i:s');
        if (!$user->commit()) throw new \App\Packages\Auth\Exceptions\OtpGenerationException();
        return $otp;
    }

    /**
     * Generate and store an OTP for a given Authenticatable instance
     *
     * @param \App\Packages\Auth\Contracts\Authenticatable | Model $user
     * @param string $otp
     *
     * @return bool
     * @throws \App\Packages\Auth\Exceptions\OtpNotValidException
     */
    public static function checkOtp($user, $otp)
    {
        $realOtp = $user->{$user::getOtpIdentifierName()};
        $expireDate = $user->{$user::getOtpIdentifierName() . "_expire_date"};
        if ($realOtp != $otp || $expireDate < date('Y-m-d H:i:s')) {
            throw new \App\Packages\Auth\Exceptions\OtpNotValidException();
        }
        return true;
    }

    /**
     * Send a given OTP for a given Authenticatable instance
     *
     * @param \App\Packages\Auth\Contracts\Authenticatable | Model $user
     * @param string $otp
     *
     * @return bool
     * @throws \Fux\Exceptions\FuxException
     */
    public static function sendOtp($user, $otp)
    {
        throw new \Fux\Exceptions\FuxException(false, "Qualcosa è andato storto. Riprova più tardi.");
    }

    /**
     * Check if the OTP can be sent for a given Authenticatable instance
     *
     * @param \App\Packages\Auth\Contracts\Authenticatable | Model $user
     *
     * @return bool
     */
    public static function checkOtpThrottling($user)
    {
        $otpCreationDate = (new \DateTime($user->{$user::getOtpIdentifierName() . "_expire_date"} ?? 'now'))
            ->modify("-" . self::$ttl . " seconds");
        return time() - $otpCreationDate->format('U') >= self::getOtpThrottlingSeconds();
    }

    /**
     * Return the number of seconds of the throttling limit
     *
     * @param \App\Packages\Auth\Contracts\Authenticatable | Model $user
     *
     * @return bool
     */
    public static function getOtpThrottlingSeconds()
    {
        return self::$resend_protection_timeout;
    }
}