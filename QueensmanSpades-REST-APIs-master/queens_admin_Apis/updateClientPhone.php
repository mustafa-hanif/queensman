<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$client_phone = $_GET["phone"];
$client_id = $_GET["client_id"];


$mysql_qry = "UPDATE `client` SET phone='$client_phone' WHERE id = '$client_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated phone for this client."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>