<html>
<?php
    $con = mysql_connect("localhost", "root", "dani1994");
    mysql_select_db("joynride");
	
	###################################################
	#Usage: ?userName='guylitvak'&password='g123'
	###################################################
	
	$userName = $_GET['userName'];
	$password = $_GET['password'];
		
	$query = mysql_query("SELECT user_id, password FROM authentication WHERE user_name = $userName");
	$array = mysql_fetch_array($query);
	$length = mysql_num_rows($query);
	if ($length == 0) {
		$returned_arr = array('No such user name');
		echo json_encode($returned_arr);
	}
	else {
		$my_pass = "\"" .$array[1]."\"";
		if (strcmp($my_pass , $password) == 0) {
			$returned_arr = array('user_id' => $array[0]);
			echo json_encode($returned_arr);
		}
		else {
			$returned_arr = array('Wrong password');
			echo json_encode($returned_arr);
		}
	}
?>
</html>