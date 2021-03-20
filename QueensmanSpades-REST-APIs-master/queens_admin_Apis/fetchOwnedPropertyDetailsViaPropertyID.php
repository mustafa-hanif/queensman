<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$property_id = $_GET["property_id"];
$client_id = $_GET["client_id"];

$mysql_qry = "SELECT property.id as property_id, property.address, property.community, property.city, 
property.country, property.uploaded_by, property_owned.active, property.type, property.comments
FROM property
INNER JOIN property_owned ON property.id = property_owned.property_id
INNER JOIN client ON client.id = property_owned.owner_id
WHERE property.id = '$property_id' AND property_owned.owner_id = '$client_id';";
			
$result = $conn->query($mysql_qry);

if ($row = $result->fetch_assoc() ){
	echo json_encode(array("server_response"=>$row));
} else{
	echo json_encode(array("server_response"=>$conn->error));			
}


?>


