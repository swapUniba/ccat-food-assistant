<?php

namespace App\Exceptions;

use Fux\Http\FuxResponse;

class UnexpectedErrorException extends \Fux\Exceptions\FuxException
{

    public function render($request, $exception)
    {
        return new FuxResponse("ERROR", "Si è verificato un errore inatteso. Riprova più tardi...", null, $this->canBePretty);
    }

}
