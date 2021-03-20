<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_id = $_GET["admin_id"]; 
$mysql_qry = "SELECT id, full_name, email, phone, designation FROM `admin` WHERE id = '$user_id';";
$result = $conn->query($mysql_qry);

if ($row = $result->fetch_assoc() ){
	echo json_encode(array("server_response"=>$row));
} else{
	echo json_encode(array("server_response"=>$conn->error));			// return -1 means no ID Found
}


?>