<?php
require "./DBConnect/conn.php";
// $user_ID = $_GET["ID"]; 
$mysql_qry = "SELECT * FROM client;";
$result = mysqli_query($conn, $mysql_qry);

$response = array();

while ($row = mysqli_fetch_array($result)){
	
	array_push($response,array("id"=>$row[0]));
}

echo json_encode(array("server_response"=>$response));

?>