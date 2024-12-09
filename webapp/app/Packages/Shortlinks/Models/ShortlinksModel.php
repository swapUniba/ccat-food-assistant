<?php

namespace App\Packages\Shortlinks\Models;

use App\Packages\Shortlinks\Shortlinks;

/**
 * @property int $link_id
 * @property int $owner_id
 * @property string $name
 * @property string $original_url
 * @property string $created_at
 * @property string $updated_at
 */
class ShortlinksModel extends \Fux\Database\Model\Model
{
    protected static $tableName = 'shortlinks';
    protected static $tableFields = ['link_id', 'original_url', 'owner_id', 'name', 'created_at', 'updated_at'];
    protected static $primaryKey = ['link_id'];

    public function getShortURL($baseUrl = null, $isQRCode = false): string
    {
        return Shortlinks::getUrlFromLinkId($this->link_id, $baseUrl) . ($isQRCode ? '?utm_content=__bznqrcode' : '');
    }
}
