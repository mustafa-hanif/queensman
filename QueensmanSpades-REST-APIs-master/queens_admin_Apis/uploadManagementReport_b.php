<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_ID = $_GET["client_id"];
$user_prop_ID = $_GET["property_id"]; 
$report_date = $_GET["report_date"];
$report_location = $_GET["report_location"];

$report_location = "http://13.250.20.151/queens_client_Apis/".$report_location;

$mysql_qry = "INSERT INTO management_report(property_id, owner_id, report_upload_date, report_location) VALUES ('$user_prop_ID', '$user_ID', '$report_date', '$report_location');";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_responce"=>"Successfully Submitted Report Location in Database."));
} else {
    echo json_encode(array("server_responce"=>$conn->error));
}

?>
