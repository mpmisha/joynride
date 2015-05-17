<?php
    $con = mysql_connect("localhost", "root", "dani1994");
    mysql_select_db("joynride");
	
	##########################################################################################
	#Usage: ?user_id='2'&src="Ashdod"&srcx=31.804381&srcy=34.655314&dst="Tel-Aviv"&dstx=32.0852999&dsty=34.7817676&time=%2715:25:00%27&date=%272015-05-07%27&price=15&free_sits=4&radius=2&path="[{x:31.804381, y:34.655314}, {x:2,y:8}, {x:67,y:9}]"
	##########################################################################################

	
	$driver_id = $_GET['user_id'];
	$query = mysql_query("SELECT COUNT(*) FROM Transaction_info");
	$array = mysql_fetch_array($query);
	$transaction_id = $array[0] + 1; 
		
	$source_addr = $_GET['src'];
	$source_x = $_GET['srcx'];
	$source_y = $_GET['srcy'];
	$dest_addr = $_GET['dst'];
	$dest_x = $_GET['dstx'];
	$dest_y = $_GET['dsty'];
	$departure_time ="TIME ".$_GET['time'];
	$departure_date = "DATE ".$_GET['date'];
	$price_per_person = $_GET['price'];
	$num_of_vacant_sits = $_GET['free_sits'];
	$num_of_occupied_sits = 0;
	$km_from_src = $_GET['radius'];
	$the_path = $_GET['path'];

	$query = mysql_query("INSERT INTO transaction_info VALUES($transaction_id, $driver_id, $source_addr, $source_x, $source_y, $dest_addr, $dest_x, $dest_y, $departure_time, $departure_date, $price_per_person, $num_of_vacant_sits, $num_of_occupied_sits, $km_from_src, $the_path)");
	
	if(!$query){
		$returned_arr = array('Server is down');
		echo json_encode($returned_arr);
	}
?>