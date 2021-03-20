<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$user_ID = $_GET["ID"]; 
    $mysql_qry = "SELECT max(id) FROM callout WHERE callout_by = '$user_ID';";
    $result = mysqli_query($conn, $mysql_qry);

    $response = array();


    while ($row = mysqli_fetch_array($result)){
        
        array_push($response,array("callout_id"=>$row[0]));
}

echo json_encode(array("server_response"=>$response));

?>
