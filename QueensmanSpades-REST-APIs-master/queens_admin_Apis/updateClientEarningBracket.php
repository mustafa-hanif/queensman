<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$client_earning_bracket = $_GET["earning_bracket"];
$client_id = $_GET["client_id"];


$mysql_qry = "UPDATE `client` SET earning_bracket='$client_earning_bracket' WHERE id = '$client_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated earning_bracket for this client."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>