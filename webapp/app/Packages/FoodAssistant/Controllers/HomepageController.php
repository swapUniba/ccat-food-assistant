<?php

namespace App\Packages\FoodAssistant\Controllers;

use App\Packages\FoodAssistant\Utils\ViewBuilder;

class HomepageController
{

    public static function index(){
        return new ViewBuilder('Food AI Assistant', 'homepage');
    }

}
