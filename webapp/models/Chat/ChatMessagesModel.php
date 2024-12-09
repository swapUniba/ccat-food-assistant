<?php

class ChatMessagesModel extends FuxModel
{

    const TYPE_TEXT = 'text';
    const TYPE_TEXT_AUTO = 'auto';
    const TYPE_MEDIA = 'media';

    public function __construct()
    {
        $this->setTableName("chat_messages");
        $this->setTableFields(["message_id", "room_id", "sender_id", "type", "content", "is_read", "otp", "created_at", "metadata"]);
        $this->setPkField(["message_id"]);
    }
}
