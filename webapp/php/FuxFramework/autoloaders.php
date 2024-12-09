<?php


/* ##########################
 * Autoloader per i models
 * ########################## */
$_MODELS_FILESYSTEM_TREE = null;
spl_autoload_register(function ($className) {
    global $_MODELS_FILESYSTEM_TREE;
    if (strpos($className, "App\Models") !== false) { //Model con namespace PSR
        $relativeClassPath = str_replace("App/Models", "", str_replace("\\", "/", $className));
        $filePath = __DIR__ . "/../../models/$relativeClassPath.php";
        if (file_exists($filePath)) {
            include_once $filePath;
        } else {
            throw new Exception("FuxAutoloaderException: Cannot autoload app class $className. File $filePath doesn't exists.");
        }
    } elseif (strpos($className, "Model") !== false) { //Model con scansione della directory "models"
        $files = $_MODELS_FILESYSTEM_TREE ?? rglob(PROJECT_ROOT_DIR . "/models/*.php");
        foreach ($files as $filePath) {
            $fileName = basename($filePath);
            if ($fileName === "$className.php") {
                include_once $filePath;
                break;
            }
        }
        if (!$_MODELS_FILESYSTEM_TREE) $_MODELS_FILESYSTEM_TREE = $files;
    }
});


/* ##########################
 * Autoloader per i file nella cartella \App
 * ########################## */
spl_autoload_register(function ($className) {
    if (strpos($className, "App\\") !== false && strpos($className, "App\Controllers") === false && strpos($className, "App\Models") === false) { //Controller con namespace PSR) {
        $relativeClassPath = str_replace("App/", "", str_replace("\\", "/", $className));
        $filePath = __DIR__ . "/../../app/$relativeClassPath.php";
        if (file_exists($filePath)) {
            include_once $filePath;
        } else {
            throw new Exception("FuxAutoloaderException: Cannot autoload app class $className in file path $filePath");
        }
    }
});


/* ##########################
 * Autoloader per i middlewares
 * ########################## */
$_MIDDLEWARES_FILESYSTEM_TREE = null;
spl_autoload_register(function ($className) {
    global $_MIDDLEWARES_FILESYSTEM_TREE;
    if (strpos($className, "Middleware")) {
        $files = $_MIDDLEWARES_FILESYSTEM_TREE ?? rglob(PROJECT_ROOT_DIR . "/middlewares/*.php");
        foreach ($files as $filePath) {
            $fileName = basename($filePath);
            if ($fileName === "$className.php") {
                include_once $filePath;
                break;
            }
        }
        if (!$_MIDDLEWARES_FILESYSTEM_TREE) $_MIDDLEWARES_FILESYSTEM_TREE = $files;
    }
});

/* ##########################
 * Autoloader per i controllers
 * ########################## */
$_CONTROLLERS_FILESYSTEM_TREE = null;
spl_autoload_register(function ($className) {
    global $_CONTROLLERS_FILESYSTEM_TREE;
    if (strpos($className, "App\Controllers") !== false) { //Controller con namespace PSR
        $relativeClassPath = str_replace("App/Controllers", "", str_replace("\\", "/", $className));
        $filePath = __DIR__ . "/../../controllers/$relativeClassPath.php";
        if (file_exists($filePath)) {
            include_once $filePath;
        } else {
            throw new Exception("FuxAutoloaderException: Cannot autoload app class $className. File $filePath doesn't exists.");
        }
    }
    if (strpos($className, "Controller")) { //Controller con scansione della directory "controllers"
        $classNameParts = explode("\\", $className);
        $className = end($classNameParts); //Rimuovo la parte di namespacing
        $files = $_CONTROLLERS_FILESYSTEM_TREE ?? rglob(PROJECT_ROOT_DIR . "/controllers/*.php");
        $found = false;
        foreach ($files as $filePath) {
            $fileName = basename($filePath);
            if ($fileName === "$className.php") {
                $found = true;
                include_once $filePath;
                break;
            }
        }
        if (!$found) {
            throw new Exception("FuxAutoloaderException: Cannot autoload class $className");
        }

        if (!$_CONTROLLERS_FILESYSTEM_TREE) $_CONTROLLERS_FILESYSTEM_TREE = $files;
    }
});


/* ##########################
 * Autoloader per i file del framework Fux
 * ########################## */
spl_autoload_register(function ($className) {
    if (strpos($className, "Fux\\") !== false) {
        $relativeClassPath = str_replace("Fux/", "", str_replace("\\", "/", $className));
        $filePath = __DIR__ . "/../../php/FuxFramework/$relativeClassPath.php";
        if (file_exists($filePath)) {
            include_once $filePath;
        } else {
            throw new Exception("FuxAutoloaderException: Cannot autoload app class $className");
        }
    }
});
