<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$property_active = $_GET["active"];
$property_id = $_GET["property_id"];


$mysql_qry = "UPDATE `property` SET active='$property_active' WHERE id = '$property_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated active for this property."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>