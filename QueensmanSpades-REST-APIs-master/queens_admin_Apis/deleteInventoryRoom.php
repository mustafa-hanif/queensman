<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$inventory_room_id = $_GET["room_id"];

$mysql_qry = "DELETE FROM inventory_room WHERE id = '$inventory_room_id';";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_response"=>"Successfully Deleted Inventory Room."));
} else {
    echo json_encode(array("server_response"=>$conn->error));
}

?>
