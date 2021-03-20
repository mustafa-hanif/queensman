<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$mysql_qry = "SELECT id, full_name, email, phone, password, sec_email, sec_phone, account_type, occupation, organization, age_range, gender, family_size, ages_of_children, earning_bracket, nationality, years_expatriate, years_native, referred_by, other_properties, contract_start_date, contract_end_date, sign_up_time, active 
            FROM client;";
$result = $conn->query($mysql_qry);
$response = array();

if ($result->num_rows > 0){
    while ($row = $result->fetch_assoc()){
        array_push($response,array("clients"=>$row));
    }
    
	echo json_encode(array("server_response"=>$response));
} else{
	echo json_encode(array("server_response"=>$conn->error));			// return -1 means no user Found
}

?>
