<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$property_owner_id = $_GET["owner_id"];
$property_id = $_GET["property_id"];


$mysql_qry = "UPDATE `property_owned` SET owner_id='$property_owner_id' WHERE property_id = '$property_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated owner_id for this property."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>