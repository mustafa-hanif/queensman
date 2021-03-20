<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_ID = $_GET["client_id"];
$user_prop_ID = $_GET["prop_id"]; 
$user_job_type = $_GET["job"];
$user_describe = $_GET["describe"];
$user_picture1 = $_GET["picture1"]; 
$user_picture2 = $_GET["picture2"];
$user_picture3 = $_GET["picture3"];
$user_picture4 = $_GET["picture4"];
$user_urg_lvl = $_GET["urg_lvl"];
$planned_time = $_GET["planned_time"];
$category = $_GET["category"];
$status = "Planned";


$user_picture1 = "https://www.queensman.com/queens_client_Apis/photos/".$user_picture1;
$user_picture2 = "https://www.queensman.com/queens_client_Apis/photos/".$user_picture2;
$user_picture3 = "https://www.queensman.com/queens_client_Apis/photos/".$user_picture3;
$user_picture4 = "https://www.queensman.com/queens_client_Apis/photos/".$user_picture4;


$mysql_qry = "INSERT INTO callout(callout_by, property_id, job_type, 
                          description, request_time, picture1, picture2, picture3, picture4, urgency_level, `status`, planned_time, category) 
              VALUES('$user_ID', '$user_prop_ID', '$user_job_type', '$user_describe', CURRENT_TIMESTAMP, '$user_picture1', '$user_picture2', '$user_picture3', '$user_picture4' , '$user_urg_lvl', '$status', '$planned_time', '$category');";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_response"=>"Successfully Submitted Planned Callout Details"));
} else {
    echo json_encode(array("server_response"=>$conn->error));
}

?>
