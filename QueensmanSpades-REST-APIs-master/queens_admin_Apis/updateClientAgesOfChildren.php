<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$client_ages_of_children = $_GET["ages_of_children"];
$client_id = $_GET["client_id"];


$mysql_qry = "UPDATE `client` SET ages_of_children='$client_ages_of_children' WHERE id = '$client_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated ages_of_children for this client."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>