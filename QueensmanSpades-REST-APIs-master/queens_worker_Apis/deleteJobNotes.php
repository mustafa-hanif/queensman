<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$callout_ID = $_GET["ID"]; // callout ID
$notes = $_GET["note"];

$mysql_qry = "DELETE FROM job_notes WHERE callout_id = '$callout_ID' AND note = '$notes';";

$result = $conn->query($mysql_qry);

if ($result == TRUE) {
    echo json_encode(array("server_response"=>"Successfully deleted notes for this callout."));
} else {
    echo json_encode(array("server_response"=>'-1'));
}

?>