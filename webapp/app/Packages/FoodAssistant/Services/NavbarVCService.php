<?php

namespace App\Packages\AdminDashboard\Services;

use App\Packages\FoodAssistant\Models\UsersModel;
use FuxServiceProvider;
use FuxViewComposerManager;
use IServiceProvider;

class NavbarVCService extends FuxServiceProvider implements IServiceProvider
{

    const VIEW_NAME = 'navbar';

    public static function bootstrap(){
        FuxViewComposerManager::register(self::VIEW_NAME, 'core/navbar', function (){
            $user = \App\Packages\Auth\Auth::user(UsersModel::class);
            return [
                "user" => $user
            ];
        }, 'FoodAssistant');
    }
}
