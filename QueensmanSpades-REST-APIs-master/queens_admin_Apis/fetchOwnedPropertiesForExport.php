<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$mysql_qry = "SELECT property.id as property_id, property.address, property.community, property.city, property.country, property_owned.active,
			property.type, property.comments,
			client.id as client_id, client.full_name, client.phone, client.email 
			FROM property
			INNER JOIN property_owned ON property_owned.property_id = property.id 
			INNER JOIN client ON client.id = property_owned.owner_id
			;";
$result = $conn->query($mysql_qry);
$response = array();

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        array_push($response,array("properties"=>$row));
    }
    
	echo json_encode(array("server_response"=>$response));
} else{
	echo json_encode(array("server_response"=>$conn->error));			// return -1 means no user Found
}

?>
