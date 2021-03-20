<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$worker_phone = $_GET["phone"];
$worker_id = $_GET["worker_id"];


$mysql_qry = "UPDATE `worker` SET phone='$worker_phone' WHERE id = '$worker_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated phone for this worker."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>