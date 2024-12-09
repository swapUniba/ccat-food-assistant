<?php

namespace Fux\Http\Middleware;

use Fux\Exceptions\FuxException;
use Fux\Security\Encryption\Encrypter;

class DefaultCsrfProtectionMiddleware extends FuxMiddleware implements IMiddleware
{

    /**
     * @throws FuxException
     */
    public function handle()
    {

        $token = $this->getRequestToken();
        $realToken = csrf_token();

        if (ADD_XSRF_TOKEN_COOKIE) {
            $this->addCsrfTokenCookie();
        }

        if (
            $this->isReading() || //Only post requests are checked
            $this->isExcludedRoute() || //Only NOT excluded routes are checked
            (is_string($realToken) && is_string($token) && hash_equals($realToken, $token)) //Check if token is the same
        ) {
            return $this->resolve();
        }

        throw new FuxException(false, "CSRF token mismatch.");
    }

    protected function getRequestToken()
    {
        //Check if the post request has a _token property
        $body = $this->request->getBody();
        if (isset($body['_token'])) return $body['_token'];

        $headers = $this->request->headers();
        //Check X-CSRF-TOKEN in request header
        if (isset($headers['X-CSRF-TOKEN'])) return $headers['X-CSRF-TOKEN'];

        //Check the encrypted X-XSRF-TOKEN
        if (isset($headers['X-XSRF-TOKEN'])) return Encrypter::decrypt($headers['X-XSRF-TOKEN']);

        return null;
    }

    protected function addCsrfTokenCookie()
    {
        setcookie('XSRF-TOKEN', csrf_token(), time() + XSRF_TOKEN_COOKIE_LIFETIME, PROJECT_DIR);
    }

    protected function isReading()
    {
        return in_array($this->request->requestMethod, ['HEAD', 'GET', 'OPTIONS']);
    }

    protected function isExcludedRoute()
    {
        foreach (CSRF_EXCUDED_ROUTES as $route) {
            if ($this->request->matchRoute($route)) return true;
        }
        return false;
    }
}
