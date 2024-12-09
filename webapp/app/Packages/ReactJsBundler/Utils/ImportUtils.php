<?php

namespace App\Packages\ReactJsBundler\Utils;

class ImportUtils
{

    /**
     * This method returns the package name if the import statement is of the type root file import a package file
     * (example: import {MyComponent} from "../../app/Packages/MyPackage/React/MyComponent/MyComponent")
     *
     * @param string $importedComponentDir The "relative" location of the component that need to be imported
     *
     * @return bool | String
     */
    public static function isRootImportPackageStatement(string $importedComponentDir)
    {

        $matches = [];
        if (!preg_match("#app/Packages/([a-zA-Z0-9._-]+)/React#m", $importedComponentDir, $matches)) return false;

        return $matches[1];
    }

    /**
     * This method returns true is the import statement is of the type package file import a root file
     * (example: import {MyComponent} from "../../../../../../public/react-components/MyComponent/MyComponent")
     *
     * @param string $importedComponentDir The "relative" location of the component that need to be imported
     *
     * @return bool
     */
    public static function isPackageImportRootStatement(string $importedComponentDir)
    {
        return preg_match("#public/react-components/#m", $importedComponentDir) == 1;
    }


    /**
     * Returns a list of JS import statements
     *
     * @param string $src The source code
     *
     * @return array{statement: string, import:string, from:string}[] = [[
     *          "statement" => "import {MyComponent} from './MyDirectory';",
     *          "import" => "{MyComponent}",
     *          "from" => "./MyDirectory"
     * ]]
     */
    public static function extractJsImportStatements(string $src): array
    {
        $imports = [];
        $matches = [];
        preg_match_all('/import\s+([a-zA-Z0-9{},\s_*]*)\s+from\s+["\']([a-zA-Z0-9\/._-]*)["\']/m', $src, $matches, PREG_SET_ORDER);
        foreach ($matches as $m) {
            $imports[] = [
                "statement" => $m[0],
                "import" => $m[1],
                "from" => $m[2],
            ];
        }
        return $imports;
    }


    /**
     * Returns a list of CSS import statements
     *
     * @param string $src The source code
     *
     * @return array{statement: string, import:string}[] = [[
     *      "statement" => "import './MyDirectory/style.css';",
     *      "import" => "./MyDirectory/style.css"
     * ]]
     */
    public static function extractCSSImportStatements(string $src): array
    {
        $imports = [];
        $matches = [];
        preg_match_all('/import "([a-zA-Z0-9\/._-]*)"|import \'([a-zA-Z0-9\/._-]*)\'/m', $src, $matches, PREG_SET_ORDER);
        foreach ($matches as $m) {
            $imports[] = [
                "statement" => $m[0],
                "import" => ($m[1] ?? '') ?: ($m[2] ?? ''),
            ];
        }
        return $imports;
    }

    /**
     * Returns a Javascript snippets that can be used to import a CSS file in the page.
     *
     * @param string $absoluteFilePath Absolute CSS file path
     *
     * @return string
     */
    public static function getCssImportReplacementString(string $absoluteFilePath): string
    {
        $content = file_get_contents($absoluteFilePath);
        return "
            (function (css) {
                var head = document.head || document.getElementsByTagName('head')[0];
                var style = document.createElement('style');
                head.appendChild(style);
                style.appendChild(document.createTextNode(css));
            })(`$content`);
        ";
    }
}
