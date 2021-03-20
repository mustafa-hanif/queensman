<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$property_country = $_GET["country"];
$property_id = $_GET["property_id"];


$mysql_qry = "UPDATE `property` SET country='$property_country' WHERE id = '$property_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated country for this property."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>