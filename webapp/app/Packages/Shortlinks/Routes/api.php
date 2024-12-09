<?php


use Fux\Routing\Request;
use Fux\Routing\Router;

\Fux\Routing\Routing::router()->prefix("/shortlinks/api", function ($router) {
    \Fux\Routing\Routing::router()->post('/v1/create', function (Request $request) {
        /**
         * @var array $body = [
         *      "url" => "https://",
         *      "api_key" => "abcd",
         * ]
        */
        $body = $request->getBody();
        if ($body['api_key'] !== SHORTLINKS_API_KEY) throw new \App\Exceptions\UnauthorizedAccessException();

        $shortlink = \App\Packages\Shortlinks\Shortlinks::getShortlink($body['url'],null,SHORTLINKS_BASE_URL);

        return \Fux\Http\FuxResponse::success(null, $shortlink);
    });
});
