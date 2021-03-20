<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$callout_ID = $_GET["callout_id"];             // Callout ID
$worker_ID = $_GET["worker_id"];               // Worker ID

$status = "In Progress";

$mysql_qry0 = "UPDATE callout SET status = '$status' WHERE id = '$callout_ID';;";
$result0 = $conn->query($mysql_qry0);


if ($result0 == TRUE){

    $mysql_qry = "INSERT INTO job_history(callout_id, status_update, updated_by, updater_id, `time`)
                VALUES('$callout_ID','$status', 'Ops Team', '$worker_ID', CURRENT_TIMESTAMP);";
    $result = $conn->query($mysql_qry);

    if ($result == TRUE) {
        echo json_encode(array("server_response"=>"Successfully started the callout."));
    } else {
        echo json_encode(array("server_response"=>"Couldn't insert job history"));
    }
    
} else{
	echo json_encode(array("server_response"=>"The callout status update failed."));
}

?>
