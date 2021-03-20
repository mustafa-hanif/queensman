<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$admin_id = $_GET["admin_id"];
$push_token = $_GET["push_token"];


$mysql_qry = "UPDATE `admin` SET push_token = '$push_token' WHERE id = '$admin_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated push token for this admin."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>