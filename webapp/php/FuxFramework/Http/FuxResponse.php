<?php

namespace Fux\Http;

class FuxResponse implements \JsonSerializable
{

    const ERROR = 'ERROR';
    const SUCCESS = 'OK';
    const CONFIRM = 'CONFIRM';

    protected $response = [];
    protected $canBePretty = false;

    public function __construct($status = null, $message = null, $data = null, $canBePretty = false)
    {
        if ($status !== null) $this->response['status'] = $status;
        if ($message !== null) $this->response['message'] = $message;
        if ($data !== null) $this->response['data'] = $data;
        $this->canBePretty = $canBePretty;
    }

    public function __toString()
    {
        return json_encode($this->response);
    }

    public function isOk()
    {
        return $this->response['status'] == self::SUCCESS;
    }

    public function isError()
    {
        return $this->response['status'] == self::ERROR;
    }

    public function isConfirm()
    {
        return $this->response['status'] == self::CONFIRM;
    }

    public function isPretty()
    {
        return $this->canBePretty;
    }

    public function getMessage()
    {
        return $this->response['message'] ?? null;
    }

    public function setMessage($message)
    {
        $this->response['message'] = $message;
    }

    public function getData()
    {
        return $this->response['data'] ?? null;
    }

    public function setData($data)
    {
        $this->response['data'] = $data;
    }

    public function getStatus()
    {
        return $this->response['status'] ?? null;
    }

    public function setStatus($status)
    {
        $this->response['status'] = $status;
    }

    public function jsonSerialize(): mixed
    {
        return $this->response;
    }

    /**
     * @param $array = [
     *      "status" => "ERROR" | "OK", //Optional
     *      "message" => "ab cd", //Optional
     *      "data" => mixed //Optional
     * ]
     * @return FuxResponse
     */
    public static function fromArray($array)
    {
        return new FuxResponse($array["status"] ?? null, $array["message"] ?? null, $array["data"] ?? null);
    }

    /**
     * @return FuxResponse
     */
    public static function success($message = null, $data = null)
    {
        return new FuxResponse(FuxResponse::SUCCESS, $message, $data);
    }

    /**
     * @return FuxResponse
     */
    public static function error($message = null, $data = null)
    {
        return new FuxResponse(FuxResponse::ERROR, $message, $data);
    }

}
