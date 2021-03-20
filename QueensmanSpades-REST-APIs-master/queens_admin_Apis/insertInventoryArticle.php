<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$inventory_room_id = $_GET["inventory_room_id"];
$type = $_GET["type"];
$description = $_GET["description"];
$inspection = $_GET["inspection"];
$work_description = $_GET["work_description"];
$remarks = $_GET["remarks"];

$mysql_qry = "INSERT INTO inventory_article(inventory_room_id, `type`, `description`, inspection, work_description, remarks) 
            VALUES('$inventory_room_id', '$type', '$description', '$inspection', '$work_description', '$remarks');";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_response"=>"Successfully Submitted Inventory Article Details."));
} else {
    echo json_encode(array("server_response"=>$conn->error));
}

?>
