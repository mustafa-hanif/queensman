<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$callout_id = $_GET["ID"]; // Event ID
$notes = $_GET["note"];

$mysql_qry = "INSERT INTO job_notes(callout_id, note) VALUES('$callout_id','$notes');";

$result = $conn->query($mysql_qry);

if ($result == TRUE) {
    echo json_encode(array("server_response"=>"Successfully updated notes for this service."));
} else {
    echo json_encode(array("server_response"=>'-1'));
}

?>