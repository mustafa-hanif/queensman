<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$property_id = $_GET["property_id"];
$lessee_id = $_GET["client_id"]; 
$lease_start = $_GET["lease_start_date"];
$lease_end = $_GET["lease_end_date"];
$uploaded_by = $_GET["uploaded_by"];

$mysql_qry = "INSERT INTO lease(property_id, lessee_id, lease_start, lease_end, uploaded_by) 
              VALUES('$property_id', '$lessee_id', '$lease_start',
              '$lease_end', '$uploaded_by');";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_response"=>"Successfully Assigned Leased Property To Client."));
} else {
    echo json_encode(array("server_response"=>$conn->error));
}

?>
