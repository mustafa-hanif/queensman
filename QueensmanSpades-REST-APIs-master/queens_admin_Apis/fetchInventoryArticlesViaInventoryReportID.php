<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$report_ID = $_GET["report_id"]; 
    $mysql_qry = "SELECT inventory_room.id as room_id, inventory_room.room, inventory_article.id as article_id, inventory_article.type, inventory_article.description, 
    inventory_article.inspection, inventory_article.work_description, inventory_article.remarks
    FROM inventory_room 
    LEFT JOIN inventory_article
    ON inventory_room.id = inventory_article.inventory_room_id
    WHERE inventory_room.inventory_report_id = '$report_ID';";

    $result = $conn->query($mysql_qry);
    $response = array();

    if ($result->num_rows > 0){
        while ($row = $result->fetch_assoc()){
            array_push($response,array("rooms_and_articles"=>$row));
        }
        
        echo json_encode(array("server_response"=>$response));
    } else{
        echo json_encode(array("server_response"=>$conn->error));			// return -1 means no user Found
    }
    
    ?>
    