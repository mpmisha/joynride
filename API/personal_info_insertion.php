<?php
	$con = mysql_connect("localhost", "root", "dani1994");
	mysql_select_db("joynride");
	
	#######################################################################################################################################
	#Usage: ?user_id=4&first_name='guy'&last_name='litvak'&phone_number='0545119911'&alt_email_add='guylitvak@walla.co.il'&picture=''
	#######################################################################################################################################

	$user_id = $_GET['user_id'];
	$first_name = $_GET['first_name'];
	$last_name = $_GET['last_name'];
	$phone_number = $_GET['phone_number'];
	$query = mysql_query("SELECT user_name FROM authentication WHERE user_id = $user_id");
	$array = mysql_fetch_array($query);
	$user_name = $array[0];
	$uni_email_address = $user_name . '@mail.tau.ac.il';
	$alternative_email_address = $_GET['alt_email_add'];
	$picture_path = $_GET['picture'];
	
	$insertion = mysql_query("INSERT INTO personal_info VALUES($user_id, $first_name, $last_name, '$uni_email_address', $alternative_email_address, $phone_number, $picture_path)");

	if (!$insertion) {
		$returned_arr = array('Server is down');
		echo json_encode($returned_arr);
	}
?>