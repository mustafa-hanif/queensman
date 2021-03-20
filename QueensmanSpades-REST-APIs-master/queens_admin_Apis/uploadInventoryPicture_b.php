<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$inventory_room_id = $_GET["inventory_room_id"];
$picture_location = $_GET["picture_location"];

$picture_location = "http://13.250.20.151/queens_client_Apis/photos/".$picture_location;

$mysql_qry = "INSERT INTO inventory_picture(inventory_room_id, picture_location) 
            VALUES('$inventory_room_id', '$picture_location');";
$result = $conn->query($mysql_qry);

if ($result == TRUE) {
    echo json_encode(array("server_response"=>"The inventory picture location has been uploaded to database."));
} else {
    echo json_encode(array("server_response"=>"The inventory picture location hasn't been uploaded to database correctly."));
}

?>
