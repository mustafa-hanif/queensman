<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_email = $_GET["email"]; 
$mysql_qry = "SELECT active FROM client WHERE email = '$user_email';";
$result = $conn->query($mysql_qry);

if ($row = $result->fetch_assoc() ){
	echo json_encode(array("server_responce_ID"=>$row['active']));
} else{
	echo json_encode(array("server_responce_ID"=>$conn->error));			// return -1 means no ID Found
}


?>
