<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_ID = $_GET["ID"]; 
$mysql_qry = "SELECT full_name, email, phone,gender,password FROM client WHERE id = '$user_ID'";
$result = $conn->query($mysql_qry);

if ($row = $result->fetch_assoc() ){
	echo json_encode(array("server_responce"=>$row));
} else{
	echo json_encode(array("server_responce"=>-1));			// return -1 means no user Found
}


?>