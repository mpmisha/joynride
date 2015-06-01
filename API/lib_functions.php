<?php

#extract the user's id
function get_traveller_info($user_id){
	$query = mysql_query("SELECT * FROM `personal_info` WHERE (user_id='$user_id')");
	
	if (!$query){
	
		return false;
	}
	
	$traveller_info = mysql_fetch_array($query);
	
	$f_name = $traveller_info['first_name'];
	$l_name = $traveller_info['last_name'];
	$mail1 = $traveller_info['uni_email_address'];
	$mail2 = $traveller_info['alternative_email_address'];
	$phone_num = $traveller_info['phone_number'];
	$pic_path = $traveller_info['picture_path'];
	$arr = array('f_name' => $f_name, 'l_name' => $l_name, 'uni_mail' => $mail1, 'alt_mail' => $mail2, 'phone' => $phone_num, 'pic' => $pic_path);
	return $arr;
}

?>