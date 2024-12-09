<?php

namespace App\Exceptions;

use Fux\Http\FuxResponse;
use Throwable;

class UnauthorizedAccessException extends \Fux\Exceptions\FuxException
{

    public function render($request, $exception)
    {
        return new FuxResponse("ERROR", "Non hai i permessi per accedere a questa risorsa", null, $this->canBePretty);
    }

}
