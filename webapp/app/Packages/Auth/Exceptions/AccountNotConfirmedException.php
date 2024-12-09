<?php

namespace App\Packages\Auth\Exceptions;

use App\Packages\Auth\Contracts\Authenticatable;
use Fux\Http\FuxResponse;
use Throwable;

class AccountNotConfirmedException extends \Fux\Exceptions\FuxException
{

    private $user;

    public function __construct(Authenticatable $user, $canBePretty = false, $message = '', $code = 0, Throwable $previous = null)
    {
        parent::__construct($canBePretty, $message, $code, $previous);
        $this->user = $user;
    }

    public function render($request, $exception)
    {
        return new FuxResponse("ERROR", "Il tuo account non è stato confermato", null, $this->canBePretty);
    }

    /**
     * @return Authenticatable
    */
    public function getUser(){
        return $this->user;
    }

}
