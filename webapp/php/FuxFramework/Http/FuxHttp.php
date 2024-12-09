<?php

namespace Fux\Http;

use App\Exceptions\UnexpectedErrorException;
use Fux\Exceptions\FuxException;
use Fux\Http\FuxResponse;

class FuxHttp
{

    /**
     * Perform a POST request to an endpoint and return a FuxResponse
     *
     * @param string $url
     * @param array $body
     * @param array $options = [
     *     "enable_ssl_verifypeer" => true | false,
     *     "enable_ssl_verifyhost" => true | false,
     * ]
     *
     * @return FuxResponse
     * @throws UnexpectedErrorException
     * @throws FuxException
     */
    public static function post($url, $body, $options = [])
    {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_FAILONERROR, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HEADER, false);
        curl_setopt($curl, CURLOPT_POST, true);
        if (!($options['enable_ssl_verifypeer'] ?? false)) curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        if (!($options['enable_ssl_verifyhost'] ?? false)) curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($body));
        $result = curl_exec($curl);
        curl_close($curl);

        if (!$result) {
            $e = curl_error($curl);
            if ($e) throw new FuxException(false, $e);
        }

        $jsonResponse = json_decode($result, true);
        if (!$jsonResponse) throw new FuxException(false, "The returned HTTP response is not a JSON string: $result");

        return FuxResponse::fromArray($jsonResponse);
    }


    /**
     * Perform a GET request to an endpoint and return a FuxResponse
     *
     * @param string $url
     * @param array $body
     * @param array $options = [
     *     "enable_ssl_verifypeer" => true | false,
     *     "enable_ssl_verifyhost" => true | false,
     * ]
     *
     * @return FuxResponse
     * @throws UnexpectedErrorException
     * @throws FuxException
     */
    public static function get($url, $params = [], $options = [])
    {
        if ($params) {
            $url .= "?" . http_build_query($params);
        }
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_URL, $url);
        curl_setopt($curl, CURLOPT_FAILONERROR, true);
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($curl, CURLOPT_HEADER, false);
        if (!($options['enable_ssl_verifypeer'] ?? false)) curl_setopt($curl, CURLOPT_SSL_VERIFYPEER, false);
        if (!($options['enable_ssl_verifyhost'] ?? false)) curl_setopt($curl, CURLOPT_SSL_VERIFYHOST, false);
        $result = curl_exec($curl);
        curl_close($curl);

        if (!$result) throw new UnexpectedErrorException();

        $e = curl_error($curl);
        if ($e) throw new FuxException(false, $e);

        $jsonResponse = json_decode($result, true);
        if (!$jsonResponse) throw new FuxException(false, "The returned HTTP response is not a JSON string");

        return FuxResponse::fromArray($jsonResponse);
    }

}
