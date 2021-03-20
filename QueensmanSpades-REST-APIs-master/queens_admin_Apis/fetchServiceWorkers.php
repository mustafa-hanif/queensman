<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$callout_id = $_GET["callout_id"];

$mysql_qry = "SELECT callout.id, worker.id as worker_id, worker.full_name as worker_name, worker.phone as worker_phone
                FROM callout 
                INNER JOIN job_worker ON callout.id = job_worker.callout_id
                INNER JOIN worker ON job_worker.worker_id = worker.id
                WHERE job_worker.callout_id = '$callout_id';";
$result = $conn->query($mysql_qry);
$response = array();

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        // print_r(gettype($row));
        array_push($response,array("services"=>$row));
    }
    
	echo json_encode(array("server_response"=>$response));
} else{
	echo json_encode(array("server_response"=>$conn->error));			// return -1 means no client property Found
}


?>
