<?php

namespace App\Exceptions;

use Fux\Http\FuxResponse;
use Throwable;

class ResourceNotFoundException extends \Fux\Exceptions\FuxException
{

    public function render($request, $exception)
    {
        return new FuxResponse("ERROR", "Sembra che l'elemento selezionato non esista più.", null, $this->canBePretty);
    }

}
