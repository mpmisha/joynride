

<?php

include('db_conf.php');
##############################################################################
#USAGE:
#?srcx=31.773687&srcy=34.684409&dstx=2&dsty=8&date=2010-05-07&time=15:00:00&max_price=15

#notes:
#	1. take care of transaction_id [AI] !
#	2. transaction_id is not!!! in the right order. we need to order them by closest time and than by rate.
###############################################################################
$source_x = $_GET['srcx'];
$source_y = $_GET['srcy'];
$dest_x = $_GET['dstx'];
$dest_y = $_GET['dsty'];
$date = "DATE " . "'" . $_GET['date'] . "'";
$time ="TIME " . "'" . $_GET['time'] . "'";
$max_price = $_GET['max_price'];



$query = mysql_query("SELECT * 
	FROM transaction_info
	WHERE $date = departure_date
	AND $max_price >= price_per_person
	AND  ADDTIME(departure_time, '-01:00:00') <= $time AND ADDTIME(departure_time, '+01:00:00') >= $time
	;");

if(!$query){
	echo "error!";
}
$final_set = array();
$length = mysql_num_rows($query);

for ($i = 0; $i < $length ; $i++) {
	$array = mysql_fetch_array($query);
	$path = $array['the_path'];
	if(location_in_path($dest_x, $dest_y, $path)){ #if destination is on the path
		if(is_in_radius($source_x, $source_y, $array['source_x'], $array['source_y'], $array['km_from_src'])){
			array_push($final_set, $array['transaction_id']);

		}

	}
}

$reply = json_encode($final_set);
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

#'[{"x":31.804381, "y":34.655314}, {"x":2,"y":8}, {"x":67,"y":9}]'




#the function gets location (x,y) and path [{x:n,y:m},{},{}...] and returns true iff location on the path
function location_in_path($x, $y, $path){ 
	$path_json = json_decode($path, true);
	for($i=0; $i<count($path_json); $i++){
		if($path_json[$i]['x'] == $x && $path_json[$i]['y'] == $y){
			return 1;
			}
	}
	return 0;
}

function len($obj){
	$count = 0;
	foreach ($obj as $ob) {
 		$count++;
 	}
 	return $count;
}

#the function gets location: src(of real travel), location: mysrc (of search) and radius: r and return true iff the distance between src and mysrc <= radius
function is_in_radius($srcx, $srcy, $mysrcx, $mysrcy, $r){
	#compute distance between the src of the driver and the src of the hitcher:
	$url = sprintf("https://maps.googleapis.com/maps/api/distancematrix/json?origins=(%f,%f)&destinations=(%f,%f)&mode=driving&language=EN",$srcx, $srcy, $mysrcx, $mysrcy);
	$urloutput=file_get_contents($url); 
	$json = json_decode($urloutput);
	$dis_in_meters = $json->{"rows"}[0]->{'elements'}[0]->{'distance'}->{'value'};
	$dis_in_meters = intval(json_encode($dis_in_meters))/1000;

	#check whether the distance is smaller than the radius the driver permited
	if($dis_in_meters <= $r){
		return 1;
	}
	return 0;
}
?>