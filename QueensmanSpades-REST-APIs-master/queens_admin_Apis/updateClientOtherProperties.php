<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$client_other_properties = $_GET["other_properties"];
$client_id = $_GET["client_id"];


$mysql_qry = "UPDATE `client` SET other_properties='$client_other_properties' WHERE id = '$client_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated other_properties for this client."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>