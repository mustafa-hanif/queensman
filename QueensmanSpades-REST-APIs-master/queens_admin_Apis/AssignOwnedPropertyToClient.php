<?php
header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Headers: *');

header('Content-Type: application/json');





    // Defining DB

    require "./DBConnect/conn.php";



    // Uploading id

    $property_id = $_GET["property_id"];

    $client_id = $_GET["client_id"];

    $uploaded_by=$_GET["uploaded_by"];
    



    // Deleting client

    $mysql_qry = "INSERT INTO property_owned(property_id, owner_id,uploaded_by) VALUES('$property_id','$client_id','$uploaded_by')";

    $result = $conn->query($mysql_qry);



    if ($result === TRUE) {

        echo json_encode(array("server_response"=>"Successfully assigned owned property to client"));

    } else {

        echo json_encode(array("server_response"=>$conn->error));

    }



?>


