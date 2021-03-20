<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$worker_id = $_GET["worker_id"];
$callout_id = $_GET["callout_id"];
$instructions = $_GET["instructions"];
$status = "Job Assigned";
$updated_by = '1';
$response = array();
    $mysql_qry1 = "INSERT INTO job(callout_id, instructions) VALUES('$callout_id', '$instructions');";
    $result1 = $conn->query($mysql_qry1);

    if ($result1 === TRUE){
	$response ['job_table'] = 'successfully updated job table';
//        echo json_encode(array("server_response"=>"Successfully updated job table."));

        $mysql_qry2 = "UPDATE `callout` SET status='$status'  WHERE id = '$callout_id';";
        $result2 = $conn->query($mysql_qry2);

	if($result2 ===TRUE){


	    $response['callout_status'] = "Successfully updated callout status.";
//            echo json_encode(array("server_response"=>"Successfully updated callout status."));

            $mysql_qry3 = "INSERT INTO `job_history`(callout_id, status_update, updated_by, updater_id) VALUES('$callout_id', '$status', 'Admin', '$updated_by'); ";
            $result3 = $conn->query($mysql_qry3);

            if ($result3 === TRUE){
		$response['job_history']= "Successfully marked job history.";
		
		 echo json_encode(array("server_response"=>$response));

            } else {
                echo json_encode(array("server_response"=>$conn->error));
            }
        } else {
            echo json_encode(array("server_response"=>$conn->error));
        }
    } else {
        echo json_encode(array("server_response"=>$conn->error));
    }


?>
