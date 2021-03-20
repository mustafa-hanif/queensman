<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');


    // Defining DB
    require "./DBConnect/conn.php";

    // Uploading id
    $schedule_id = $_GET["schedule_id"];
    

    // Deleting schedule
    $mysql_qry = "DELETE FROM `scheduler` WHERE id = '$schedule_id';";
//	echo $mysql_qry;    
$result = $conn->query($mysql_qry);

    if ($result === TRUE && $conn->affected_rows > 0) {
        echo json_encode(array("server_response"=>"The schedule with id ".$schedule_id." has been deleted."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }

?>
