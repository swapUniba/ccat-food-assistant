<?php


namespace App\Packages\BookizonAIAssistant\Middlewares;

use App\Packages\Auth\Exceptions\UnauthorizedAccessException;
use App\Packages\FoodAssistant\Models\UsersModel;
use Fux\FuxMiddleware;

class AiAssistantChatRoomIdMiddleware extends FuxMiddleware
{

    public function handle()
    {
        $request = $this->request;
        $room_id = null;

        if (isset($request->requestMethod)) {
            switch ($request->requestMethod) {
                case "GET":
                    $room_id = $request->getQueryStringParams()['__assistant_room_id'] ?? null;
                    break;
                case "POST":
                    $room_id = $request->getBody()['__assistant_room_id'] ?? null;
                    break;
            }
        }
        if (!$room_id) throw new UnauthorizedAccessException();

        $chatRoom = (new \ChatRoomsModel())->getRecord($room_id);
        if (!$chatRoom) throw new UnauthorizedAccessException();

        $user = UsersModel::get()
        $admin = (new \AdminModel())->getWhere(["chat_user_id" => $chatRoom['user_id2']]);
        if (!$admin) throw new UnauthorizedAccessException();

        \AdminAuthService::setLogged($admin);

        return $this->resolve();
    }

}

