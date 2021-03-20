<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$property_active = $_GET["active"];
$client_id = $_GET["client_id"];
$property_id = $_GET["property_id"];


$mysql_qry = "UPDATE `lease` SET active='$property_active' WHERE property_id = '$property_id' AND lessee_id = '$client_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated active for this leased property."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>