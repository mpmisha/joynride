<?php

	 include('db_conf.php');

	##########################################################################################
	#Usage: 
	#?tran_id=100&pass_id=1&reply=1
	
	#reply can be: 1 (driver has been informed and approved) or 2 (driver has been informed and rejected)
	##########################################################################################

	$tran_id = $_GET['tran_id'];
	$pass_id = $_GET['pass_id'];
	$reply = $_GET['reply'];

	$query = mysql_query("UPDATE requests SET req_status = $reply WHERE tran_id = $tran_id AND hiker_id = $pass_id;");
 
	if(!$query){
		$returned_arr = array('error' => 'Server is down');
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
	}

?>