<?php

	 include('db_conf.php');

	##########################################################################################
	#Usage: 
	#?tran_id=100&pass_id=1&src=Ashdod&src_pass_x=31.804381&src_pass_y=34.655314&dst=Tel-Aviv&dst_pass_x=32.0852999&dst_pass_y=34.7817676
	
	#sets 'has_rated' to 0 
	##########################################################################################

/* 	$tran_id = $_GET['tran_id'];
	$pass_id = $_GET['pass_id'];
	$src = $_GET['src'];
	$src_pass_x = $_GET['src_pass_x'];
	$src_pass_y = $_GET['src_pass_y'];
	$dst = $_GET['dst'];
	$dst_pass_x = $_GET['dst_pass_x'];
	$dst_pass_y = $_GET['dst_pass_y']; */
	
		function insert_passenger($tran_id, $pass_id, $src, $src_pass_x, $src_pass_y, $dst, $dst_pass_x, $dst_pass_y){
		
			$query = mysql_query("INSERT INTO passengers VALUES ($tran_id, $pass_id, '$src', $src_pass_x, $src_pass_y, '$dst', $dst_pass_x, $dst_pass_y, 0);");
 
			if(!$query){
				return false;
			}
			else{
				return true;
			}
		}
?>