<?php

namespace App\Packages\Shortlinks;

use App\Exceptions\TableUpdateFailException;
use App\Packages\Shortlinks\Models\ShortlinksModel;

class Shortlinks
{

    /**
     * Generate a shortlink and return it
     *
     * @param string $url
     * @param string $owner_id
     *
     * @throws TableUpdateFailException
     */
    public static function getShortlink($url, $owner_id = null, $baseUrl = null)
    {
        $link_id = ShortlinksModel::save([
            "original_url" => $url,
            "owner_id" => $owner_id
        ]);
        if (!$link_id) throw new TableUpdateFailException();

        return self::getUrlFromLinkId($link_id, $baseUrl);
    }

    public static function getUrlFromLinkId($link_id, $baseUrl = null)
    {
        $baseUrl = $baseUrl ?? routeFullUrl("/shortlinks/v1");
        return "$baseUrl/" . base_convert($link_id, 10, 30);
    }

}
