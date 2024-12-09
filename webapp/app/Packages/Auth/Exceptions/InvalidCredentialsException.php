<?php

namespace App\Packages\Auth\Exceptions;

use Fux\Http\FuxResponse;

class InvalidCredentialsException extends \Fux\Exceptions\FuxException
{

    public function render($request, $exception)
    {
        return new FuxResponse("ERROR", "Le credenziali inserite non sono corrette", null, $this->canBePretty);
    }

}
