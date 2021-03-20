<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

require "./DBConnect/conn.php";

$name = $_GET["full_name"]; // string
$email = $_GET["email"]; // string
$sec_email = $_GET["sec_email"]; // string
$phone = $_GET["phone"]; // string
$sec_phone = $_GET["sec_phone"]; // string
$account_type = $_GET["account_type"]; // string
$occupation = $_GET["occupation"]; // string
$organization = $_GET["organization"]; // string
$age_range = $_GET["age_range"]; // string
$gender = $_GET["gender"]; // string
$family_size = $_GET["family_size"]; // integer
$ages_of_children = $_GET["ages_of_children"]; // string
$earning_bracket = $_GET["earning_bracket"]; // string
$nationality = $_GET["nationality"]; // string
$years_expatriate = $_GET["years_expatriate"]; // integer
$years_native = $_GET["years_native"]; // integer
$referred_by = $_GET["referred_by"]; // ID of the client who referred
$other_properties = $_GET["other_properties"]; // string
$contract_start_date = $_GET["contract_start_date"]; // YYYY-MM-DD
$contract_end_date = $_GET["contract_end_date"];
$uploaded_by = $_GET["uploaded_by"]; // ID of admin logged in

if($referred_by == 0){
	$referred_by = 'NULL';
}
//echo $referred_by;
$mysql_qry = "INSERT INTO client(full_name, email, sec_email, phone, sec_phone, account_type, occupation, organization, age_range, gender, family_size,
            ages_of_children, earning_bracket, nationality, years_expatriate, years_native, referred_by, other_properties, contract_start_date, uploaded_by, contract_end_date) 
              VALUES('$name', '$email', '$sec_email', '$phone', '$sec_phone', '$account_type', '$occupation', '$organization', '$age_range', '$gender',
              '$family_size', '$ages_of_children', '$earning_bracket', '$nationality', '$years_expatriate', '$years_native', $referred_by, '$other_properties',
              '$contract_start_date', '$uploaded_by', '$contract_end_date');";
$result = $conn->query($mysql_qry);
//echo $mysql_qry;
if ($result === TRUE) {
    echo json_encode(array("server_response"=>"Successfully Submitted Client Details"));
} else {
    echo json_encode(array("server_response"=>$conn->error));
}

?>
