<?php

namespace Fux\Routing;

use Fux\Http\Middleware\IMiddleware;

/**
 * La classe route deve fornire una interfaccia per il router e deve contenere al suo interno:
 * - route come string
 * - il metodo da eseguire quando viene richiamata
 * - una lista di middleware da utilizzare come filtri della richiesta HTTP
 */
class Route
{
    public $route = "/";
    public $closure = null;
    public $method = "get";
    public $middleware = [];

    public function __construct($httpMethod, $route, $closure)
    {
        $this->route = $route;
        $this->method = $httpMethod;
        if (is_callable($closure)) $this->closure = $closure;
    }

    public function middleware(IMiddleware $middleware)
    {
        $this->middleware[] = $middleware;
        return $this;
    }
}
