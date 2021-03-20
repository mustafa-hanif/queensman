<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";



$property_ID = $_GET["property_id"]; 
$mysql_qry = "SELECT callout.id, callout.property_id, callout.job_type, callout.description, callout.status, DATE_FORMAT(callout.request_time, '%b %d, %Y') AS request_time,
                     DATE_FORMAT(callout.resolved_time, '%b %d, %Y') AS resolved_time, DATE_FORMAT(callout.planned_time, '%b %d, %Y') AS planned_time, callout.picture1, callout.picture2, callout.picture3, callout.picture4 , callout.urgency_level, client.id as client_id, client.full_name, client.phone, client.email as client_username, property.id as property_id, property.address, property.community, property.city, property.country
              FROM callout
              INNER JOIN client ON callout.callout_by = client.id
INNER JOIN property ON callout.property_id = property.id
              WHERE callout.active = 1 AND callout.property_id = '$property_ID' AND (callout.status != 'Closed' AND callout.status != 'Cancelled')
ORDER BY callout.request_time DESC;";
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
