<?php

    include('db_conf.php');

	##########################################################################################
	#Usage: 
	#?user_id=2
	##########################################################################################

    
    $user_id = $_GET['user_id'];

    #find travels of future dates with the user as passenger(hiker)
    echo "{";
    echo "travels_as_hiker:";
    $query = mysql_query("SELECT tran_id 
    	FROM passengers, transaction_info
    	WHERE pass_id = $user_id
    	AND tran_id = transaction_id
    	AND (departure_date > CURDATE() OR (departure_date = CURDATE() AND departure_time > CURTIME()))
    	;");



	$json = query_res_to_json($query, 'tran_id');
	echo $json.", ";

	#find travels of past dates with the user as passenger(history)
	echo "travels_as_hiker_history:";
	$query = mysql_query("SELECT tran_id 
    	FROM passengers, transaction_info
    	WHERE pass_id = $user_id
    	AND tran_id = transaction_id
    	AND (departure_date < CURDATE() OR (departure_date = CURDATE() AND departure_time < CURTIME()))
    	;");
	$json = query_res_to_json($query, 'tran_id');
	echo $json.", ";

	#find travels of future dates with the user as a driver
	echo "travels_as_driver:";
	$query = mysql_query("SELECT transaction_id 
    	FROM transaction_info
    	WHERE driver_id = $user_id
    	AND (departure_date > CURDATE() OR (departure_date = CURDATE() AND departure_time > CURTIME()))
    	;");

	$json = query_res_to_json($query, 'transaction_id');
	echo $json.", ";

	#find travels of past dates with the user as a driver
	echo "travels_as_driver_history:";
	$query = mysql_query("SELECT transaction_id 
    	FROM transaction_info
    	WHERE driver_id = $user_id
    	AND (departure_date < CURDATE() OR (departure_date = CURDATE() AND departure_time < CURTIME()))
    	;");
		$json = query_res_to_json($query, 'transaction_id');

	echo $json."}";


function query_res_to_json($query, $col_name){
	    if(!$query){echo "error!";}
    $my_travels = array();

    $length = mysql_num_rows($query);

	for ($i = 0; $i < $length ; $i++) {
		$line = mysql_fetch_array($query);
		array_push($my_travels, $line[$col_name]);
	}

	$json = json_encode($my_travels);
	return $json;
}
?>
