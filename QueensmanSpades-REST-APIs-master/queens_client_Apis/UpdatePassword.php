<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_password = $_GET["password"];
$user_email = $_GET["email"];


$mysql_qry = "UPDATE client SET password='$user_password' WHERE email = '$user_email';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);
if(strlen($user_email) > 0 && strlen($user_password) > 0){
    if ($result === TRUE) {
        echo json_encode(array("server_responce"=>"Successfully updated password"));
    } else {
        echo json_encode(array("server_responce"=>$conn->error));
    }
}else {
    echo json_encode(array("server_responce"=>"provide all details"));
}



?>