<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');


    // Defining DB
    require "./DBConnect/conn.php";

    // Uploading id
    $worker_id = $_GET["worker_id"];
    

    // Deleting worker
    $mysql_qry = "UPDATE worker SET active = '0' WHERE id = '$worker_id';";
    $result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"The worker has been deleted."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }

?>
