<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$address = $_GET["address"];

$mysql_qry = "SELECT MAX(id)as id FROM `property` WHERE address = '$address';";

$result = $conn->query($mysql_qry);

if ($row = $result->fetch_assoc() ){
	echo json_encode(array("server_response_ID"=>$row['id']));
} else{
	echo json_encode(array("server_response_ID"=>$conn->error));			// return -1 means no ID Found
}


?>
