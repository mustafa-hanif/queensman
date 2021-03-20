<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$property_id = $_GET["property_id"];
$month = $_GET["month"];
$year = $_GET["year"];

$mysql_qry = "SELECT callout.id as callout_id, callout.job_type, callout.description, callout.category,
                callout.request_time, callout.resolved_time, callout.urgency_level, job.feedback, 
                property.id as property_id, property.address,property.community, property.city, property.country, 
                client.id as client_id, client.email as client_email, client.full_name as client_name,
                job_history.status_update, job_history.time as update_time, job_history.updated_by
                FROM callout 
                LEFT JOIN job ON callout.id = job.callout_id
                INNER JOIN client ON callout.callout_by = client.id
                INNER JOIN property ON property.id = callout.property_id 
                INNER JOIN job_history ON callout.id = job_history.callout_id
                WHERE callout.active = 1
                AND property.id = '$property_id'
                AND ((MONTH(callout.request_time) = '$month'
                AND YEAR(callout.request_time) = '$year')
                OR (MONTH(callout.planned_time) = '$month'
                AND YEAR(callout.planned_time) = '$year')
                OR (MONTH(callout.resolved_time) = '$month'
                AND YEAR(callout.resolved_time) = '$year'))
                ORDER BY callout_id DESC;";
$result = $conn->query($mysql_qry);
$response = array();

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        // print_r(gettype($row));
        array_push($response,array("monthly_services"=>$row));
    }
    
	echo json_encode(array("server_response"=>$response));
} else{
	echo json_encode(array("server_response"=>$conn->error));			// return -1 means no client property Found
}


?>
