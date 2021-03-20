<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_ID = $_GET["ID"];
$user_prop_ID = $_GET["prop_id"]; 
$user_job_type = $_GET["job"];
$user_describe = $_GET["describe"];
$user_picture1 = ""; 
$user_picture2 = "";
$user_picture3 = "";
$user_picture4 = "";
$user_urg_lvl = $_GET["urg_lvl"]; 



$mysql_qry = "INSERT INTO callout(callout_by, property_id, job_type, 
                          description, request_time, picture1, picture2, picture3, picture4, urgency_level) 
              VALUES('$user_ID', '$user_prop_ID', '$user_job_type', '$user_describe', CURRENT_TIMESTAMP, '$user_picture1', '$user_picture2', '$user_picture3', '$user_picture4' , '$user_urg_lvl');";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_responce"=>"Successfully Submitted Callout Details"));
} else {
    echo json_encode(array("server_responce"=>-1));
}

?>
