<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_ID = $_GET["ID"]; // Worker ID
$mysql_qry = "SELECT callout.id, callout.property_id, callout.job_type, callout.description, callout.status, 
                DATE_FORMAT (callout.request_time,'%b %d, %Y') AS request_time, DATE_FORMAT (callout.planned_time, '%b %d, %Y') as planned_time, 
                callout.picture1, callout.picture2, callout.picture3, callout.picture4 , callout.urgency_level,
                job.instructions, property.address,property.community,property.city,property.country, 
                client.id as client_id, client.full_name as client_name, client.phone as client_phone, client.email as client_email
                FROM callout 
                INNER JOIN job ON job.callout_id = callout.id 
                INNER JOIN client ON callout.callout_by = client.id
                INNER JOIN property ON property.id = callout.property_id
                INNER JOIN job_worker ON callout.id = job_worker.callout_id 
                WHERE job_worker.worker_id = '$user_ID'
                AND (callout.status = 'Job Assigned' OR callout.status = 'In Progress');";
$result = $conn->query($mysql_qry);
$response = array();

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        // print_r(gettype($row));
        array_push($response,array("service_details"=>$row));
    }
    
	echo json_encode(array("server_response"=>$response));
} else{
	echo json_encode(array("server_response"=>-1));			// return -1 means no client property Found
}


?>
