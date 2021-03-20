<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$report_ID = $_GET["report_id"]; 
    $mysql_qry = "SELECT inventory_picture.id as picture_id, inventory_picture.picture_location, inventory_room.id as room_id, inventory_room.room
    FROM inventory_picture
    INNER JOIN inventory_room
    ON inventory_picture.inventory_room_id = inventory_room.id
    WHERE inventory_room.inventory_report_id = '$report_ID';";

    $result = $conn->query($mysql_qry);
    $response = array();

    if ($result->num_rows > 0){
        while ($row = $result->fetch_assoc()){
            array_push($response,array("pictures"=>$row));
        }
        
        echo json_encode(array("server_response"=>$response));
    } else{
        echo json_encode(array("server_response"=>$conn->error));			// return -1 means no user Found
    }
    
    ?>
    