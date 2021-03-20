<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$callout_ID = $_GET["ID"]; // callout ID

    $mysql_qry = "SELECT note 
                FROM job_notes
                WHERE callout_id = '$callout_ID';";
    $result = $conn->query($mysql_qry);
    $response = array();

    if ($result->num_rows > 0){
        while ($row = $result->fetch_assoc()){
            array_push($response,$row);
        }
        echo json_encode(array("server_response"=>$response));
    } else{
        echo json_encode(array("server_response"=>-1));			// return -1 means no lease property Found
    }


?>