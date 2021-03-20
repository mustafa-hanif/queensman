<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$callout_id = $_GET["callout_id"];
$worker_id = $_GET["worker_id"];
$date = $_GET["date"];
$notes = $_GET["notes"];

$mysql_qry = "INSERT INTO scheduler(callout_id, worker_id, date_on_calendar, notes) 
              VALUES('$callout_id', '$worker_id', '$date', '$notes');";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_response"=>"Successfully submitted schedule details."));
} else {
    echo json_encode(array("server_response"=>$conn->error));
}

?>
