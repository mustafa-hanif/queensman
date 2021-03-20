<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$worker_id = $_GET["worker_id"];
$callout_id = $_GET["callout_id"];


$mysql_qry0 = "INSERT INTO job_worker(callout_id, worker_id) VALUES('$callout_id', '$worker_id');";
$result0 = $conn->query($mysql_qry0);

if ($result0 === TRUE){
    echo json_encode(array("server_response"=>"Successfully updated job_worker table."));

} else {
    echo json_encode(array("server_response"=>$conn->error));
}


?>