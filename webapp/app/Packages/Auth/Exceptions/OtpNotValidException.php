<?php

namespace App\Packages\Auth\Exceptions;

use Fux\Http\FuxResponse;

class OtpNotValidException extends \Fux\Exceptions\FuxException
{

    public function render($request, $exception)
    {
        return new FuxResponse("ERROR", "Il codice inserito è scaduto o non è valido", null, $this->canBePretty);
    }

}
