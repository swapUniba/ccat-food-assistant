<?php

require_once(__DIR__.'/FuxView.php');

class FuxViewComposerManager
{

    private static $registeredViews = [];

    /**
     * @description Register a composable view, attaching an alias to it and a callback function
     * to retrieve data to pass to the view
     * @param string $viewAlias The public name of the composed view which can be used by the "view()" helper
     * @param string $viewPath The path to the view file relative to the project global "view" directory
     * @param callable $dataCallback A function which return an object that will be passed as data of the composed view
     * @param string | null $package If it is a string, it represents the name of the Package folder. In the package folder must
     * exists a "Views" folder that will be used as base dir to search for the viewName
    */
    public static function register($viewAlias, $viewPath, $dataCallback, $package = null){
        self::$registeredViews[$viewAlias] = new FuxView($viewPath, $dataCallback, $package);
    }

    /**
     * @description Return a FuxView instance if the composed view has been registered before
     * @param string $viewAlias The public name of the composed view
     * @return FuxView | null
     */
    public static function getView($viewAlias){
        if (isset(self::$registeredViews[$viewAlias])){
            return self::$registeredViews[$viewAlias];
        }
        return null;
    }

}
