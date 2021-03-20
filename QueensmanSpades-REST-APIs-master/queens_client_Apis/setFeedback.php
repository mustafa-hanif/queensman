<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";
$current_callout_id = $_GET["callout_id"];
$rating = $_GET["rating"];
$feedback = $_GET["feedback"];


$mysql_qry = "SELECT rating FROM job WHERE id = '$current_callout_id';";
$result = $conn->query($mysql_qry);
if ($row = $result->fetch_assoc()) {
    echo json_encode(array("server_responce_rating" => $row));
} else {
    // echo json_encode(array("server_responce_ID" => -1));            // return -1 means no ID Found
    $mysql_qry = "INSERT INTO job(id, rating, feedback) VALUES ('$current_callout_id', '$rating', '$feedback');";
    $result = $conn->query($mysql_qry);
 
        if ($result === TRUE) {
            echo json_encode(array("server_responce" => "Successfully Submitted rating"));
        } else {
            echo json_encode(array("server_responce" => 'failed to submit rating'));
        }
    
}



?>
<?php








?>