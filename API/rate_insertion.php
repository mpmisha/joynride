<html>
<?php
    $con = mysql_connect("localhost", "root", "dani1994");
    mysql_select_db("joynride");
	
	##########################################################################################
	#Usage: ?pass_id=1&driver_id=1&punc_rate=2&safety_rate=3&atmo_rate=3&gen_rate=5
	##########################################################################################

	
	$pass_id = $_GET['pass_id'];
	$driver_id = $_GET['driver_id'];
	$punc = $_GET['punc_rate'];
	$safety = $_GET['safety_rate'];
	$atmo = $_GET['atmo_rate'];
	$gen = $_GET['gen_rate'];

	#Checking if the current passenger has rated the current driver before
	$query = mysql_query("SELECT total_number_of_ranking, punctuality, safety, atmosphere, general_rank FROM rates WHERE driver_id = $driver_id AND passenger_id = $pass_id");
	#This passenger hasn't rated this driver before
	if (mysql_num_rows($query) == 0) {
		$total = 1;
		$insertion = mysql_query("INSERT INTO rates VALUES($pass_id, $driver_id, $punc, $safety, $atmo, $gen, $total)");
	}
	#This passenger has rated this driver before "#query[0]" times
	else {
		$array = mysql_fetch_array($query);
		$punc = $punc*(1/($array['total_number_of_ranking']+1)) + $array['punctuality']*($array['total_number_of_ranking']/($array['total_number_of_ranking']+1));
		$safety = $safety*(1/($array['total_number_of_ranking']+1)) + $array['safety']*($array['total_number_of_ranking']/($array['total_number_of_ranking']+1));
		$atmo = $atmo*(1/($array['total_number_of_ranking']+1)) + $array['atmosphere']*($array['total_number_of_ranking']/($array['total_number_of_ranking']+1));
		$gen = $gen*(1/($array['total_number_of_ranking']+1)) + $array['general_rank']*($array['total_number_of_ranking']/($array['total_number_of_ranking']+1));
		$total = $array['total_number_of_ranking'] + 1;
		$insertion = mysql_query("UPDATE rates SET punctuality = $punc, safety = $safety, atmosphere = $atmo, general_rank = $gen, total_number_of_ranking = $total WHERE driver_id = $driver_id AND passenger_id = $pass_id");
	}

	if ($insertion) {
?>
	<h2>insertion succeed</h2>
<?php
	}
	else {
?>
	<h2>insertion failed</h2>
<?php
	}

?>
</html>