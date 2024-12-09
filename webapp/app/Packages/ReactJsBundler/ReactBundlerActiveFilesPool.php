<?php

namespace App\Packages\ReactJsBundler;


class ReactBundlerActiveFilesPool
{

    private static array $files_as_key = []; //each key is file path, each value is the position include queue
    private static array $files = [];


    public static function addBulk(array $filesAbsPaths): bool
    {
        foreach ($filesAbsPaths as $fileAbsPath) self::add($fileAbsPath);
        return true;
    }

    public static function add(string $fileAbsPath): bool
    {
        if (self::contain($fileAbsPath)) return true;
        $idx = count(self::$files);
        self::$files[] = $fileAbsPath;
        self::$files_as_key[$fileAbsPath] = $idx;
        return true;
    }

    public static function remove(string $fileAbsPath): bool
    {
        $idx = self::$files_as_key[$fileAbsPath] ?? null;
        if ($idx === null) return true;
        unset(self::$files_as_key[$fileAbsPath]);
        unset(self::$files[$idx]);
        return true;
    }

    public static function contain(string $fileAbsPath): bool
    {
        return isset(self::$files_as_key[$fileAbsPath]);
    }

    public static function clear(): void
    {
        self::$files_as_key = [];
        self::$files = [];
    }

    public static function getFiles(): array
    {
        return self::$files;
    }

}
