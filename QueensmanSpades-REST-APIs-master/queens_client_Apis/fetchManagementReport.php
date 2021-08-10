<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$property_ID = $_GET["ID"]; 
$mysql_qry = "SELECT report_location, YEAR(report_upload_date) as report_year, MONTHNAME(report_upload_date) as report_month FROM management_report WHERE property_id = '$property_ID';";
$result = mysqli_query($conn, $mysql_qry);

$response = array();

while ($row = mysqli_fetch_array($result)){    
    array_push($response,array("server_response"=>$row));
}

echo json_encode(array("server_response"=>$response));

?>