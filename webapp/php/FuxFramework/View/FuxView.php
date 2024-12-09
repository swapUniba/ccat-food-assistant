<?php
class FuxView {

    private $viewPath = "";
    private $dataCallback = null;
    private $package = null;

    /**
     * @description Create a View object which can be used to output the view to the client
     * @param string $viewPath The path to the view file relative to the project global "view" directory
     * @param callable $dataCallback A function which return an object that will be passed as data of the composed view
     * @param string | null $package If it is a string, it represents the name of the Package folder. In the package folder must
     * exists a "Views" folder that will be used as base dir to search for the viewName
     */
    public function __construct($viewPath, $dataCallback = null, $package = null)
    {
        $this->viewPath = $viewPath;
        $this->dataCallback = $dataCallback;
        $this->package = $package;
    }

    public function getPath(){
        return $this->viewPath;
    }

    public function getPackage(){
        return $this->package;
    }

    public function getData($params = []){
        if ($this->dataCallback && is_callable($this->dataCallback)){
            return call_user_func($this->dataCallback, $params);
        }
        return [];
    }

}
