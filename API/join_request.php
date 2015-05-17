<?php

include('db_conf.php');

##############################################################################

#USAGE example: ?id='4'&tran_id='2'

#PLAN:

	#Michael posts this page, this page retrieves the driver_id and info about the traveller. 
	#Michael asks for an answer from the driver, and if the answer is positive, Michael posts another page which updates the database. 
	#Michael informs the user.

#NOTES:

	#replace get with post

	# There could be several people trying to join the same transaction and they might end up with no seats. But this is only a request
	# that needs to be approved by the driver. So, the 'available appropriate transactions notifier' page should check if there's space available before
	# informing the users about available transactions 

	#only one transaction at a time is allowed for a driver, as well as for a traveller

##############################################################################

$id = $_GET['id']; #the traveller's id (user id)
$tran_id = $_GET['tran_id']; #the transaction's id (user id)

#extract the driver's id
function get_driver_id($tran_id){
	$query = mysql_query("SELECT driver_id FROM `transaction_info`  WHERE (transaction_id=$tran_id)");
	$row = mysql_fetch_array($query);
	return $row[0];
}

#extract the user's id
function get_traveller_info($user_id){
	$query = mysql_query("SELECT * FROM `personal_info` WHERE (user_id=$user_id)");
	$row = mysql_fetch_array($query);
	return $row;
}

#inform the driver - retrieve the info about the traveller 

$traveller_info = get_traveller_info($id);
$name = $traveller_info['first_name'] . $traveller_info['last_name'];
$mail1 = $traveller_info['uni_email_address'];
$mail2 = $traveller_info['alternative_email_address'];
$phone_num = $traveller_info['phone_number'];
$pic_path = $traveller_info['picture_path'];

$arr = array('driver_id' => get_driver_id($tran_id), 'trav_name' => $name, 'trav_mail1' => $mail1, 'trav_mail2' => $mail2, 'trav_phone' => $phone_num, 'trav_pic' => $pic_path);
echo json_encode($arr);

?>