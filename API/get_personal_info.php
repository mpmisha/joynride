<?php

#USAGE example: ?id=4

include('db_conf.php');
include('lib_functions.php');

$id = $_GET['id']; # user id

$query = mysql_query("SELECT user_name FROM authentication WHERE user_id = $id");
if (!$query){

	$returned_arr = array('error' => 'server is down');
}
else {
	
	$user_name = mysql_fetch_array($query)[0];
	$returned_arr = array_merge( array('username' => $user_name), get_traveller_info($id));
}

$reply = json_encode($returned_arr);

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