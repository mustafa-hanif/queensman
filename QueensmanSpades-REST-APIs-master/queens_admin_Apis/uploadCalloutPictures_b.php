<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');


    // Defining DB
    require "./DBConnect/conn.php";

    // Uploading file name
    $picture1 = $_GET["picture1"]; 
    $picture2 = $_GET["picture2"];
    $picture3 = $_GET["picture3"];
    $picture4 = $_GET["picture4"];


    // Fetching current hall ID from DB via manager ID
    $callout_id = $_GET["callout_id"];
    
    $picture1 = "http://www.queensman.com/queens_client_Apis/photos/".$picture1;
    $picture2 = "http://www.queensman.com/queens_client_Apis/photos/".$picture2;
    $picture3 = "http://www.queensman.com/queens_client_Apis/photos/".$picture3;
    $picture4 = "http://www.queensman.com/queens_client_Apis/photos/".$picture4;

    // Uploading image link to database
    $mysql_qry2 = "UPDATE callout SET picture1 = '$picture1', picture2 = '$picture2' , picture3 = '$picture3' , picture4 = '$picture4'  WHERE id = '$callout_id';";
    $result2 = $conn->query($mysql_qry2);

    if ($result2 === TRUE) {
        echo json_encode(array("server_response"=>"The selected images' references have been uploaded to database."));
    } else {
        echo json_encode(array("server_response"=>"The selected images' references have not been uploaded to database correctly."));
    }

?>
