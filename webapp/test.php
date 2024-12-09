<?php

use Albocode\CcatphpSdk\CCatClient;
use Albocode\CcatphpSdk\Clients\HttpClient;
use Albocode\CcatphpSdk\Clients\WSClient;
use Albocode\CcatphpSdk\Model\Message;

require_once __DIR__ . '/php/FuxFramework/bootstrap.php';

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Accept, Authorization, X-Requested-With, Application");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, HEAD");


$cCatClient = new CCatClient(
    new WSClient(CHESHIRE_CAT_HOSTNAME, CHESHIRE_CAT_PORT, CHESHIRE_CAT_USE_SSL),
    new HttpClient(CHESHIRE_CAT_HOSTNAME, CHESHIRE_CAT_PORT, CHESHIRE_CAT_API_KEY)
);

$assistantPrompt =  "Hello who are you?";


$result = $cCatClient->sendMessage(new Message($assistantPrompt, 'user', [
    "user" => [
        'first_name' => "Test",
        'last_name' => "User",
    ]
]));

print_r_pre($result);

