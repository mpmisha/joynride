<?php

#USAGE example: ?id=4

include('db_conf.php');
include('lib_functions.php');

$id = $_GET['id']; # user id
$reply = json_encode(get_traveller_info($id));

if(array_key_exists('callback', $_GET)){

				header('Content-Type: text/javascript; charset=utf8');
				header('Access-Control-Allow-Origin: http://localhost:8080/');
				header('Access-Control-Max-Age: 3628800');
				header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

				$callback = $_GET['callback'];
				echo $callback.'('.$reply.');';

}
else
{
				// normal JSON string
				header('Content-Type: application/json; charset=utf8');

				echo $reply;
}

?>