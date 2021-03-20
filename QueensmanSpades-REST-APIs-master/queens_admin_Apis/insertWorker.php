<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$name = $_GET["full_name"]; // string
$email = $_GET["email"]; // string
$phone = $_GET["phone"]; // string
$password = $_GET["password"]; // string
$description = $_GET["description"]; // string
$color_code = $_GET["color_code"];

$mysql_qry = "INSERT INTO worker(full_name, email, password, phone, description, color_code) 
              VALUES('$name', '$email', '$password', '$phone', '$description', '$color_code');";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_response"=>"Successfully Submitted Worker Details"));
} else {
    echo json_encode(array("server_response"=>$conn->error));
}

?>
