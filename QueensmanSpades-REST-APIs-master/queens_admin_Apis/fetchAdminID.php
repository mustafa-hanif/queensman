<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_email = $_GET["email"]; 
$mysql_qry = "SELECT id FROM `admin` WHERE email = '$user_email';";
$result = $conn->query($mysql_qry);

if ($row = $result->fetch_assoc() ){
	echo json_encode(array("server_response_ID"=>$row['id']));
} else{
	echo json_encode(array("server_response_ID"=>$conn->error));			// return -1 means no ID Found
}


?>