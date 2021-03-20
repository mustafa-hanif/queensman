<?php
require "./DBConnect/conn.php";
$user_name = $_GET["name"];
$user_email = $_GET["email"]; 
$user_phone = $_GET["phone"]; 

$mysql_qry = "INSERT INTO contact(full_name, email, phone) VALUES('$user_name', '$user_email', '$user_phone');";
$result = $conn->query($mysql_qry);
if(strlen($user_name) > 0 && strlen($user_email) > 0 && strlen($user_phone) > 0){
    if ($result === TRUE) {
        echo json_encode(array("server_responce"=>"Successfully Submitted Contact Details"));
    } else {
        echo json_encode(array("server_responce"=>-1));
    }
}else {
    echo json_encode(array("server_responce"=>"provide all details"));
}



?>