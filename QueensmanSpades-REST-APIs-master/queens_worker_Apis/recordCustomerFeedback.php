<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$callout_ID = $_GET["callout_id"];             // Callout ID
$rating = $_GET["rating"];
$feedback = $_GET["feedback"];
$signature = $_GET["signature"];

 $signature_abs = "http://www.queensman.com/queens_worker_Apis/signatures/".$signature;

    $mysql_qry = "UPDATE job SET rating = '$rating', feedback = '$feedback', `signature` = '$signature_abs' WHERE callout_id = '$callout_ID';";
    $result = $conn->query($mysql_qry);

    if ($result == TRUE) {
        echo json_encode(array("server_response"=>"Successfully submitted customer satisfaction status."));
    } else {
        echo json_encode(array("server_response"=>"Couldn't submit customer satisfaction status."));
    }
    

?>
