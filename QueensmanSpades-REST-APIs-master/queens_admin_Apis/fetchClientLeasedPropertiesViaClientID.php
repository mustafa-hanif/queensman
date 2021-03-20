<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_ID = $_GET["ID"]; 
$mysql_qry = "SELECT property.id as property_id, property.address, property.community, property.city, 
                     property.country, property.type, property.comments, lease.id as lease_id, lease.lease_start, lease.lease_end
              FROM lease
              INNER JOIN property ON lease.property_id = property.id
              WHERE lease.lessee_id = '$user_ID'
              AND lease.active = 1;";
$result = $conn->query($mysql_qry);
$response = array();

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        // print_r(gettype($row));
        array_push($response,array("leased_properties"=>$row));
    }
    
	echo json_encode(array("server_response"=>$response));
} else{
	echo json_encode(array("server_response"=>-1));			// return -1 means no lease property Found
}


?>
