<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$inventory_article_id = $_GET["article_id"];

$mysql_qry = "DELETE FROM inventory_article WHERE id = '$inventory_article_id';";
$result = $conn->query($mysql_qry);

if ($result === TRUE) {
    echo json_encode(array("server_response"=>"Successfully Deleted Inventory Article."));
} else {
    echo json_encode(array("server_response"=>$conn->error));
}

?>
