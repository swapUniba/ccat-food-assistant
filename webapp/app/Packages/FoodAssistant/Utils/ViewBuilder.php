<?php

namespace App\Packages\FoodAssistant\Utils;

class ViewBuilder
{

    /**
     * @param string $title
     * @param string $view
     * @param array $viewData
     * @param string $viewPackage
     */
    public function __construct(public string $title, public string $view, public array $viewData = [], public string $viewPackage = 'FoodAssistant')
    {
    }

    public function __toString()
    {
        return view("core/template", [
            "title" => $this->title,
            "view" => $this->view,
            "viewData" => $this->viewData,
            "viewPackage" => $this->viewPackage,
        ], 'FoodAssistant');
    }

}
