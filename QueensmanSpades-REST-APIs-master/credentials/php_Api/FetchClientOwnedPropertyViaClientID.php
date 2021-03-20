<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_ID = $_GET["ID"]; 
$mysql_qry = "SELECT property.id as property_id, property.address, property.community, property.city, property.country
              FROM property
              INNER JOIN property_owned ON property.id = property_owned.property_id
              WHERE property_owned.owner_id = '$user_ID';";
$result = $conn->query($mysql_qry);
$responce = array();

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        // print_r(gettype($row));
        array_push($responce,array("Client_property"=>$row));
    }
    
	echo json_encode(array("server_responce"=>$responce));
} else{
	echo json_encode(array("server_responce"=>-1));			// return -1 means no client property Found
}


?>