<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$callout_rating = $_GET["rating"];
$callout_id = $_GET["callout_id"];


$mysql_qry = "UPDATE `job` SET rating='$callout_rating' WHERE id = '$callout_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE) {
        echo json_encode(array("server_response"=>"Successfully updated rating for this callout."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>