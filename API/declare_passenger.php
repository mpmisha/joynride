<?php

	 include('db_conf.php');

	##########################################################################################
	#Usage: 
	#?tran_id=100&pass_id=1&src=Ashdod&src_pass_x=31.804381&src_pass_y=34.655314&dst=Tel-Aviv&dst_pass_x=32.0852999&dst_pass_y=34.7817676
	##########################################################################################

	$tran_id = $_GET['tran_id'];
	$pass_id = $_GET['pass_id'];
	$src = $_GET['src'];
	$src_pass_x = $_GET['src_pass_x'];
	$src_pass_y = $_GET['src_pass_y'];
	$dst = $_GET['dst'];
	$dst_pass_x = $_GET['dst_pass_x'];
	$dst_pass_y = $_GET['dst_pass_y'];

 $query = mysql_query("INSERT INTO passengers VALUES ($tran_id, $pass_id, '$src', $src_pass_x, $src_pass_y, '$dst', $dst_pass_x, $dst_pass_y);");
 
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