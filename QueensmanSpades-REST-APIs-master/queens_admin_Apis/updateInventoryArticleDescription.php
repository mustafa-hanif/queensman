<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$inventory_article_description = $_GET["description"];
$inventory_article_id = $_GET["inventory_article_id"];


$mysql_qry = "UPDATE `inventory_article` SET `description`='$inventory_article_description' WHERE id = '$inventory_article_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE && $conn->affected_rows > 0) {
        echo json_encode(array("server_response"=>"Successfully updated article description for this inventory_article."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>