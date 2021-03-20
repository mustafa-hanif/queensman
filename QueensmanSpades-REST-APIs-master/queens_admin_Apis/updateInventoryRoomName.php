<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$inventory_room_name = $_GET["name"];
$inventory_room_id = $_GET["inventory_room_id"];


$mysql_qry = "UPDATE `inventory_room` SET `room`='$inventory_room_name' WHERE id = '$inventory_room_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated room name for this inventory_room."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>