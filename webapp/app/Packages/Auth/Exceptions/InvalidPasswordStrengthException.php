<?php

namespace App\Packages\Auth\Exceptions;

use Fux\Http\FuxResponse;
use Throwable;

class InvalidPasswordStrengthException extends \Fux\Exceptions\FuxException
{

    private $explanation;

    public function __construct($explanation, $canBePretty = false, $message = '', $code = 0, Throwable $previous = null)
    {
        parent::__construct($canBePretty, $message, $code, $previous);
        $this->explanation = $explanation;
    }

    public function render($request, $exception)
    {
        return new FuxResponse("ERROR", "La password non rispetta il formato richiesto ($this->explanation)", null, $this->canBePretty);
    }

}
