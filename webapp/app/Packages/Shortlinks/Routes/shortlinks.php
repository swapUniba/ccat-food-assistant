<?php


use Fux\Routing\Request;
use Fux\Routing\Router;


\Fux\Routing\Routing::router()->prefix("/shortlinks", function ($router) {
    \Fux\Routing\Routing::router()->get('/v1/{linkIdBase30}', function (Request $request) {
        $linkId = base_convert($request->getParams()['linkIdBase30'] ?? 0, 30, 10);
        $shortlink = \App\Packages\Shortlinks\Models\ShortlinksModel::get($linkId);
        if (!$shortlink) {
            http_response_code(404);
            die();
        }

        $redirectUrl = $shortlink->original_url;
        if (!empty($queryStringParams)) $redirectUrl = merge_query_params($shortlink->original_url, $queryStringParams);

        header("Location: $redirectUrl");
        exit;
    });
});
