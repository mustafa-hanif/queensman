<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$property_ID = $_GET["property_id"]; 
    $mysql_qry = "SELECT report_location, YEAR(report_upload_date) as report_year, MONTH(report_upload_date) as report_month FROM monthly_services_report WHERE property_id = '$property_ID' ORDER By report_year ASC;";


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
    