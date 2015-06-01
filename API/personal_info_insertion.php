<?php

	include('db_conf.php');
	
	#######################################################################################################################################
	#Usage: ?user_id=4&first_name=guy&last_name=litvak&phone_number=0545119911&alt_email_add=guylitvak@walla.co.il&picture=bullshit
	#######################################################################################################################################

	$user_id = $_GET['user_id'];
	$first_name = $_GET['first_name'];
	$last_name = $_GET['last_name'];
	$phone_number = $_GET['phone_number'];
	$query = mysql_query("SELECT user_name FROM authentication WHERE user_id = $user_id");
	$array = mysql_fetch_array($query);
	$user_name = $array[0];
	$uni_email_address = $user_name . '@mail.tau.ac.il';
	$alternative_email_address = $_GET['alt_email_add'];
	$picture_path = $_GET['picture'];
	
	$returned_arr = array('status' => 'ok');
	
	$find_user = mysql_query("SELECT * FROM personal_info WHERE user_id = $user_id;");
	
	if ($find_user){
		
		if (mysql_num_rows($find_user) > 0){// user_id already exists in DB
		
			$insertion = mysql_query("UPDATE personal_info SET  first_name = '$first_name', 
																last_name = '$last_name', 
																uni_email_address = '$uni_email_address', 
																alternative_email_address = '$alternative_email_address', 
																phone_number = '$phone_number', 
																picture_path = '$picture_path' 
									WHERE user_id = $user_id");
		}
		else{
		
			$insertion = mysql_query("INSERT INTO personal_info VALUES($user_id, '$first_name', '$last_name', '$uni_email_address', '$alternative_email_address', '$phone_number', '$picture_path')");
		}
	}
	else{// query failure
	
		$insertion = false;
	}

	if (!$insertion) {
	
		$returned_arr = array('error' => 'Server is down');	
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