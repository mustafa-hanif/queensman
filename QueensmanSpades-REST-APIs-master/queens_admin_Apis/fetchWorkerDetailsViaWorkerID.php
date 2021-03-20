<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$worker_id = $_GET["worker_id"];

$mysql_qry = "SELECT id, full_name, email, phone, password, description, active, color_code FROM worker WHERE id = '$worker_id';";
$result = $conn->query($mysql_qry);
$response = array();

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        array_push($response,array("workers"=>$row));
    }
    
	echo json_encode(array("server_response"=>$response));
} else{
	echo json_encode(array("server_response"=>$conn->error));			
}

?>
