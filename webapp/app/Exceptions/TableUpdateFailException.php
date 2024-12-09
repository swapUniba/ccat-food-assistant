<?php

namespace App\Exceptions;

use Fux\Http\FuxResponse;
use Throwable;

class TableUpdateFailException extends \Fux\Exceptions\FuxException
{

    public function render($request, $exception)
    {
        return new FuxResponse("ERROR", "Qualcosa è andato storto... riprova più tardi!", null, $this->canBePretty);
    }

}
