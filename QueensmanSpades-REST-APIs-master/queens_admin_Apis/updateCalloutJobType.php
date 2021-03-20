<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$callout_job_type = $_GET["job_type"];
$callout_id = $_GET["callout_id"];


$mysql_qry = "UPDATE `callout` SET job_type='$callout_job_type' WHERE id = '$callout_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated job_type for this callout."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>