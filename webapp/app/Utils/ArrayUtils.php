<?php

namespace App\Utils;

class ArrayUtils
{

    public static function groupByKey($array, $key, $keepField = true)
    {
        if (!$array || !is_array($array)) return [];
        $result = [];
        foreach ($array as $i => $item) {
            if (!isset($result[$item[$key]])) {
                $result[$item[$key]] = [];
            }
            $itemClone = $item;
            if (!$keepField) unset($itemClone[$key]);
            $result[$item[$key]][] = $itemClone;
        }
        return $result;
    }


    /**
     * Permette di rendere i valori di una colonna di una lista di array associativi omogenei (con stesse chiavi), la
     * chiave della corrispondente riga.
     *
     * Ad es. una lista del tipo
     *
     * $a = [
     *  ["id" => 1, "field1" => 2, "field2" => 3],
     *  ...,
     *  ["id" => 999, "field1" => 87, "field2" => 999],
     * ]
     *
     * In un oggetto del tipo
     *
     * $a = [
     *  1 => ["id" => 1, "field1" => 2, "field2" => 3],
     *  ...,
     *  999 => ["id" => 999, "field1" => 87, "field2" => 999],
     * ]
     *
     * utilizzando come $candidateKey la stringa "id".
     *
     * E' imporante che i valori di $candidateKey siano unici nella lista
     *
     * @param array $array
     * @param string $candidateKey
     *
     * @return array
     */
    public static function candidateColumnAsKey($array, $candidateKey)
    {
        $obj = [];
        foreach ($array as $a) $obj[$a[$candidateKey]] = $a;
        return $obj;
    }


    /**
     * Trasforma un array multidimensionale in un array monodimensionale dove ogni elemento è un elemento di uno dei sub-array
     * in $nestedArray
     *
     * @param array $nestedArray array multidimensionale
     *
     * @return array
     */
    public static function linearizeMultidimensionalArray($nestedArray, $recursive = false)
    {
        $mono = [];
        foreach ($nestedArray as $element) {
            if (is_array($element) && $recursive) {
                $mono[] = self::linearizeMultidimensionalArray($element, true);
            } else {
                $mono[] = $element;
            }
        }
        return $mono;
    }


    /**
     * Tests whether at least one element in the array passes the test implemented by the provided function. It returns
     * true if, in the array, it finds an element for which the provided function returns true; otherwise it returns
     * false. It doesn't modify the array.
     *
     * @param array $array
     * @param callable $fn
     * <p>
     * The function is called with the following arguments:
     * - $element: The current element being processed in the array.
     * - $index: The index of the current element being processed in the array.
     * - $array: The passed array
     * </p>
     *
     * @return bool
     */
    public static function some(array $array, callable $fn)
    {
        foreach ($array as $key => $value) {
            if ($fn($value, $key, $array)) {
                return true;
            }
        }
        return false;
    }


    /**
     * Return the first element in the array that passes the test implemented by the provided function. Otherwise it returns
     * NULL. It doesn't modify the array.
     *
     * @param array $array
     * @param callable $fn
     * <p>
     * The function is called with the following arguments:
     * - $element: The current element being processed in the array.
     * - $index: The index of the current element being processed in the array.
     * - $array: The passed array
     * </p>
     *
     * @return array
     */
    public static function find(array $array, callable $fn)
    {
        foreach ($array as $key => $value) {
            if ($fn($value, $key, $array)) {
                return $array[$key];
            }
        }
        return null;
    }


    /**
     * Return the first element index in the array that passes the test implemented by the provided function. Otherwise it returns
     * NULL. It doesn't modify the array.
     *
     * @param array $array
     * @param callable $fn
     * <p>
     * The function is called with the following arguments:
     * - $element: The current element being processed in the array.
     * - $index: The index of the current element being processed in the array.
     * - $array: The passed array
     * </p>
     *
     * @return mixed
     */
    public static function findKey(array $array, callable $fn)
    {
        foreach ($array as $key => $value) {
            if ($fn($value, $key, $array)) {
                return $key;
            }
        }
        return null;
    }


    /**
     * Convert a multidimensional associative array into a monodimensional associative array where each key is the result
     * of multiple keys concatenation in order to read the associated value (path-to-value).
     * WARNING: Keys should not contain the "." (dot) charachter in order to be properly managed, expecially if you plan
     *
     * @param array $array
     *
     * @return array
     */
    public static function flat($array, $separator = '')
    {
        $result = array();

        foreach ($array as $key => $value) {
            $new_key = $separator . (empty($separator) ? '' : '.') . $key;

            if (is_array($value)) {
                $result = array_merge($result, self::flat($value, $new_key));
            } else {
                $result[$new_key] = $value;
            }
        }

        return $result;
    }


    /**
     * Convert a monodimensional associative array obtained with "flat" method into a multidimensional associative array
     *
     * @param array $flatArray
     *
     * @return array
     */
    public static function unflat($flatArray)
    {
        $result = array();

        $setValueForKeyPath = function (&$array, $value, $keyPath) use(&$setValueForKeyPath) {
            $keys = explode(".", $keyPath, 2);
            $firstKey = $keys[0];
            $remainingKeys = (count($keys) == 2) ? $keys[1] : null;
            $isLeaf = ($remainingKeys == null);

            if ($isLeaf)
                $array[$firstKey] = $value;
            else
                $setValueForKeyPath($array[$firstKey], $value, $remainingKeys);
        };

        foreach ($flatArray as $path => $value) {
            $setValueForKeyPath($result, $value, $path);
        }

        return $result;
    }
}
