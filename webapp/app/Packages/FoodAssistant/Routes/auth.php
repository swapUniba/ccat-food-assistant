<?php

use Fux\Routing\Request;
use Fux\Routing\Router;


/**
 * @MARK Experiment
 */

\Fux\Routing\Routing::router()->get('/experiment', function (Request $request) {
    return \App\Packages\FoodAssistant\Controllers\AuthController::experimentPage();
});

\Fux\Routing\Routing::router()->post('/experiment', function (Request $request) {
    return \App\Packages\FoodAssistant\Controllers\AuthController::startExperimentSession($request);
});

/**
 * @MARK Registration
 */

\Fux\Routing\Routing::router()->get('/register', function (Request $request) {
    return \App\Packages\FoodAssistant\Controllers\AuthController::registerPage();
});

\Fux\Routing\Routing::router()->post('/register', function (Request $request) {
    return \App\Packages\FoodAssistant\Controllers\AuthController::doRegister($request);
});


/**
 * @MARK Login / Logout
 */
\Fux\Routing\Routing::router()->get('/login', function (Request $request) {
    return \App\Packages\FoodAssistant\Controllers\AuthController::loginPage();
});

\Fux\Routing\Routing::router()->post('/login', function (\Fux\Routing\Request $request) {
    return \App\Packages\FoodAssistant\Controllers\AuthController::doLogin($request);
});

\Fux\Routing\Routing::router()->get('/logout', function () {
    \App\Packages\FoodAssistant\Controllers\AuthController::doLogout();
})->middleware(new \App\Packages\FoodAssistant\Middlewares\UserLoggedInMiddleware());
