<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$property_id = $_GET["property_id"];
$client_id = $_GET["client_id"];

$mysql_qry = "SELECT property.id as property_id, property.address, property.community, property.city, 
			property.country, property.type, property.comments, lease.lease_start, lease.lease_end, client.id as client_id, lease.active
            FROM lease
        	INNER JOIN property ON lease.property_id = property.id
			INNER JOIN client ON client.id = lease.lessee_id
			WHERE property.id = '$property_id' AND lease.lessee_id = '$client_id';";
			
$result = $conn->query($mysql_qry);

if ($row = $result->fetch_assoc() ){
	echo json_encode(array("server_response"=>$row));
} else{
	echo json_encode(array("server_response"=>$conn->error));			
}


?>
