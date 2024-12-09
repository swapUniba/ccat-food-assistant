<?php

namespace App\Packages\ReactJsBundler\Utils;

use App\Packages\ReactJsBundler\ReactBundlerActiveFilesPool;
use App\Utils\ArrayUtils;
use App\Utils\StringUtils;

class FileReader
{
    const EXPORT_STATEMENTS_REPLACE_MAP = [
        "export let" => "let",
        "export default let" => "let",
        "export var" => "var",
        "export default var" => "var",
        "export const" => "const",
        "export default const" => "const",
        "export function" => "function",
        "export default function" => "function",
        "export class" => "class",
        "export default class" => "class",
    ];

    const STD_REACT_IMPORTS = [
        ["import" => "React", "from" => "react"],
        ["import" => "PropTypes", "from" => "prop-types"],
    ];

    /**
     * Recursively read a file, and it's import statements, and produce a unique Javascript (or JSX) code string resulted
     * by the concatenation of all files
     */
    public static function read(string $componentAbsoluteFilePath, bool $useProductionFiles = false, $isEntryPoint = false): string
    {

        $fileAbsPath = $useProductionFiles ? self::developmentToProductionFilePath($componentAbsoluteFilePath) : $componentAbsoluteFilePath;

        $src = file_get_contents($fileAbsPath);
        if ($isEntryPoint) {
            $entryPointComponent = self::extractEntryPointComponent(file_get_contents($componentAbsoluteFilePath));
            $src .= "\n__REACT_BUNDLER_ENTRY_POINT_COMPONENT = $entryPointComponent;\n";
        }
        //Replacing all export [default] statements from the source code
        $src = str_replace(array_keys(self::EXPORT_STATEMENTS_REPLACE_MAP), array_values(self::EXPORT_STATEMENTS_REPLACE_MAP), $src);

        ReactBundlerActiveFilesPool::add($fileAbsPath);

        /**
         * @MARK: CSS import statements
         */
        $cssImports = ImportUtils::extractCSSImportStatements($src);
        foreach ($cssImports as $cssImport) {
            //Comment all import statements
            $src = str_replace($cssImport['statement'], "//" . $cssImport['statement'], $src);

            $workingDir = self::productionToDevelopmentFilePath(dirname($componentAbsoluteFilePath)); //CSS Files are always in same folder (production not exists)
            $importAbsDir = realpath($workingDir . DIRECTORY_SEPARATOR . $cssImport['import']);
            if (!$importAbsDir) throw new \RuntimeException("File " . $workingDir . DIRECTORY_SEPARATOR . $cssImport['import'] . " does not exists");
            if (ReactBundlerActiveFilesPool::contain($importAbsDir)) continue; //Already imported file

            //Join sources
            ReactBundlerActiveFilesPool::add($importAbsDir);
            $src = ImportUtils::getCssImportReplacementString($importAbsDir) . $src;
        }

        /**
         * @MARK: JS import statements
         */
        $jsImports = ImportUtils::extractJsImportStatements($src);
        $importsSrc = '';
        foreach ($jsImports as $jsImport) {
            //Comment all import statements
            $src = str_replace($jsImport['statement'], "//" . $jsImport['statement'], $src);

            //Ignore standard react imports
            if (ArrayUtils::find(
                self::STD_REACT_IMPORTS,
                fn($i) => $i['import'] == $jsImport['import'] && $i['from'] == $jsImport['from'])
            ) continue;

            //Get imported component abs dir
            $importAbsDir = self::getAbsDir($jsImport['from'], $fileAbsPath, $useProductionFiles ? "js" : "jsx");
            if (ReactBundlerActiveFilesPool::contain($importAbsDir)) continue; //Already imported file

            //Join sources
            $importsSrc .= self::read($importAbsDir, $useProductionFiles);
        }
        $src = $importsSrc . $src;


        return "\n\n //File:$componentAbsoluteFilePath\n $src \n\n";

    }

    private static function developmentToProductionFilePath($componentAbsoluteFilePath)
    {


        $packageName = ImportUtils::isRootImportPackageStatement($componentAbsoluteFilePath);
        if ($packageName) {
            //Get the imported file path relative to it's package react folder, by trimming all the string until the package dir
            $importedPackageRelativeDir = StringUtils::truncateAtSubstring($componentAbsoluteFilePath, "app/Packages/$packageName/React");

            $productionFilePath = PROJECT_ROOT_DIR . "/public/react-components-dist/__packages__/$packageName/" . trim($importedPackageRelativeDir, "/");
        } else {
            $productionFilePath = str_replace("/public/react-components/", "/public/react-components-dist/", $componentAbsoluteFilePath);
        }

        return str_replace(".jsx", ".js", $productionFilePath);

    }

    private static function productionToDevelopmentFilePath($componentAbsoluteFilePath)
    {

        $packageName = ImportUtils::isRootImportPackageStatement($componentAbsoluteFilePath);
        if ($packageName) {
            $devFilePath = $componentAbsoluteFilePath;
        } else {
            $devFilePath = str_replace("/public/react-components-dist/", "/public/react-components/", $componentAbsoluteFilePath);
        }

        return str_replace(".js", ".jsx", $devFilePath);

    }


    /**
     * This method returns the absolute location of a React component based on the file that need to be imported and
     * on the absolute location of the React component that want to import that file.
     *
     * @param string $importedComponentDir The "relative" location of the component that need to be imported
     * @param string $importerAbsComponentDir The absolute location of the component that need to be imported
     * @param string $fileExt The file extension of the component
     *
     * @return string The absolute dir of the imported component. The absolute dir will start with "PROJECT_ROOT_DIR"
     * constant content.
     */
    private static function getAbsDir(string $importedComponentDir, string $importerAbsComponentDir, string $fileExt): string
    {

        /**
         * We call "root" files those components files located in the ./public/react-components/* folder.
         * We call "package" files those files located in the ./app/Packages/{package_name}/React/* folder.
         * There are basically 4 types of imports based on the structure of the imported directory:
         * - root file import a root file: (example: import {MyComponent} from "./MyComponent/MyComponent")
         * - root file import a package file (example: import {MyComponent} from "../../app/Packages/MyPackage/React/MyComponent/MyComponent")
         * - package file import a root file (example: import {MyComponent} from "../../../../../../public/react-components/MyComponent/MyComponent")
         * - package file import a package file (example: import {MyComponent} from "../../../../MyPackage/React/MyComponent/MyComponent")
         *
         * As we can see when a same "file-type" import occurs there are no clear references about the location of the
         * imported file (if in the root react components dir or in a package's React folder), but we can understand it
         * by looking at the file that is importing. In this way we have basically 3 types of import to recognize
         * - root import package
         * - package import root
         * - root (or package, respectively) import root (or package, respectively)
         */
        $isImporterFileRoot = str_starts_with($importerAbsComponentDir, PROJECT_ROOT_DIR . '/public/react-components') && !str_contains($importerAbsComponentDir, 'react-components-dist/__packages__/');

        #print_r_pre(["importedComponentDir" => $importedComponentDir, "importerAbsComponentDir" => $importerAbsComponentDir,]);

        if ($isImporterFileRoot && $packageName = ImportUtils::isRootImportPackageStatement($importedComponentDir)) { //Root import package
            #echo "TIPO 1";
            //Get the imported file path relative to it's package react folder, by trimming all the string until the package dir
            $importedPackageRelativeDir = StringUtils::truncateAtSubstring($importedComponentDir, "app/Packages/$packageName/React");

            return PROJECT_ROOT_DIR . "/app/Packages/$packageName/React/" . trim($importedPackageRelativeDir, "/") . ".$fileExt";

        } elseif (!$isImporterFileRoot && ImportUtils::isPackageImportRootStatement($importedComponentDir)) { //Package import root
            #echo "TIPO 2";
            //Get the imported file path relative to root react folder, by trimming all the string until root dir
            $importedRootRelativeDir = StringUtils::truncateAtSubstring($importedComponentDir, "public/react-components");
            return PROJECT_ROOT_DIR . "/public/react-components/" . trim($importedRootRelativeDir, "/") . ".$fileExt";

        } else { //root (or package, respectively) import root (or package, respectively)
            #echo "TIPO 3";

            /**
             * In case of package import package the imported file path will contain the package "/React/" subfolder
             * which is excluded at compile time. We need to remove it (by checking also that the previous segment
             * is a valid Package folder) and we also need to remove an uplevel syntax (../) because we are basically
             * removing a folder
             * A possibile TODO is to check for real Package existence in app\Packages\ folder
             * */
            if (!$isImporterFileRoot) {
                $importedComponentDir = preg_replace('#\.\.\/([a-zA-Z0-9/._-]*)\/React\/#', '/$1/', $importedComponentDir);
            }

            // Get the directory part of the working file's absolute path
            $workingDir = dirname($importerAbsComponentDir);
            $path = realpath($workingDir . DIRECTORY_SEPARATOR . $importedComponentDir . ".$fileExt");

            if (!$path) throw new \RuntimeException("File " . $workingDir . DIRECTORY_SEPARATOR . $importedComponentDir . ".$fileExt does not exists");

            // Resolve the relative path to an absolute path
            return $path;
        }

    }

    /**
     * This method extract the first component name exported that serves as entry point
     */
    private static function extractEntryPointComponent(string $src): string
    {
        $pattern = '/\bexport\s+(?:default\s+)?(?:class|function)\s+(\w+)/';
        preg_match_all($pattern, $src, $matches);
        foreach ($matches[1] as $match) {
            return $match;
        }
        return '';
    }

}
