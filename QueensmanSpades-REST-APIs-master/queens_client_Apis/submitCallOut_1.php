<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_ID = $_GET["ID"];
$user_prop_ID = $_GET["prop_id"]; 
$user_job_type = $_GET["job"];
$user_describe = $_GET["describe"];
// $user_picture1 = $_GET["picture1"]; 
// $user_picture2 = $_GET["picture2"];
// $user_picture3 = $_GET["picture3"];
// $user_picture4 = $_GET["picture4"];
$user_urg_lvl = $_GET["urg_lvl"]; 
$property_type = $_GET["property_type"];

$category = "Uncategorized";
if (strpos($property_type,"AMC") !== false || strpos($property_type,"Annual Maintenance Contract" !== false)){
    $category = "AMC";
} else if (strpos($property_type,"MTR") !== false || strpos($property_type,"Metered") !== false){
    $category = "Metered Service";
}

$mysql_qry = "INSERT INTO callout(callout_by, property_id, job_type, 
                          description, request_time, urgency_level, category) 
              VALUES('$user_ID', '$user_prop_ID', '$user_job_type', '$user_describe', CURRENT_TIMESTAMP, '$user_urg_lvl', '$category');";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_responce"=>"Successfully Submitted Callout Details"));
} else {
    echo json_encode(array("server_responce"=>-1));
}

?>
