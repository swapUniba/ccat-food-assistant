<?php
/* GLOBAL VARIABLES */

include_once (__DIR__."/environment.php");

define("BRAND_NAME","Food Assistant");
define("PROJECT_NAME","Food Assistant");

define("OWNER_NAME", "Bookizon");
define("SITE_NAME", "Bookizon.it");
define("ROOT_DIR",$_SERVER['DOCUMENT_ROOT']);
define("PROJECT_ROOT_DIR", ROOT_DIR.PROJECT_DIR);
define("PROJECT_VIEWS_DIR", PROJECT_ROOT_DIR.'/views');
define("PROJECT_MODELS_DIR", PROJECT_ROOT_DIR.'/models');
define("ADMIN_CP_URL", "https://".DOMAIN_NAME.PROJECT_DIR."/admin/");
define("ALERT_EMAIL", "info@kubot.it");
define("PROJECT_URL", "https://".$_SERVER['SERVER_NAME'].PROJECT_DIR);

