<?php

namespace Fux\Exceptions;


use Fux\Http\FuxResponse;
use Fux\Routing\Request;

/**
 * Permette di gestire le eccezioni Fux tramite il metodo render, mentre ripete il throw di ogni altro tipo di eccezione
 */
class Handler
{

    /**
     * @throws \Exception
     * @return void | string | FuxResponse
     */
    public static function handle(Request $request, \Exception $e){
        if ($e instanceof FuxException){
            return $e->render($request, $e);
        }else{
            throw $e;
        }
    }

}
