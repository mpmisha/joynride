<?php

	include('db_conf.php');

	#input: transaction_id
	#output: transaction information
	#Usage: ?tran_id=47 

	$tran_id = $_GET['tran_id'];
	
	$arr = array('error' => 'server is down');

	$query1 = mysql_query("
	SELECT driver_id, source_addr, dest_addr, departure_time, departure_date, price_per_person, the_path
	FROM transaction_info
	WHERE transaction_id = $tran_id
	");
	$query2 = mysql_query("SELECT pass_id, src, dst FROM passengers WHERE tran_id = $tran_id
	");

	if ($query1 and $query2 and mysql_num_rows($query1) > 0){
	
		$tran_info = mysql_fetch_array($query1);
		$num_of_pass = mysql_num_rows($query2);

		$arr = array('driver_id' => $tran_info['driver_id'], 'source' => $tran_info['source_addr'], 'dest' => $tran_info['dest_addr'], 'time' => $tran_info['departure_time'], 'date' => $tran_info['departure_date'], 'price' => $tran_info['price_per_person'], 'path' => $tran_info['the_path']);
		
		$pass_arr = array();
		
		for ($i=0; $i < $num_of_pass; $i++){
			
				$pass = array();
				
				$pass_info = mysql_fetch_array($query2);
				$pass['pass_id'] = $pass_info['pass_id'];
				$pass['src'] = $pass_info['src'];
				$pass['dst'] = $pass_info['dst'];
				
				$pass_arr["$i"] = $pass;
		}
		
		$arr['passengers'] = $pass_arr;
	}

	
	$reply = json_encode($arr);
				
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