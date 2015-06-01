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
	
	$returned_arr = array('status' => 'ok');


	

	
	
		if($reply == 1){
		
			$query = mysql_query("UPDATE transaction_info SET num_of_occupied_sits = num_of_occupied_sits + 1 WHERE transaction_id = $tran_id;");
				if(!$query){
				
					$returned_arr = array('error' => 'unable to join transaction');
				}
				else{
				
						$query = mysql_query("UPDATE requests SET req_status = $reply WHERE tran_id = $tran_id AND hiker_id = $pass_id;");
						if(!$query){
						
							$returned_arr = array('error' => 'unable to update traveller');
						}
				}
		}
		else{
		
			$query = mysql_query("UPDATE requests SET req_status = $reply WHERE tran_id = $tran_id AND hiker_id = $pass_id;");
			if(!$query){
						
				$returned_arr = array('error' => 'unable to update traveller');
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