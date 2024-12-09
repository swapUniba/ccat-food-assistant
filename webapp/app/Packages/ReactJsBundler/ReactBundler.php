<?php

namespace App\Packages\ReactJsBundler;

use App\Packages\ReactJsBundler\Utils\FileReader;

class ReactBundler
{

    /**
     * This function create a code bundle starting from a single react component file. It generates a string that is
     * a concatenation of all JS files involved in the React component.
     *
     * @param string $componentFilePath The component file path
     * @param string| null $package The package name in which is stored the component
     * @param bool $useProductionFiles Whether to use the ".js" files or not
     */
    public static function bundle(string $componentFilePath, bool $useProductionFiles = false, string|null $package = null, $caching = REACT_BUNDLER_CACHING): string
    {

        if (!str_ends_with($componentFilePath,".jsx") && !str_ends_with($componentFilePath,".js")){
            $componentFilePath .= ".jsx";
        }

        $componentAbsDir = $package ?
            PROJECT_ROOT_DIR . "/app/Packages/$package/React/" . trim($componentFilePath, "/")
            :
            PROJECT_ROOT_DIR . "/public/react-components/" . trim($componentFilePath, "/");

        if ($caching) {
            if ($src = self::getCachedBundle($componentAbsDir, $package, $useProductionFiles)) {
                ReactBundlerActiveFilesPool::addBulk(self::getCachedBundleIncludedFiles($componentAbsDir, $package, $useProductionFiles));
                return $src;
            }
        }

        $sourceCode = FileReader::read($componentAbsDir, $useProductionFiles, true);

        if ($caching) {
            self::saveCachedBundle($componentFilePath, $package, $useProductionFiles, $src, ReactBundlerActiveFilesPool::getFiles());
            ReactBundlerActiveFilesPool::clear(); //Pulisco i componenti già inclusi se il caching è attivo
        }
        return $sourceCode;
    }

    private static function getCachedBundle(string $componentRelativeDir, string|null $package = null, bool $useProductionFiles = false)
    {
        $cachedFiledir = self::getCachedBundleFileDir($componentRelativeDir, $package, $useProductionFiles);
        if (file_exists($cachedFiledir)) return file_get_contents($cachedFiledir);
        return false;
    }

    private static function getCachedBundleIncludedFiles(string $componentRelativeDir, string|null $package = null, bool $useProductionFiles = false)
    {
        $cachedFiledir = self::getCachedBundleFileDir($componentRelativeDir, $package, $useProductionFiles);
        if (file_exists($cachedFiledir . ".included.json")) return json_decode(file_get_contents($cachedFiledir . ".included.json"));
        return [];
    }

    private static function getCachedBundleFileDir(string $componentRelativeDir, string|null $package = null, bool $useProductionFiles)
    {
        $componentAbsDir = $package ?
            PROJECT_ROOT_DIR . "/public/build-bundle/__packages__/$package/" . trim($componentRelativeDir, "/")
            :
            PROJECT_ROOT_DIR . "/public/build-bundle/" . trim($componentRelativeDir, "/");

        return $componentAbsDir . ($useProductionFiles ? '.production' : '') . ".bundle.js";
    }

    private static function saveCachedBundle(string $componentRelativeDir, string|null $package = null, bool $useProductionFiles, string $src, array $includedComponents = [])
    {
        $filepath = self::getCachedBundleFileDir($componentRelativeDir, $package, $useProductionFiles);
        $dir = dirname($filepath);
        if (!is_dir($dir)) mkdir($dir, 0777, true);
        file_put_contents($filepath, $src);
        file_put_contents($filepath . ".included.json", json_encode($includedComponents));
    }
}
