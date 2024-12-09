<?php

use Fux\Routing\Request;
use Fux\Routing\Router;

\Fux\Routing\Routing::router()->withMiddleware([new \App\Packages\FoodAssistant\Middlewares\UserLoggedInMiddleware()], function () {

    \Fux\Routing\Routing::router()->get('/chat', function (Request $request) {
        return \App\Packages\FoodAssistant\Controllers\ChatController::chat();
    });

    \Fux\Routing\Routing::router()->get('/ai-assistant/chat/get-chat-room', function (Request $request) {
        return \App\Packages\FoodAssistant\Controllers\ChatController::getChatRoom($request);
    });

    \Fux\Routing\Routing::router()->post('/ai-assistant/chat/refresh-chat-room', function (Request $request) {
        return \App\Packages\FoodAssistant\Controllers\ChatController::refreshChatRoom($request);
    });

    \Fux\Routing\Routing::router()->get('/ai-assistant/chat/get-messages', function (Request $request) {
        return \App\Packages\FoodAssistant\Controllers\ChatController::getMessages($request);
    });

    \Fux\Routing\Routing::router()->post('/ai-assistant/chat/send-text-message', function (Request $request) {
        return \App\Packages\FoodAssistant\Controllers\ChatController::sendTextMessage($request);
    });

});

