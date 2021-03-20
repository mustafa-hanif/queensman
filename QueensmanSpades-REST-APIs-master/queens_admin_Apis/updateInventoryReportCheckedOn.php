<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$inventory_report_checked_on = $_GET["checked_on"];
$inventory_report_id = $_GET["inventory_report_id"];


$mysql_qry = "UPDATE `inventory_report` SET `checked_on`='$inventory_report_checked_on' WHERE id = '$inventory_report_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated checked_on for this inventory_report."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>