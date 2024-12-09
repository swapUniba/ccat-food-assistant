<?php

class ChatUsersModel extends \Fux\Database\Model\Model
{
    protected static $tableName = 'chat_users';
    protected static $tableFields = [
        "chat_user_id", "created_at"
    ];
    protected static $primaryKey = ["chat_user_id"];

}
