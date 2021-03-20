<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_email = $_GET["email"]; 
$user_pass = $_GET["password"];
$mysql_qry = "SELECT id FROM worker WHERE email = '$user_email' AND `password` = '$user_pass';";
$result = $conn->query($mysql_qry);

if ($row = $result->fetch_assoc() ){
	echo json_encode(array("server_response"=>$row['id']));
} else{
	echo json_encode(array("server_response"=>-1));			// return -1 means no user Found
}


?>