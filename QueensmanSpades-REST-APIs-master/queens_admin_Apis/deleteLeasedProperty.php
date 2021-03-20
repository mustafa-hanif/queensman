<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');


    // Defining DB
    require "./DBConnect/conn.php";

    // Uploading id
    $property_id = $_GET["property_id"];
    $client_id = $_GET["client_id"];

    // Deleting property
    $mysql_qry = "UPDATE lease SET active = '0' WHERE property_id = '$property_id' AND lessee_id = '$client_id';";
    $result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"The leased property has been deleted for the selected client."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }

?>
