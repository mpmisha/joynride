<?php

	 include('db_conf.php');

	##########################################################################################
	#Usage: 
	#?tran_id=100&pass_id=1&src=Ashdod&src_pass_x=31.804381&src_pass_y=34.655314&dst=Tel-Aviv&dst_pass_x=32.0852999&dst_pass_y=34.7817676&status=0
	
	#status can be: 0 (driver hasn't been informed), 
	#				1 (driver has been informed and approved, and the traveller has not been informed), 
	#				2 (driver has been informed and rejected, and the traveller has not been informed),
	#				3 (driver bas been informed and rejected, and the traveller has been informed - don't erase the row in this case)
	#				4 (driver has been informed)
	##########################################################################################

	#$tran_id = $_GET['tran_id'];
	#$pass_id = $_GET['pass_id'];
	#$src = $_GET['src'];
	#$src_pass_x = $_GET['src_pass_x'];
	#$src_pass_y = $_GET['src_pass_y'];
	#$dst = $_GET['dst'];
	#$dst_pass_x = $_GET['dst_pass_x'];
	#$dst_pass_y = $_GET['dst_pass_y'];
	#$status = $_GET['status'];
	
	function insert_request($tran_id, $pass_id, $src, $src_pass_x, $src_pass_y, $dst, $dst_pass_x, $dst_pass_y, $status){
		
		$query = mysql_query("INSERT INTO requests VALUES ($tran_id, $pass_id, '$src', $src_pass_x, $src_pass_y, '$dst', $dst_pass_x, $dst_pass_y, $status);");
	 
		if(!$query){
			return false;
		}
		else{
			return true;
		}
	}
?>