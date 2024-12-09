<?php

class ChatRoomsModel extends FuxModel
{
    const TYPO_AI_ASSISTANT = 'ai_assistant';
    const TYPO_AI_ASSISTANT_ARCHIVED = 'archived';

    public function __construct()
    {
        $this->setTableName("chat_rooms");
        $this->setTableFields(["room_id", "user_id1", "user_id2", "type", "created_at"]);
        $this->setPkField(["room_id"]);
    }
}
