<?php


namespace App\Packages\FoodAssistant\Utils;


use App\Utils\OpenSSLUtils;
use Fux\FuxQueryBuilder;
use Fux\Http\FuxResponse;

class ChatRepository
{

    const AFTER_CURSOR_PREFIX = 'after';
    const BEFORE_CURSOR_PREFIX = 'before';
    const CURSOR_SEPARATOR = "__";

    private static function generateAfterCursor($id)
    {
        return base64_encode(self::AFTER_CURSOR_PREFIX . self::CURSOR_SEPARATOR . $id);
    }

    private static function generateBeforeCursor($id)
    {
        return base64_encode(self::BEFORE_CURSOR_PREFIX . self::CURSOR_SEPARATOR . $id);
    }

    private static function getCursorData($cursor)
    {
        $data = explode(self::CURSOR_SEPARATOR, base64_decode($cursor));
        return [
            "type" => $data[0],
            "reference" => $data[1]
        ];
    }

    /**
     * Restituisce una lista di messaggi e dei cursori per poter navigare tra i messaggi di una chat
     */
    public static function getMessages($room_id, $limit, $cursor = null)
    {
        $qb = (new FuxQueryBuilder())
            ->select("SQL_CALC_FOUND_ROWS *")
            ->from((new \ChatMessagesModel())->getTableName())
            ->where("room_id", $room_id)
            ->orderBy("message_id", "DESC")
            ->limit($limit);

        //In base al cursore imposto il where della query
        if ($cursor) {
            $cursorData = self::getCursorData($cursor);
            if ($cursorData['type'] === self::BEFORE_CURSOR_PREFIX) {
                $qb->SQLWhere("message_id < $cursorData[reference]");
            } elseif ($cursorData['type'] === self::AFTER_CURSOR_PREFIX) {
                $qb->SQLWhere("message_id > $cursorData[reference]");
            }
        }

        $messaggi = $qb->execute(true);

        if (count($messaggi)) {
            $afterCursor = self::generateAfterCursor($messaggi[0]['message_id']);
            $beforeCursor = self::generateBeforeCursor(end($messaggi)['message_id']);
        }

        foreach ($messaggi as &$m) {
            $m['content'] = nl2br(html_entity_decode(OpenSSLUtils::decryptContent($m['content']), ENT_QUOTES));
            if ($m['metadata']) $m['metadata'] = json_decode($m['metadata'], true);
        }

        return new FuxResponse("OK", null, [
            "messages" => $messaggi,
            "cursors" => [
                "after" => $afterCursor ?? null,
                "before" => $beforeCursor ?? null
            ]
        ]);
    }


    public static function saveMessage($room_id, $sender_id, $text, $auto = false, $metadata = null)
    {
        $otp = rand(10000, 99999) . rand(10000, 99999);
        $message_id = (new \ChatMessagesModel())->save([
            "room_id" => $room_id,
            "sender_id" => $sender_id,
            "type" => $auto ? \ChatMessagesModel::TYPE_TEXT_AUTO : \ChatMessagesModel::TYPE_TEXT,
            "otp" => $otp,
            "content" => OpenSSLUtils::encryptContent($text),
            "metadata" => $metadata ? \Fux\DB::sanitize(json_encode($metadata)) : null
        ]);
        if (!$message_id) {
            return new FuxResponse("ERROR");
        }

        return new FuxResponse("OK", null, ["message_id" => $message_id, "otp" => $otp]);
    }

    public static function checkMembership($room_id, $user_chat_id)
    {
        return (new \ChatRoomsModel())->getWhere("room_id = $room_id AND (user_id1 = $user_chat_id OR user_id2 = $user_chat_id)");
    }

}
