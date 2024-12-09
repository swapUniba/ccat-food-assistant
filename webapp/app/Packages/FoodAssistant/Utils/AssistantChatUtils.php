<?php

namespace App\Packages\FoodAssistant\Utils;

use App\Packages\FoodAssistant\Models\UsersModel;
use App\Utils\StringUtils;
use Fux\Exceptions\FuxException;

class AssistantChatUtils
{
    const ASSISTANT_USER_ID = 1;

    /**
     * Retrieve assistant chat room id, if not exists a new chat room is created
     */
    public static function getChatRoomId(UsersModel $user): int|null
    {

        $userChatId = self::getUserChatId($user);
        $assistantChatUserId = self::ASSISTANT_USER_ID;
        $type = \ChatRoomsModel::TYPO_AI_ASSISTANT;
        //Recupero la chat room
        $roomMd = new \ChatRoomsModel();
        $roomData = $roomMd->getWhere("user_id1 = $assistantChatUserId AND user_id2 = $userChatId AND type = '$type'");
        if (!$roomData) {
            $room_id = $roomMd->save([
                "user_id1" => $assistantChatUserId,
                "user_id2" => $userChatId,
                "type" => $type
            ]);
            if (!$room_id) return null;
            return $room_id;
        }

        return $roomData['room_id'];

    }

    /**
     * Retrieve (or create) the user chat id for the given user
     */
    public static function getUserChatId(UsersModel $user)
    {
        if ($user->chat_user_id) return $user->chat_user_id;

        $chat_user_id = \ChatUsersModel::save(["created_at" => date('Y-m-d H:i:s')]);
        if (!$chat_user_id) return false;

        $user->chat_user_id = $chat_user_id;
        if (!$user->commit()) return false;
        return $chat_user_id;
    }

    /**
     * Process the assistant response and check for the presence of widgets. A associative array with the modified
     * response and the widget metadatum is returned
     *
     * @return array{response: string, widget:array|null}
     */
    public static function processResponseForWidgets($response)
    {
        $widgets = [];
        $widgetContent = StringUtils::getBetween($response, '<widget', '</widget>');
        if (!$widgetContent) return ["response" => $response, "widgets" => null];
        do {
            $widgetHTML = '<widget' . $widgetContent . '</widget>';
            $widgets[] = self::getWidgetDataFromHtml($widgetHTML);
            $response = str_replace($widgetHTML, "{{widget}}", $response);
            $widgetContent = StringUtils::getBetween($response, '<widget', '</widget>');
        } while ($widgetContent);

        return ["response" => $response, "widgets" => $widgets];
    }

    private static function getWidgetDataFromHtml($html)
    {
        try {
            libxml_use_internal_errors(true);
            $doc = new \DOMDocument();
            $doc->loadHTML($html);
            $dom = new \DOMXPath($doc);

            $widget = $dom->query('//widget')->item(0);
            $widgetJson = $dom->query('//json', $widget)->item(0);
            $widgetData = [
                "semtype" => $widget->attributes->getNamedItem('semtype')->nodeValue,
                "type" => $widget->attributes->getNamedItem('type')->nodeValue,
                "return" => $widget->attributes->getNamedItem('return')?->nodeValue,
                "label" => $widget->attributes->getNamedItem('label')->nodeValue,
                "data" => json_decode(trim($widgetJson->textContent), true)
            ];
            return $widgetData;

        } catch (\Exception $e) {
            throw FuxException::fromException($e);
        }

    }


}
