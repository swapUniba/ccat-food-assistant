<?php

namespace Fux\Routing;

use Fux\Http\FuxResponse;

include_once __DIR__ . '/../Http/Middleware/IMiddleware.php';
include_once 'Request.php';

class Router
{

    public static $currentRoute = null;

    private $request;

    private $commonMiddlewares = [];

    private $currentPrefix = '';

    private $supportedHttpMethods = array(
        "GET",
        "POST",
        "OPTIONS",
    );

    private $routes = [];

    function __construct(IRequest $request)
    {
        $this->request = $request;
    }

    function __call($httpMethod, $args)
    {
        list($route, $closure) = $args;
        if (!in_array(strtoupper($httpMethod), $this->supportedHttpMethods)) {
            $this->invalidMethodHandler();
        }

        $route = $this->currentPrefix.$route;

        $httpMethod = strtolower($httpMethod);

        $routeObject = new Route($httpMethod, $route, $closure);
        if (count($this->commonMiddlewares)) {
            foreach ($this->commonMiddlewares as $m) {
                $routeObject->middleware($m);
            }
        }
        $this->routes[$httpMethod][] = $routeObject;

        return $routeObject;
    }

    public function withMiddleware($middleware, $closure)
    {
        if (is_array($middleware)) {
            $this->commonMiddlewares = array_merge($this->commonMiddlewares, $middleware);
        } else {
            $this->commonMiddlewares[] = $middleware;
        }
        if (is_callable($closure)) $closure($this);
        $this->commonMiddlewares = [];
    }

    public function prefix($prefix, $closure)
    {
        $oldPrefix = $this->currentPrefix;
        $this->currentPrefix .= $prefix;
        if (is_callable($closure)) $closure($this);
        $this->currentPrefix = $oldPrefix;
    }

    /**
     * Add middlewares to the router
     * @param array $middlewares
     */
    public function addMiddlewares(array $middlewares): void
    {
        $this->commonMiddlewares = array_merge($this->commonMiddlewares, $middlewares);
    }

    /**
     * Removes trailing forward slashes from the right of the route.
     * @param route (string)
     */
    private function formatRoute($route)
    {
        $result = rtrim($route, '/');
        if ($result === '') {
            return '/';
        }
        return $result;
    }

    private function invalidMethodHandler()
    {
        header("{$this->request->serverProtocol} 405 Method Not Allowed");
    }

    private function defaultRequestHandler()
    {
        header("{$this->request->serverProtocol} 404 Not Found");
        if (file_exists(PROJECT_VIEWS_DIR . "/errors/404.php")) {
            view("errors/404.php");
            exit();
        }
    }

    /**
     * Resolves a route
     */
    function resolve()
    {
        //Seleziono solo le routes che corrispondono al metodo HTTP della mia request
        if (empty($this->routes)) return;
        $validHttpRoutes = $this->routes[strtolower($this->request->requestMethod)];

        $validRoute = null;


        //Cerco su tutte le routes valide se ce n'è una che matcha con il request uri attuale
        $pureRequestUri = strtok($this->request->requestUri, "?");
        foreach ($validHttpRoutes as $route) {
            if ($route->route === $pureRequestUri) {
                $validRoute = $route;
                break;
            }
            //Nuovo sistema
            $params = $this->match($route->route, $pureRequestUri);
            if ($params !== false) {
                $this->request->setParams($params);
                $validRoute = $route;
                break;
            }
        }

        if (is_null($validRoute)) {
            $this->defaultRequestHandler();
            return;
        }

        Router::$currentRoute = clone $validRoute;

        $middlewares = $validRoute->middleware;
        $numMiddlewares = count($middlewares);

        try {

            if ($numMiddlewares) {
                for ($i = 0; $i < $numMiddlewares; $i++) {
                    //Si fa una chain di middleware fino al penultimo. L'ultimo punta alla closure della route
                    $validRoute->middleware[$i]->setRequest($this->request);
                    if ($i < $numMiddlewares - 1) {
                        $validRoute->middleware[$i]->setNext($validRoute->middleware[$i + 1]);
                    } else {
                        $validRoute->middleware[$i]->setNext($validRoute->closure);
                    }

                }
                $output = $validRoute->middleware[0]->handle();
            } else {
                $output = call_user_func_array($validRoute->closure, array($this->request));
            }

        }catch(\Exception $e){
            $output = \Fux\Exceptions\Handler::handle($this->request, $e);
        }

        if ($output instanceof FuxResponse) {
            if ($output->isError() && $output->isPretty()) {
                if (file_exists(PROJECT_VIEWS_DIR . '/errors/fux.php')) {
                    view("errors/fux", ["errorMessage" => $output->getMessage()]);
                    exit();
                }
            }
            if ($output->isOk() && $output->isPretty()) {
                if (file_exists(PROJECT_VIEWS_DIR . '/success/fux.php')) {
                    $viewData = ["successMessage" => $output->getMessage()];
                    $responseData = $output->getData();
                    if (isset($responseData['forwardLink']) && isset($responseData['forwardLinkText'])) {
                        $viewData['forwardLink'] = $responseData['forwardLink'];
                        $viewData['forwardLinkText'] = $responseData['forwardLinkText'];
                    }
                    view("success/fux", $viewData);
                    exit();
                }
            }
            if (!headers_sent()) {
                header("Content-Type: application/json");
            }
        }

        echo $output;

    }

    function getRouteRegEx($route)
    {
        $params = $this->getRouteParamsName($route);
        foreach ($params as $p) {
            $route = str_replace("{{$p}}", "(.*)", $route);
        }
        return str_replace("/", "\\/", $route) . "$";
    }

    function getRouteParamsName($route)
    {
        $el = explode("/", $route);
        $params = [];
        foreach ($el as $p) {
            if (preg_match("/{(.*)}/", $p)) {
                $params[] = preg_replace("/({{1}|}{1})/", "", $p);
            }
        }
        return $params;
    }

    function getRouteSegments($route)
    {
        return explode("/", $route);
    }

    function isSegmentsParameter($segment)
    {
        return strpos($segment, "{") !== false && strpos($segment, "}") !== false;
    }

    function getSegmentParameterName($segment)
    {
        return str_replace("{", "", str_replace("}", "", $segment));
    }

    public function match($route, $request)
    {
        $params = [];
        $routeSegments = $this->getRouteSegments($route);
        $requestSegments = $this->getRouteSegments($request);
        if (count($requestSegments) != count($routeSegments)) return false;
        for ($i = 0; $i < count($routeSegments); $i++) {
            if ($this->isSegmentsParameter($routeSegments[$i])) { //Se si tratta di un parametro URL aggiorno l'elenco dei parametri
                $params[$this->getSegmentParameterName($routeSegments[$i])] = $requestSegments[$i];
            } elseif ($routeSegments[$i] !== $requestSegments[$i]) { //Se si tratta di un path verifico l'ugualianza
                return false;
            }
        }
        return $params;
    }

    function getCurrentMatchingRoute()
    {
        $validHttpRoutes = $this->routes[strtolower($this->request->requestMethod)];

        $validRoute = null;

        //Cerco su tutte le routes valide se ce n'è una che matcha con il request uri attuale
        $pureRequestUri = strtok($this->request->requestUri, "?");
        foreach ($validHttpRoutes as $route) {
            if ($route->route === $pureRequestUri) {
                $validRoute = $route;
                break;
            }
            //Nuovo sistema
            $params = $this->match($route->route, $pureRequestUri);
            if ($params !== false) {
                $this->request->setParams($params);
                $validRoute = $route;
                break;
            }
        }

        return $validRoute;
    }

    function __destruct()
    {
        $this->resolve();
    }
}







