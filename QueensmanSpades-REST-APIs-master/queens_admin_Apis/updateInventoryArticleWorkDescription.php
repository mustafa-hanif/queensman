<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$inventory_article_work_description = $_GET["work_description"];
$inventory_article_id = $_GET["inventory_article_id"];


$mysql_qry = "UPDATE `inventory_article` SET `work_description`='$inventory_article_work_description' WHERE id = '$inventory_article_id';";
// echo "query: " . $mysql_qry;
$result = $conn->query($mysql_qry);

    if ($result === TRUE && $conn->affected_rows) {
        echo json_encode(array("server_response"=>"Successfully updated article work_description for this inventory_article."));
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }



?>