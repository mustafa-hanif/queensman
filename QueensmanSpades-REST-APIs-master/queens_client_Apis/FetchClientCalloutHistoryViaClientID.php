<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_ID = $_GET["ID"]; 
$mysql_qry = "SELECT callout.id, callout.property_id, callout.job_type, callout.description, callout.status, 
                DATE_FORMAT (callout.request_time,'%b %d, %Y') AS request_time, 
                DATE_FORMAT(callout.resolved_time,'%b %d, %Y') AS resolved_time,
                callout.picture1, callout.picture2, callout.picture3, callout.picture4 , callout.urgency_level, callout.action, job.rating, job.feedback,
                property.address,property.community,property.city,property.country, client.id as client_id, client.email as client_username
              FROM callout 
                LEFT JOIN job ON callout.id = job.callout_id
                INNER JOIN client ON callout.callout_by = client.id
                INNER JOIN property ON property.id = callout.property_id 
              WHERE callout.active = 1 AND callout.callout_by = '$user_ID' AND (callout.status = 'Closed' OR callout.status = 'Cancelled')
ORDER BY request_time DESC";
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
