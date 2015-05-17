

<?php

include('db_conf.php');
##############################################################################
#USAGE example: ?srcx=12.23&srcy=12.56&dstx=32.0852999&dsty=34.7817676&date=%272015-05-07%27&time=%2715:30:00%27&&max_price=20
#notes:
#	1. take care of transaction_id [AI] !
#	2. find way to replace path example in query with real path
##############################################################################

#input : details about the travel the hitchiker is looking for:
$source_x = $_GET['srcx'];
$source_y = $_GET['srcy'];
$dest_x = $_GET['dstx'];
$dest_y = $_GET['dsty'];
$departure_date = $_GET['date'];
$departure_time = $_GET['time'];
$max_price = $_GET['max_price'];

#check that the time = time -\+ 1, max_price >= price, date=date

$query = mysql_query("
SELECT * 
FROM transaction_info
WHERE departure_date = $departure_date
AND price_per_person <= $max_price
AND (SELECT ADDTIME(departure_time, '-01:00:00')) <= $departure_time
AND (SELECT ADDTIME(departure_time, '01:00:00')) >= $departure_time
AND num_of_vacant_sits > 0
");

$final_set = array();
$json_trans="[ ";
$length = mysql_num_rows($query);
for ($i = 0; $i < $length ; $i++) {
	$array = mysql_fetch_array($query);
	$path = $array['the_path'];
	if(location_in_path($dest_x, $dest_y, $path)){ #if destination is on the path
		if(is_in_radius($source_x, $source_y, $array['source_x'], $array['source_y'], $array['km_from_src'])){
			array_push($final_set, $array['transaction_id']);

		}
		#$tran = array('transaction_id' => $array['transaction_id'], 'source_addr' => $array['source_addr'], 'dest_addr' => $array['dest_addr'], 'departure_time' => $array['departure_time'], 'departure_date' => $array['departure_date'], 'price_per_person' => $array['price_per_person'], 'the_path' => $array['the_path']);
		#$json_tran = json_encode($tran);
		#$json_trans = $json_trans.$json_tran;
	}
}
#$json_trans=$json_trans." ]";
#echo $json_trans;
$json = json_encode($final_set);
echo "final :   ".$json;

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
	$url = sprintf("https://maps.googleapis.com/maps/api/distancematrix/json?origins=(%f,%f)&destinations=(%f,%f)&mode=driving&language=EN",$srcx, $srcy, $mysrcx, $mysrcy);
	echo "url is : ".$url;
	$ch = curl_init();

	curl_setopt($ch, CURLOPT_URL,$url); 
	#curl_setopt($ch, CURLOPT_HTTPPROXYTUNNEL, true);
	$res= curl_exec($ch);
	$json = json_encode($res);
	echo $json;
	echo $res;

}
?>