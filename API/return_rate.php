<html>
<?php
    $con = mysql_connect("localhost", "root", "dani1994");
    mysql_select_db("joynride");
	
	##########################################################################################
	#Usage: ?driver_id=1
	##########################################################################################

	$driver_id = $_GET['driver_id'];
	$query = mysql_query("SELECT punctuality, safety, atmosphere, general_rank FROM rates WHERE driver_id = $driver_id");
	$total = mysql_num_rows($query);
	
	$punc = 0;
	$safety = 0;
	$atmo = 0;
	$general = 0;
	for ($i = 0; $i < $total; $i++) {
		$array = mysql_fetch_array($query);
		$punc += $array['punctuality'];
		$safety += $array['safety'];
		$atmo += $array['atmosphere'];
		$general += $array['general_rank'];
	}

	$punc = round($punc / $total, 2);
	$safety = round($safety / $total, 2);
	$atmo = round($atmo / $total, 2);
	$general = round($general / $total, 2);

	$returned_arr = array('punctuality' => $punc, 'safety' => $safety, 'atmosphere' => $atmo, 'general_rank' => $general);
	echo json_encode($returned_arr);
	
?>
</html>