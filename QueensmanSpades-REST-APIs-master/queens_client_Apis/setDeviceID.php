<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$user_email = $_GET["email"];
$device_id = $_GET["device_id"];

$mysql_qry = "UPDATE client SET stored_device_id = '$device_id' WHERE client.email = '$user_email';";
$result = $conn->query($mysql_qry);
    if ($result === TRUE) {
        echo json_encode(array("server_responce" => "Successfully submitted device ID."));
    } else {
        echo json_encode(array("server_responce" => 'Failed to submit device ID.'));
    }

?>
