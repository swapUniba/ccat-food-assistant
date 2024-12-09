<?php

namespace App\Packages\Auth\Exceptions;

use Fux\Http\FuxResponse;
use Throwable;

class OtpThrottlingLimitException extends \Fux\Exceptions\FuxException
{

    private $throttling_seconds;

    public function __construct($throttling_seconds, $canBePretty = false, $message = '', $code = 0, Throwable $previous = null)
    {
        parent::__construct($canBePretty, $message, $code, $previous);
        $this->throttling_seconds = $throttling_seconds;
    }

    public function render($request, $exception)
    {
        return new FuxResponse("ERROR", "Puoi richiedere l'invio di un nuovo codice ogni $this->throttling_seconds secondi", null, $this->canBePretty);
    }

}
