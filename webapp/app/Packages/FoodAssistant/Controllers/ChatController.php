<?php


namespace App\Packages\FoodAssistant\Controllers;

use Albocode\CcatphpSdk\CCatClient;
use Albocode\CcatphpSdk\Clients\HttpClient;
use Albocode\CcatphpSdk\Clients\WSClient;
use Albocode\CcatphpSdk\Model\Message;
use App\Packages\FoodAssistant\Utils\ChatRepository;
use App\Exceptions\TableUpdateFailException;
use App\Exceptions\UnauthorizedAccessException;
use App\Packages\Auth\Auth;
use App\Packages\FoodAssistant\Models\UsersModel;
use App\Packages\FoodAssistant\Utils\AssistantChatUtils;
use App\Packages\FoodAssistant\Utils\ViewBuilder;
use Fux\DB;
use Fux\Http\FuxResponse;
use Fux\Routing\Request;


class ChatController
{

    /**
     * Show the chat page
     */
    public static function chat()
    {
        $user = Auth::user(UsersModel::class, true);
        $room_id = AssistantChatUtils::getChatRoomId($user);
        return new ViewBuilder('Chat - Food AI Assistant', 'chat', [
            'room_id' => $room_id,
            'user' => $user,
        ]);
    }

    /**
     * Retrieve current logged user's chatroom data
     *
     * @param Request $request
     */
    public static function getChatRoom(Request $request)
    {
        $user = Auth::user(UsersModel::class, true);
        $room_id = AssistantChatUtils::getChatRoomId($user);
        return (new \ChatRoomsModel())->getRecord($room_id);
    }

    /**
     * Archive the old chat room and create a new one
     *
     * @param Request $request
     *
     * @return FuxResponse
     */
    public static function refreshChatRoom(Request $request)
    {
        $user = Auth::user(UsersModel::class, true);
        $room_id = AssistantChatUtils::getChatRoomId($user);

        DB::ref()->begin_transaction();

        if (!(new \ChatRoomsModel())->save([
            "room_id" => $room_id,
            "type" => \ChatRoomsModel::TYPO_AI_ASSISTANT_ARCHIVED
        ])) throw new TableUpdateFailException();

        $newIdRoom = AssistantChatUtils::getChatRoomId($user);
        if (!$newIdRoom) throw new TableUpdateFailException();

        DB::ref()->commit();
        return FuxResponse::success(null, $newIdRoom);
    }


    /**
     * Recupera l'elenco dei messaggi di una chat (con uso dei cursori)
     *
     * @param Request $request queryParams: {
     *  token,
     *  room_id,
     *  cursor (optional),
     *  limit
     * }
     *
     * @return FuxResponse {
     *  messaggi[],
     *  cursors: {
     *      after,
     *      before
     *  }
     * }
     */
    public static function getMessages(Request $request)
    {
        /**
         * @var array $queryStringParams = [
         *      "room_id" => 123,
         *      "cursor" => "abcd",
         *      "limit" => 123,
         * ]
         */
        $queryStringParams = $request->getQueryStringParams();

        /** @var UsersModel $user */
        $user = Auth::user(UsersModel::class, true);

        if (!ChatRepository::checkMembership($queryStringParams['room_id'], $user->chat_user_id)) throw new \App\Packages\Auth\Exceptions\UnauthorizedAccessException();

        return ChatRepository::getMessages($queryStringParams['room_id'], $queryStringParams['limit'], $queryStringParams['cursor'] ?? null);
    }

    /**
     * Aggiunge un messaggio di testo alla chat room da parte dell'admin loggato
     *
     * @param Request $request body: {
     *  room_id,
     *  text
     * }
     * @throws UnauthorizedAccessException
     */
    public static function sendTextMessage(Request $request)
    {
        /**
         * @var array $body = [
         *      "room_id" => 123,
         *      "text" => "abcd",
         *      "assistant_specific_prompt" => "abcd" //optional
         * ]
         */
        $body = $request->getBody();

        /** @var UsersModel $user */
        $user = Auth::user(UsersModel::class, true);

        $chatRoom = ChatRepository::checkMembership($body['room_id'], $user->chat_user_id);
        if (!$chatRoom || $chatRoom['type'] !== \ChatRoomsModel::TYPO_AI_ASSISTANT) throw new UnauthorizedAccessException();


        background_execution(function () use ($body, $request, $user) {

            $messagesResponses = [];
            //Text messages
            if ($body['text']) $messagesResponses[] = ChatRepository::saveMessage($body['room_id'], $user->chat_user_id, $_POST['text']);

            $messageIds = [];
            $messageOtps = [];
            foreach ($messagesResponses as $mr) {
                $data = $mr->getData();
                $messageIds[] = $data['message_id'];
                $messageOtps[] = $data['otp'];
            }

            echo FuxResponse::success(null, ["message_id" => $messageIds, "otp" => $messageOtps]);

        }, function () use ($body, $user) {

            $cCatClient = new CCatClient(
                new WSClient(CHESHIRE_CAT_HOSTNAME, CHESHIRE_CAT_PORT, CHESHIRE_CAT_USE_SSL),
                new HttpClient(CHESHIRE_CAT_HOSTNAME, CHESHIRE_CAT_PORT, CHESHIRE_CAT_API_KEY)
            );

            $assistantPrompt = $body['assistant_specific_prompt'] ?? $body['text'];

            try {
                $result = $cCatClient->sendMessage(new Message($assistantPrompt, $body['room_id'], [
                    "user" => [
                        'first_name' => $user->first_name,
                        'last_name' => $user->last_name,
                    ]
                ]));


                $whyInput = json_decode($result->why->input, true);
                if ($whyInput) {
                    $activeForm = $whyInput['active_form'] ?? null;
                    $assistantSettings = $whyInput['assistant_settings'] ?? null;
                }
                $metadata = ['ccat_why' => get_object_vars($result->why), 'assistant_settings' => $assistantSettings ?? null, 'active_form' => $activeForm ?? null];

                $processedResponse = AssistantChatUtils::processResponseForWidgets($result->content);
                if ($processedResponse['widgets']) $metadata['widgets'] = $processedResponse['widgets'];

                ChatRepository::saveMessage($body['room_id'], AssistantChatUtils::ASSISTANT_USER_ID, $processedResponse['response'], false, $metadata);

            } catch (\Exception $e) {
                ChatRepository::saveMessage($body['room_id'], AssistantChatUtils::ASSISTANT_USER_ID, "Qualcosa è andato storto... riprova", false, [
                    "exception" => get_object_vars($e),
                    "message" => $e->getMessage()
                ]);
            }

        }, true);

        return '';
    }

}
