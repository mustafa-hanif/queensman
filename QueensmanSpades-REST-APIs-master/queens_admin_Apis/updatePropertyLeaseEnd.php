<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$property_lease_end = $_GET["lease_end"];
$property_id = $_GET["property_id"];


$mysql_qry = "UPDATE `lease` SET lease_end='$property_lease_end' WHERE property_id = '$property_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated lease_end for this property."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>