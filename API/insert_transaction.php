<?php

    include('db_conf.php');
	
	##########################################################################################
	#Usage: 
	#?user_id=2&src=Ashdod&srcx=31.804381&srcy=34.655314&dst=Tel-Aviv&dstx=32.0852999&dsty=34.7817676&time=15:25:00&date=2010-05-07&price=15&free_sits=4&radius=20&path=[{"x":31.804381,"y":34.655314},{"x":2,"y":8},{"x":67,"y":9}]
	##########################################################################################

	
	$driver_id = $_GET['user_id'];
	
	$returned_arr = array('status' => 'ok');
	
	$query = mysql_query("SELECT MAX(transaction_id) FROM transaction_info");
	if (!$query){
	
			$returned_arr = array('error' => 'Server is down');
	}
	else {
	
			$array = mysql_fetch_array($query);
			$transaction_id = $array[0] + 1; 

			$source_addr = $_GET['src'];
			$source_x = $_GET['srcx'];
			$source_y = $_GET['srcy'];
			$dest_addr = $_GET['dst'];
			$dest_x = $_GET['dstx'];
			$dest_y = $_GET['dsty'];
			$departure_time ="TIME " . "'" . $_GET['time'] . "'";
			$departure_date = "DATE " . "'" . $_GET['date'] . "'";
			$price_per_person = $_GET['price'];
			$num_of_vacant_sits = $_GET['free_sits'];
			$num_of_occupied_sits = 0;
			$km_from_src = $_GET['radius'];
			$the_path = $_GET['path'];

			$query = mysql_query("INSERT INTO transaction_info VALUES($transaction_id, $driver_id, '$source_addr', $source_x, $source_y, '$dest_addr', $dest_x, $dest_y, $departure_time, $departure_date, $price_per_person, $num_of_vacant_sits, $num_of_occupied_sits, $km_from_src, '$the_path');");
			
			if(!$query){
			
				$returned_arr = array('error' => 'Server is down');
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