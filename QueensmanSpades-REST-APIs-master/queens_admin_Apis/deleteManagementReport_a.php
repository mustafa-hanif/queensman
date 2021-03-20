<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

    // Uploading file
    $target_dir = "../queens_client_Apis/reports/";
    $target_file = $target_dir.$_GET["target_file"];

        if (unlink($target_file)) {
//            echo "The report has been deleted.";
	    echo json_encode(array("server_response"=>"The report has been deleted from a server"));
        } else {
  //          echo "Sorry, there was an error deleting your report.";
	     echo json_encode(array("server_response"=>"the report hasn't delted from server"));
        }
    

?>
