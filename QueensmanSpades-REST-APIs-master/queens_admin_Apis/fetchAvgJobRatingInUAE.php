<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$mysql_qry = "SELECT MONTH(callout.request_time) as month, YEAR(callout.request_time) as year, AVG(job.rating) as avg_rating
            FROM job
            INNER JOIN callout ON job.callout_id = callout.id
            INNER JOIN property ON callout.property_id = property.id
            WHERE property.country = 'United Arab Emirates'
            AND property.active = 1
            AND callout.active = 1
            GROUP BY MONTH(callout.request_time), YEAR(callout.request_time) 
            ORDER BY MONTH(callout.request_time) DESC;";
$result = $conn->query($mysql_qry);
$response = array();

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        // print_r(gettype($row));
        array_push($response,array("avg_rating"=>$row));
    }
    
	echo json_encode(array("server_response"=>$response));
} else{
	echo json_encode(array("server_response"=>$conn->error));			// return -1 means no client property Found
}


?>
