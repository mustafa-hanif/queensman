<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');


    // Defining DB
    require "./DBConnect/conn.php";

    // Uploading file name
    $target_file = $_GET["target_file"];
    $property_id = $_GET["property_id"];
    
    $target_file_abs = "https://www.queensman.com/queens_client_Apis/reports/".$target_file;

    // Deleting image link from database
    $mysql_qry2 = "DELETE FROM market_report WHERE property_id = '$property_id' and report_location = '".$target_file_abs."';";
    $result2 = $conn->query($mysql_qry2);

    if ($result2 === TRUE) {
//        echo "The report location has been deleted from database.";
	  echo json_encode(array("server_response"=>'The report has been deleted from database'));
    } else {
        //echo "The report location hasn't been deleted from database correctly.";
//	echo json_encode(array("server_response"=>"The report hasn't been deleted from database"));
echo json_encode(array("server_response"=>$conn->error));
    }

?>
