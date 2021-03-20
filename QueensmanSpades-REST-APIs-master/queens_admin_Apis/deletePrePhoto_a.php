<?php 
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

    // Uploading file
    $target_dir = "../queens_worker_Apis/pre_photos/";
    $target_file = $target_dir.$_GET["target_file"];

        if (unlink($target_file)) {
            echo json_encode(array("server_response"=>"The picture has been deleted."));
        } else {
            echo json_encode(array("server_response"=>"Sorry, there was an error deleting your picture."));
        }
    

?>
