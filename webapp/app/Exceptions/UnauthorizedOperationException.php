<?php

namespace App\Exceptions;

use Fux\Http\FuxResponse;
use Throwable;

class UnauthorizedOperationException extends \Fux\Exceptions\FuxException
{

    public function render($request, $exception)
    {
        return new FuxResponse("ERROR", "Non hai i permessi per completare questa azione", null, $this->canBePretty);
    }

}
