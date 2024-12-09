<?php

namespace Fux\Http\Middleware;


use Fux\Routing\Request;

interface IMiddleware{
    public function handle();
    public function setNext($closure);
    public function setRequest(Request $request);
}
