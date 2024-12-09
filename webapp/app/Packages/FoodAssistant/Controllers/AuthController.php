<?php

namespace App\Packages\FoodAssistant\Controllers;


use App\Exceptions\TableUpdateFailException;
use App\Packages\Auth\Auth;
use App\Packages\FoodAssistant\Models\UsersModel;
use App\Packages\FoodAssistant\Utils\ViewBuilder;
use Fux\Exceptions\FuxException;
use Fux\Http\FuxResponse;
use Fux\Routing\Request;

class AuthController
{

    public static function registerPage()
    {
        return new ViewBuilder('Food AI Assistant', 'register');
    }

    public static function loginPage()
    {
        return new ViewBuilder('Food AI Assistant', 'login');
    }

    public static function experimentPage()
    {
        return new ViewBuilder('Food AI Assistant', 'experiment');
    }

    /**
     * Try to register a user and return a redirect URL
     *
     * @param Request $request
     *
     * @return FuxResponse
     *
     * @throws \App\Packages\Auth\Exceptions\InvalidCredentialsException
     */
    public static function doRegister(Request $request)
    {

        /**
         * @var array $body = [
         *     "username" => "info@example.com",
         *     "password" => "plain-text-pw",
         *     "first_name" => "John",
         *     "last_name" => "Doe"
         * ]
         */
        $body = $request->getBody();


        if (UsersModel::getWhere(["username" => $body["username"]])) throw new FuxException(false, "This username already exists");
        Auth::checkValidPassword(UsersModel::class, $body["password"]);

        if (!UsersModel::save([
            "first_name" => $body["first_name"],
            "last_name" => $body["last_name"],
            "username" => $body["username"],
            "password" => password_hash($body["password"], PASSWORD_DEFAULT)
        ])) throw new TableUpdateFailException();


        return new FuxResponse(FuxResponse::SUCCESS, "Your account has been created successfully", routeFullUrl('/login'));
    }

    /**
     * Try to register a user and return a redirect URL
     *
     * @param Request $request
     *
     * @return FuxResponse
     *
     * @throws \App\Packages\Auth\Exceptions\InvalidCredentialsException
     */
    public static function startExperimentSession(Request $request)
    {

        /**
         * @var array $body = [
         *     "username" => "info@example.com",
         *     "first_name" => "John",
         * ]
         */
        $body = $request->getBody();

        if (UsersModel::getWhere(["username" => $body["username"]])) throw new FuxException(false, "This username already exists");

        $user_id = UsersModel::save([
            "first_name" => $body["first_name"],
            "last_name" => '',
            "username" => $body["username"],
            "password" => password_hash("00000000", PASSWORD_DEFAULT)
        ]);
        if (!$user_id) throw new TableUpdateFailException();

        Auth::login(UsersModel::class, UsersModel::get($user_id));

        return new FuxResponse(FuxResponse::SUCCESS, "Your account has been created successfully", routeFullUrl('/chat'));
    }

    /**
     * Execute a login attempt. Return the redirect URL in case of success
     *
     * @param Request $request
     *
     * @return FuxResponse
     *
     * @throws \App\Packages\Auth\Exceptions\InvalidCredentialsException
     */
    public static function doLogin(Request $request)
    {

        /**
         * @var array $body = [
         *     "username" => "info@example.com",
         *     "password" => "plain-text-pw"
         * ]
         */
        $body = $request->getBody();

        if (Auth::attempt(UsersModel::class, [
            "username" => $body['username'],
            "password" => $body['password'],
        ])) {
            return new FuxResponse(FuxResponse::SUCCESS, null, routeFullUrl('/'));
        }

    }


    /**
     * Execute a logout action and redirect to login page
     */
    public static function doLogout()
    {
        Auth::logout(UsersModel::class);
        redirect('/login');
    }


}
