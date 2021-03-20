<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$callout_id = $_GET["callout_id"];
$status = "Requested";

$mysql_qry0 = "DELETE FROM job_worker WHERE callout_id = '$callout_id';";
$result0 = $conn->query($mysql_qry0);

if ($result0 === TRUE && $conn->affected_rows > 0){
    $mysql_qry2 = "UPDATE `callout` SET status='$status'  WHERE id = '$callout_id';";
    $result2 = $conn->query($mysql_qry2);

    if ($result2 === TRUE && $conn->affected_rows > 0){
        echo json_encode(array("server_response"=>"Successfully updated job_worker table."));
    }
    else {
        echo json_encode(array("server_response"=>$conn->error));
    }

} else {
    echo json_encode(array("server_response"=>$conn->error));
}

?>