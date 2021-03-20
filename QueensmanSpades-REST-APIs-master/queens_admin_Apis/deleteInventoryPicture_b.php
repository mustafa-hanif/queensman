<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');


    // Defining DB
    require "./DBConnect/conn.php";

    // Uploading file name
    $target_file = $_GET["target_file"];
    $inventory_picture_id = $_GET["inventory_picture_id"];
    
    $target_file_abs = "https://www.queensman.com/queens_client_Apis/photos/".$target_file;
    $target_file_abs2 = "http://www.queensman.com/queens_client_Apis/photos/".$target_file;

    // Deleting image link from database
    $mysql_qry2 = "DELETE FROM inventory_picture WHERE id = '$inventory_picture_id' and (picture_location = '$target_file_abs' OR picture_location = '$target_file_abs2');";
    $result2 = $conn->query($mysql_qry2);

    if ($result2 === TRUE) {
        echo json_encode(array("server_response"=>"The file location has been deleted from database."));
    } else {
        echo json_encode(array("server_response"=>"The file location hasn't been deleted from database correctly."));
    }

?>
