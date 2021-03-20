<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$worker_email = $_GET["email"];
$worker_id = $_GET["worker_id"];


$mysql_qry = "UPDATE `worker` SET email='$worker_email' WHERE id = '$worker_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated email for this worker."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>