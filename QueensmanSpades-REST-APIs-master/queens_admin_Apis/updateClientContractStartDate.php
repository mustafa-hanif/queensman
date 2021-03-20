<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$client_contract_start_date = $_GET["contract_start_date"];
$client_id = $_GET["client_id"];


$mysql_qry = "UPDATE `client` SET contract_start_date='$client_contract_start_date' WHERE id = '$client_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated contract_start_date for this client."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>