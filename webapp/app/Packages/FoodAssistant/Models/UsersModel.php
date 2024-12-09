<?php

namespace App\Packages\FoodAssistant\Models;

use Fux\Database\Model\Model;

/**
 * @property int user_id
 * @property string first_name
 * @property string last_name
 * @property string username
 * @property string password
 * @property int chat_user_id
 * @property string created_at
 */
class UsersModel extends Model implements \App\Packages\Auth\Contracts\Authenticatable
{

    protected static $tableName = 'users';
    protected static $tableFields = [
        "user_id",
        "first_name",
        "last_name",
        "username",
        "password",
        "chat_user_id",
        "created_at",
    ];
    protected static $primaryKey = ["user_id"];

    public static function getAuthIdentifierName()
    {
        return 'username';
    }

    public function getAuthIdentifier()
    {
        return $this->username;
    }

    public static function getAuthPasswordName()
    {
        return 'password';
    }

    public function getAuthPassword()
    {
        return $this->password;
    }

    public function isConfirmed()
    {
        return true;
    }

    public function checkRememberToken($token)
    {
       return false;
    }

    public function getRememberToken()
    {
        return '';
    }

    public function deleteRememberToken($value)
    {
        return true;
    }

    public static function getOtpIdentifierName()
    {
        return '';
    }

    public static function getPasswordStrengthRules()
    {
        return [];
    }
}
