<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$inventory_report_id = $_GET["inventory_report_id"];
$room = $_GET["room"];

$conn->autocommit(FALSE);

$mysql_qry = "INSERT INTO inventory_room(inventory_report_id, room) 
            VALUES('$inventory_report_id', '$room');";
$result = $conn->query($mysql_qry);

$new_room_id = $conn->insert_id;

if ($result == TRUE) {
    $mysql_qry2 = "CALL RoomCreation('$new_room_id');";
    $result2 = $conn->query($mysql_qry2);
    if ($result2 == TRUE){
        $conn->commit();
        echo json_encode(array("server_response"=>$new_room_id));
    } else {
        $conn->rollback();
        echo json_encode(array("server_response"=>$conn->error));
    }
} else {
    $conn->rollback();
    echo json_encode(array("server_response"=>$conn->error));
}

$conn->autocommit(TRUE);
$conn->close();

?>
