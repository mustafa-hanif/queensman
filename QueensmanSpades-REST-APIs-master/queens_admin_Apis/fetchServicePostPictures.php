<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$callout_id = $_GET["callout_id"];

$mysql_qry = "SELECT post_job_picture.picture_location 
                FROM callout 
                INNER JOIN post_job_picture ON callout.id = post_job_picture.callout_id
                WHERE callout.id = '$callout_id' 
                ORDER BY request_time DESC";
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
