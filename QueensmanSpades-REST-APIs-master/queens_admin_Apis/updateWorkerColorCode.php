<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$worker_color_code = $_GET["color_code"];
$worker_id = $_GET["worker_id"];


$mysql_qry = "UPDATE `worker` SET color_code='$worker_color_code' WHERE id = '$worker_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated color_code for this worker."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>