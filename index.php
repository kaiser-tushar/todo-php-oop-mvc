<?php
require_once 'vendor/autoload.php';

if(!defined('ROOT_DIR')){
    define('ROOT_DIR',__DIR__);
}

use App\Core\Config;
use App\Core\Route;

$config = new Config();
$route = new  Route($config);

