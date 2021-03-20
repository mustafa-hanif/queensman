<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_ID = $_GET["ID"]; // Worker ID
$mysql_qry = "SELECT callout.id, job.signature
                FROM callout 
                INNER JOIN job ON job.callout_id = callout.id 
                INNER JOIN client ON callout.callout_by = client.id
                INNER JOIN property ON property.id = callout.property_id
                INNER JOIN job_worker ON callout.id = job_worker.callout_id 
                WHERE job_worker.worker_id = '$user_ID'
           ";
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
