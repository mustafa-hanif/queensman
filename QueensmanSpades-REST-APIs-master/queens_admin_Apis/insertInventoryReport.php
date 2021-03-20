<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$property_id = $_GET["property_id"];
$ops_team_id = $_GET["ops_team_id"];
$inspection_done_by = $_GET["inspection_done_by"];
$summary = $_GET["summary"];
$checked_on = $_GET["checked_on"];

$mysql_qry = "INSERT INTO inventory_report(property_id, ops_team_id, inspection_done_by, summary, checked_on) 
            VALUES('$property_id', '$ops_team_id', '$inspection_done_by', '$summary', '$checked_on');";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_response"=>$conn->insert_id));
} else {
    echo json_encode(array("server_response"=>$conn->error));
}

?>
