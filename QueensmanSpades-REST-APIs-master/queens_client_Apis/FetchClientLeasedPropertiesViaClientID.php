<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_ID = $_GET["ID"]; 
$mysql_qry = "SELECT property.id as property_id, property.address, property.community, property.city, 
                     property.country, property.type as category, lease.id as lease_id, lease.lease_start, lease.lease_end
              FROM lease
              INNER JOIN property ON lease.property_id = property.id
              WHERE lease.active = 1 AND lease.lessee_id = '$user_ID';
";
$result = $conn->query($mysql_qry);
$responce = array();

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        // print_r(gettype($row));
        array_push($responce,array("lease_property"=>$row));
    }
    
	echo json_encode(array("server_responce"=>$responce));
} else{
	echo json_encode(array("server_responce"=>-1));			// return -1 means no lease property Found
}


?>
