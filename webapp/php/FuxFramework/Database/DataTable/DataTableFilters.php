<?php

namespace Fux\Database\DataTable;

use Fux\DB;
use Fux\FuxQueryBuilder;

class DataTableFilters
{

    public static function applyFilters($queryBuilder, $filterString, $alias = null)
    {
        $filters = json_decode(base64_decode($filterString), true) ?? [];
        $qb = (new FuxQueryBuilder())->select("*")->from($queryBuilder, $alias);
        foreach ($filters as $k => $f) {
            $k = DB::sanitize($k);
            $v = $f['value'];
            if (is_array($v)){
                sanitize_object($v);
            }else{
                $v = DB::sanitize($v);
            }
            switch ($f['condition']) {
                case 'equal':
                    $qb->where($k, $v);
                    break;
                case 'equal_date':
                    $qb->SQLWhere("DATE($k) = '$v'");
                    break;
                case 'in_set':
                    $qb->whereIn($k, $v);
                    break;
                case 'greater':
                    $qb->whereGreaterThan($k, $v);
                    break;
                case 'greaterEq':
                    $qb->whereGreaterEqThan($k, $v);
                    break;
                case 'lower':
                    $qb->whereLowerThan($k, $v);
                    break;
                case 'lowerEq':
                    $qb->whereLowerEqThan($k, $v);
                    break;
                case 'between_exclusive':
                    $qb->whereGreaterThan($k, $v['start'])->whereLowerThan($k, $v['end']);
                    break;
                case 'between_inclusive':
                    $qb->whereGreaterEqThan($k, $v['start'])->whereLowerEqThan($k, $v['end']);
                    break;
                case 'between_inclusive_left':
                    $qb->whereGreaterEqThan($k, $v['start'])->whereLowerThan($k, $v['end']);
                    break;
                case 'between_inclusive_right':
                    $qb->whereGreaterThan($k, $v['start'])->whereLowerEqThan($k, $v['end']);
                    break;
                case 'concat_contain':
                    $qb->unsafe_setFieldStringificationDisable(true);
                    $keywords = explode(" ", $v);
                    $_sql = [];
                    foreach ($keywords as $kw) {
                        $_sql[] = "CONCAT_WS(' ',$k) LIKE '%$kw%'";
                    }
                    $qb->SQLWhere("(" . implode(" AND ", $_sql) . ")");
                    $qb->unsafe_setFieldStringificationDisable(false);
                    break;
                case 'concat_contain_exact_word':
                    $qb->unsafe_setFieldStringificationDisable(true);
                    $keywords = explode(" ", $v);
                    $_sql = [];
                    foreach ($keywords as $kw) {
                        $_sql[] = "CONCAT_WS(' ',$k) REGEXP '[[:<:]]" . $kw . "[[:>:]]'";
                    }
                    $qb->SQLWhere("(" . implode(" AND ", $_sql) . ")");
                    $qb->unsafe_setFieldStringificationDisable(false);
                    break;
                case 'contain':
                default:
                    $qb->whereLike($k, "%$v%");
            }
        }
        return $qb;
    }

}
