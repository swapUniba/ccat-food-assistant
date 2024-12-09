<?php

namespace App\Packages\Auth\Middlewares;



use Fux\Http\Middleware\FuxMiddleware;

class AuthLoggedInMiddleware extends FuxMiddleware
{

    protected $authenticatableClass = '';
    protected $redirectRoute = '';

    public function handle()
    {

        if (!\App\Packages\Auth\Auth::check($this->authenticatableClass)) {
            redirect($this->redirectRoute);
        }

        return $this->resolve();
    }
}
