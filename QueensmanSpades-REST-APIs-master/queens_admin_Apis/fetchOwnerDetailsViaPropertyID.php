<?php

header('Access-Control-Allow-Origin: *');

header('Access-Control-Allow-Headers: *');

header('Content-Type: application/json');



require "./DBConnect/conn.php";



$property_id = $_GET['property_id'];

$mysql_qry = "SELECT client.id, client.full_name, client.email, client.phone, client.active FROM client

INNER JOIN property_owned ON client.id = property_owned.owner_id

INNER JOIN property ON property_owned.property_id = property.id

WHERE property.id = '$property_id';";

$result = $conn->query($mysql_qry);

$response = array();



if ($result->num_rows > 0){

    while ($row = $result->fetch_assoc()){

        array_push($response,array("owner"=>$row));

    }

    

	echo json_encode(array("server_response"=>$response));

} else{

	echo json_encode(array("server_response"=>$conn->error));			// return -1 means no user Found

}



?>


