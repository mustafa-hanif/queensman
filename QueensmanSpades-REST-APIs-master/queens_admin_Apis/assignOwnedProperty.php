<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$property_id = $_GET["property_id"];
$owner_id = $_GET["client_id"]; 
$uploaded_by = $_GET["uploaded_by"];

$mysql_qry = "INSERT INTO property_owned(property_id, owner_id, uploaded_by) 
              VALUES('$property_id', '$owner_id', '$uploaded_by');";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_response"=>"Successfully Assigned Owned Property To Client."));
} else {
    echo json_encode(array("server_response"=>$conn->error));
}

?>
