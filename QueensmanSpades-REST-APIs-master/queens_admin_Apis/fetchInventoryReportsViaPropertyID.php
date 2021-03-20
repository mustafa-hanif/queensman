<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$property_ID = $_GET["property_id"]; 
    $mysql_qry = "SELECT id, property_id, checked_on, ops_team_id, inspection_done_by, summary, approved, YEAR(checked_on) as report_year, MONTH(checked_on) as report_month FROM inventory_report WHERE property_id = '$property_ID' ORDER By report_year ASC;";


    $result = $conn->query($mysql_qry);
    $response = array();

    if ($result->num_rows > 0){
        while ($row = $result->fetch_assoc()){
            array_push($response,array("reports"=>$row));
        }
        
        echo json_encode(array("server_response"=>$response));
    } else{
        echo json_encode(array("server_response"=>$conn->error));			// return -1 means no user Found
    }
    
    ?>
    