<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');


    // Defining DB
    require "./DBConnect/conn.php";

    // Uploading id
    $callout_id = $_GET["callout_id"];
    

    // Deleting callout
    $mysql_qry = "UPDATE callout SET active = '0' WHERE id = '$callout_id';";
    $result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"The callout has been deleted."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }

?>
