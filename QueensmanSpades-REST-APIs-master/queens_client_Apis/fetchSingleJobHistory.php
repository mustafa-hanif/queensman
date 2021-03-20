<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$callout_id = $_GET["callout_id"];

$mysql_qry = "SELECT callout_id, status_update, updated_by, `time`
                FROM job_history
                WHERE callout_id = '$callout_id';";
$result = $conn->query($mysql_qry);
$response = array();

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        // print_r(gettype($row));
        array_push($response,array("job_history"=>$row));
    }
    
	echo json_encode(array("server_response"=>$response));
} else{
	echo json_encode(array("server_response"=>$conn->error));			// return -1 means no client property Found
}


?>
