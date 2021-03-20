<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$address = $_GET["address"];
$community = $_GET["community"];
$city = $_GET["city"];
$country = $_GET["country"];
$comments = $_GET["comments"];
$type = $_GET["property_type"];
$uploaded_by = $_GET["uploaded_by"]; // ID of admin logged in

$mysql_qry = "INSERT INTO property(`address`, community, city,
            country, uploaded_by, comments, `type`) VALUES('$address', '$community', '$city',
            '$country', '$uploaded_by', '$comments', '$type');";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_response"=>"Successfully Submitted Property Details"));
} else {
    echo json_encode(array("server_response"=>$conn->error));
}

?>
