<?php
	
    include('db_conf.php');
	
	###################################################
	#Usage: ?userName=guylitvak&password=g123
	###################################################
	
	$userName = $_GET['userName'];
	$password = $_GET['password'];
		
	$query = mysql_query("SELECT user_id, password FROM authentication WHERE user_name = '$userName'");
	$array = mysql_fetch_array($query);
	$length = mysql_num_rows($query);
	if ($length == 0) {
		$returned_arr = array('error'=>'No such user name');
	}
	else {
		$my_pass = $array[1];
		if (strcmp($my_pass , $password) == 0) {
			$returned_arr = array("user_id" => (int)$array[0]);
		}
		else {
			$returned_arr = array('error' => 'Wrong password');
		}
	}
	$reply = json_encode($returned_arr);
	
			if(array_key_exists('callback', $_GET)){

				header('Content-Type: text/javascript; charset=utf8');
				header('Access-Control-Allow-Origin: http://localhost:8080/');
				header('Access-Control-Max-Age: 3628800');
				header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');

				$callback = $_GET['callback'];
				echo $callback.'('.$reply.');';

			}else{
				// normal JSON string
				header('Content-Type: application/json; charset=utf8');

				echo $reply;
			}
?>