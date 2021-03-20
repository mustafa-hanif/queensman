<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$mysql_qry = "SELECT MONTH(client.sign_up_time) as month, YEAR(client.sign_up_time) as year, COUNT(DISTINCT(client.id)) as num_of_clients
FROM client
INNER JOIN property_owned ON client.id = property_owned.owner_id
INNER JOIN property ON property_owned.property_id = property.id
WHERE client.active = 1
AND property.country = 'United Kingdom'
GROUP BY MONTH(client.sign_up_time), YEAR(client.sign_up_time) 
ORDER BY MONTH(client.sign_up_time) DESC;";
$result = $conn->query($mysql_qry);
$response = array();

$resultant_array = array();

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        // print_r(gettype($row));
        array_push($response,array("client_count"=>$row));
        array_push($resultant_array,array("client_count"=>$row));
	
    }
    
	// echo json_encode(array("server_response"=>$response));
} else{
	// echo json_encode(array("server_response"=>$conn->error));			// return -1 means no client property Found
}

$mysql_qry1 = "SELECT MONTH(client.sign_up_time) as month, YEAR(client.sign_up_time) as year, COUNT(DISTINCT(client.id)) as num_of_clients
FROM client
INNER JOIN lease ON client.id = lease.lessee_id
INNER JOIN property ON lease.property_id = property.id
WHERE client.active = 1
AND property.country = 'United Kingdom'
GROUP BY MONTH(client.sign_up_time), YEAR(client.sign_up_time) 
ORDER BY MONTH(client.sign_up_time) DESC;";
$result1 = $conn->query($mysql_qry1);
$response1 = array();

if ($result1->num_rows > 0){
    while ($row1 = $result1->fetch_assoc()){
        // print_r(gettype($row));
        array_push($response1,array("client_count"=>$row1));
        array_push($resultant_array,array("client_count"=>$row1));

    }
    
	// echo json_encode(array("server_response"=>$response1));
} else{
	// echo json_encode(array("server_response"=>$conn->error));			// return -1 means no client property Found
}
    echo json_encode(array("server_response"=>$resultant_array));                       // return -1 means no client property Found

?>

