<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');


    // Defining DB
    require "./DBConnect/conn.php";

    // Uploading id
    $client_id = $_GET["client_id"];
    

    // Deleting client
    $mysql_qry = "UPDATE client SET active = '0' WHERE id = '$client_id';";
//	echo $mysql_qry;    
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"The client has been deleted."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }

?>
