<?php

namespace Fux\Http\Sessions;

use Fux\Database\Model\Model;
use Fux\DB;

class PhpSessionsModel extends Model
{

    protected static $tableName = 'php_sessions';
    protected static $tableFields = ["id", "data", "last_access_timestamp"];
    protected static $primaryKey = ["id"];

}

class MysqlSessionHandler implements \SessionHandlerInterface
{

    public function __construct() {
        session_set_save_handler(
            array($this, "open"),
            array($this, "close"),
            array($this, "read"),
            array($this, "write"),
            array($this, "destroy"),
            array($this, "gc")
        );
    }

    public function open($savePath, $sessionName)
    {
        return true;
    }

    public function close()
    {
        return true;
    }

    public function read($id)
    {
        $session = PhpSessionsModel::get(DB::sanitize($id));
        return $session ? $session->data ?? '' : ''; //https://stackoverflow.com/a/48245947
    }

    public function write($id, $data)
    {
        return !!PhpSessionsModel::save([
            "id" => DB::sanitize($id),
            "data" => DB::sanitize($data),
            "last_access_timestamp" => time()
        ]);
    }

    public function destroy($id)
    {
        return !!PhpSessionsModel::delete(DB::sanitize($id));
    }

    public function gc($maxlifetime)
    {
        $ts = time() - intval($maxlifetime);
        return !!PhpSessionsModel::deleteWhere("last_access_timestamp < $ts");
    }
}