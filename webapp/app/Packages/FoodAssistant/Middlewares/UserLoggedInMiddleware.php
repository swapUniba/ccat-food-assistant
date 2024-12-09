<?php

namespace App\Packages\FoodAssistant\Middlewares;


use App\Packages\FoodAssistant\Models\UsersModel;

class UserLoggedInMiddleware extends \App\Packages\Auth\Middlewares\AuthLoggedInMiddleware
{
    protected $authenticatableClass = UsersModel::class;
    protected $redirectRoute = '/login';
}
