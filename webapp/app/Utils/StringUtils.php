<?php

namespace App\Utils;

class StringUtils
{

    public static function startsWith($haystack, $needle)
    {
        $length = strlen($needle);
        return substr($haystack, 0, $length) === $needle;
    }

    public static function endsWith($haystack, $needle)
    {
        $length = strlen($needle);
        if (!$length) {
            return true;
        }
        return substr($haystack, -$length) === $needle;
    }

    public static function getBetween($string, $start, $end)
    {
        $string = ' ' . $string;
        $ini = strpos($string, $start);
        if ($ini == 0) return '';
        $ini += strlen($start);
        $len = strpos($string, $end, $ini) - $ini;
        return substr($string, $ini, $len);
    }

    /**
     * Returns the remaining part of a string after a specified substring is encountered.
     *
     * @param string $str The input string.
     * @param string $substring The substring to search for.
     * @return string The remaining part of the string after the substring. Returns the original string if the substring is not found.
     */
    public static function truncateAtSubstring(string $str, string $substring): string
    {
        $position = strpos($str, $substring);
        if ($position === false) return $str;

        // Return the remaining part of the string after the substring
        return substr($str, $position + strlen($substring));
    }

}
