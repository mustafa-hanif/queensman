<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$callout_urgency_level = $_GET["urgency_level"];
$callout_id = $_GET["callout_id"];


$mysql_qry = "UPDATE `callout` SET urgency_level='$callout_urgency_level' WHERE id = '$callout_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated urgency_level for this callout."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>