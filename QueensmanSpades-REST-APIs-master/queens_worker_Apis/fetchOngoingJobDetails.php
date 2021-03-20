<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$callout_ID = $_GET["ID"]; // Callout ID
$mysql_qry = "SELECT callout.id, job.signature, job.rating, job.feedback, job.solution
                FROM callout 
                INNER JOIN job ON job.callout_id = callout.id  
                WHERE callout.id = '$callout_ID';";
$result = $conn->query($mysql_qry);
$response = array();

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        // print_r(gettype($row));
        array_push($response,array("ongoing_job_details"=>$row));
    }
    
	echo json_encode(array("server_response"=>$response));
} else{
	echo json_encode(array("server_response"=>-1));			// return -1 means no client property Found
}


?>
