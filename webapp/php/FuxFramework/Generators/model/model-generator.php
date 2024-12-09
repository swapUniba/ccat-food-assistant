<?php

use App\Models\ModuloServizi\SedeModel;
use Fux\Database\Model\Model;
use Fux\DB;

require_once __DIR__ . '/../../bootstrap.php';
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

function mysql_type_to_php_type($mysql_type)
{
    $t = explode("(", strtolower($mysql_type));
    if (!$t[0]) return null;
    $typeMapping = [
        "bit" => "int",
        "tinyint" => "int",
        "bool" => "int",
        "boolean" => "int",
        "smallint" => "int",
        "mediumint" => "int",
        "int" => "int",
        "integer" => "int",
        "double" => "float",
        "double precision" => "float",
        "decimal" => "float",
        "dec" => "float"
    ];
    return $typeMapping[$t[0]] ?? 'string';
}

if (isset($_GET['table'])) {
    $request = new \Fux\Routing\Request();
    $params = $request->getQueryStringParams();
    $tables = explode(",", $params['table']);
    foreach ($tables as $table) {
        $q = DB::ref()->query("SHOW COLUMNS FROM $table") or die(DB::ref()->error);
        $fields = $q->fetch_all(MYSQLI_ASSOC);
        $fieldList = array_map(function ($fieldData) {
            return [
                "field" => $fieldData['Field'],
                "php_type" => mysql_type_to_php_type($fieldData['Type'])
            ];
        }, $fields);
        $primaryKeys = array_column(array_filter($fields, function ($fieldData) {
            return $fieldData['Key'] === "PRI";
        }), "Field");
        $className = str_replace("_", '', ucwords($table, "_")) . "Model";
        $filename = "$className.php";
        $namespace = str_replace("/", "\\", $params['directory']);
        $directory = PROJECT_ROOT_DIR . "/models$params[directory]";

        $docCommentBlock = "";
        foreach ($fieldList as $fieldData) {
            $docCommentBlock .= " * @property $fieldData[php_type] $$fieldData[field]\n";
        }

        $fieldNameList = '"' . implode('", "', array_column($fieldList, "field")) . '"';
        $primaryKeysfieldNameList = '"' . implode('", "', $primaryKeys) . '"';

        $str = "<?php
namespace App\Models$namespace;

use Fux\Database\Model\Model;

/**
$docCommentBlock*/
class $className extends Model
{
    protected static \$tableName = '$table';
    protected static \$tableFields = [$fieldNameList];
    protected static \$primaryKey = [$primaryKeysfieldNameList];
}
    ";

        echo "<p><b>Model created in directory <i>$directory/$filename</i></b></p> ";

        if (!file_exists($directory)) {
            mkdir($directory, 0777, true);
        }
        file_put_contents($directory . "/" . $filename, $str);
    }
    die();
}
?>

<h1>Generate model file from database table</h1>
<form method="GET" target="_blank">
    <div>
        <label>Table name</label>
        <input type="text" name="table" placeholder="DB table name" style="width: 700px; max-width: 100%"/>
    </div>
    <br>
    <div>
        <label>Relative Directory</label>
        <input type="text" name="directory" placeholder="es. /ModuloServizi/Macchinari" style="width: 700px; max-width: 100%"/>
        <small>Relative to "/models"</small>
    </div>
    <br>
    <button>Generate file</button>
</form>
