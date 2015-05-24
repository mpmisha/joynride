<?php

include('db_conf.php');
include('lib_functions.php');

##############################################################################

#USAGE example: ?id=4&tran_id=2

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
	$query = mysql_query("SELECT driver_id FROM `transaction_info`  WHERE (transaction_id='$tran_id')");
	$row = mysql_fetch_array($query);
	return (int)$row[0];
}

#inform the driver - retrieve the info about the traveller 
$reply = json_encode(array_merge(array('driver_id' => get_driver_id($tran_id)), get_traveller_info($id)));

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
?>