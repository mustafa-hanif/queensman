<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$mysql_qry = "SELECT max(id) FROM callout;";
$result = mysqli_query($conn, $mysql_qry);

$response = array();

while ($row = mysqli_fetch_array($result)){
	
	array_push($response,array("id"=>$row[0]));
}

echo json_encode(array("server_response"=>$response));

?>
