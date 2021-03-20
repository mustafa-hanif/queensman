<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$property_lessee_id = $_GET["lessee_id"];
$property_id = $_GET["property_id"];


$mysql_qry = "UPDATE `lease` SET lessee_id='$property_lessee_id' WHERE property_id = '$property_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated lessee_id for this property."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>