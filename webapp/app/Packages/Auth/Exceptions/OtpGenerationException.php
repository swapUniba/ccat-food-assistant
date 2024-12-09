<?php

namespace App\Packages\Auth\Exceptions;

use Fux\Http\FuxResponse;

class OtpGenerationException extends \Fux\Exceptions\FuxException
{

    public function render($request, $exception)
    {
        return new FuxResponse("ERROR", "Qualcosa è andato storto. Riprova più tardi!", null, $this->canBePretty);
    }

}
