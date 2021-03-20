<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');


    // Defining DB
    require "./DBConnect/conn.php";

    // Uploading file name
    $target_file = $_GET["target_file"];

    // Fetching current hall ID from DB via manager ID
    $callout_id = $_GET["ID"];
    
    $target_file_abs = "http://www.queensman.com/queens_worker_Apis/post_photos/".$target_file;

    // Uploading image link to database
    $mysql_qry2 = "INSERT INTO post_job_picture(callout_id, picture_location) VALUES('$callout_id','$target_file_abs');";
    $result2 = $conn->query($mysql_qry2);

    if ($result2 === TRUE) {
        echo json_encode(array("server_response"=>"The file location has been uploaded."));
    } else {
        echo json_encode(array("server_response"=>"The file location hasn't been uploaded to database correctly."));
    }

?>
