<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$callout_ID = $_GET["callout_id"];             // Callout ID
$worker_ID = $_GET["worker_id"];               // Worker ID
$solution = $_GET["solution"];

$status = "Closed";

$mysql_qry0 = "UPDATE callout SET status = '$status' WHERE id = '$callout_ID';";
$result0 = $conn->query($mysql_qry0);


if ($result0 == TRUE){

    $mysql_qry = "INSERT INTO job_history(callout_id, status_update, updated_by, updater_id, `time`)
                VALUES('$callout_ID','$status', 'Ops Team', '$worker_ID', CURRENT_TIMESTAMP);";
    $result = $conn->query($mysql_qry);

    $mysql_qry2 = "UPDATE job SET solution = '$solution' WHERE callout_id = '$callout_ID';";
    $result2 = $conn->query($mysql_qry2);

    if ($result == TRUE && $result2 == TRUE) {


        echo json_encode(array("server_response"=>"Successfully finished the callout."));
    } else {
        echo json_encode(array("server_response"=>"Couldn't completely finish the job."));
    }
    
} else{
	echo json_encode(array("server_response"=>"The callout status update failed."));
}

?>
