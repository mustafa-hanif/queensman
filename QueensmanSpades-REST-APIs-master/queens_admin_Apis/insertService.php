<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$callout_by = $_GET["client_id"];
$property_id = $_GET["property_id"];
$job_type = $_GET["job_type"];
$description = $_GET["description"];
$status = $_GET["status"];
$urgency_level = $_GET["urgency_level"];
$category = $_GET["category"];
$user_picture1 = $_GET["picture1"]; 
$user_picture2 = $_GET["picture2"];
$user_picture3 = $_GET["picture3"];
$user_picture4 = $_GET["picture4"];

$user_picture1 = "http://13.250.20.151/queens_client_Apis/photos/".$user_picture1;
$user_picture2 = "http://13.250.20.151/queens_client_Apis/photos/".$user_picture2;
$user_picture3 = "http://13.250.20.151/queens_client_Apis/photos/".$user_picture3;
$user_picture4 = "http://13.250.20.151/queens_client_Apis/photos/".$user_picture4;


$mysql_qry = "INSERT INTO callout(callout_by, property_id, job_type, description, status, urgency_level, category, picture1, picture2, picture3, picture4) 
              VALUES('$callout_by', '$property_id', '$job_type', '$description', '$status', '$urgency_level', '$category', '$user_picture1', '$user_picture2', '$user_picture3', '$user_picture4');";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_response"=>"Successfully Submitted Callout Details"));
} else {
    echo json_encode(array("server_response"=>$conn->error));
}

?>
