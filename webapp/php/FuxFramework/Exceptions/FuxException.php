<?php

namespace Fux\Exceptions;

use Fux\Http\FuxResponse;
use Fux\Routing\Request;
use Throwable;

class FuxException extends \Exception implements IFuxException
{

    protected $canBePretty = false;
    protected $metadata = null;

    public function __construct($canBePretty = false, $message = '', $code = 0, Throwable $previous = null, $metadata = null)
    {
        parent::__construct($message, $code, $previous);
        $this->canBePretty = $canBePretty;
        $this->metadata = $metadata;
    }

    /**
     * Create a FuxException with a generic Exception Instance
     *
     * @param \Exception $e
     *
     * @return FuxException
     */
    public static function fromException(\Exception $e){
        return new FuxException(false, $e->getMessage(), $e->getCode(), $e->getPrevious());
    }

    /**
     * Report the exception.
     *
     * @return void
     */
    public function report()
    {
        //
    }

    /**
     * Render the exception into an HTTP response.
     *
     * @param Request $request
     * @param \Exception $exception
     *
     * @return string | FuxResponse
     */
    public function render(Request $request, \Exception $exception)
    {
        return new FuxResponse("ERROR", $exception->getMessage(), null, $this->canBePretty);
    }

    public function getMetadata(){
        return $this->metadata;
    }
}
