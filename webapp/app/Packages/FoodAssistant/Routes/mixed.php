<?php

use Fux\Routing\Request;
use Fux\Routing\Router;



\Fux\Routing\Routing::router()->get('/', function (Request $request) {
    return \App\Packages\FoodAssistant\Controllers\HomepageController::index();
});
