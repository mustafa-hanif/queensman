<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');
date_default_timezone_set("Asia/Karachi");

$to = 'services@queensman.com';
$subject = $_GET['subject'];
$callout_id =  $_GET['callout_id'];
$client_name = $_GET['client_name'];
$client_address = $_GET['client_add'];
$job_type = $_GET['job'];
$req_time = date("M,d,Y h:i:s A");
$description = $_GET['description'];
$from = 'Skynners <skynners.dev@gmail.com>';

$cc = 'aalvi@queensman.com,ffakhri@queensman.com,msidiqi@queensman.com,m.soman@skynners.com,m.saad@skynners.com';
// print_r($_GET);
// echo  $callout_id .' '. $client_name.' '. $client_address.' '.$job_type .' '. $description .' '. $req_time;

// To send HTML mail, the Content-type header must be set
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
 
// Create email headers
$headers .= 'From: '.$from."\r\n".
    'Reply-To: '.$from."\r\n" .
    'Cc:' . $cc . "\r\n".
    'X-Mailer: PHP/' . phpversion();

// Compose a simple HTML email message

$message   = '<html>';
$message  .= '<body>';
$message  .= '<h1 style="color:#f40;">Greetings!</h1>';
$message  .= '<p style="color:#d27d00;font-size:18px;"><b>callout ID:</b>'.$callout_id .'</p>';
$message  .= '<p style="color:#d27d00;font-size:18px;"><b>Client Name:</b>'.$client_name.'</p>';
$message  .= '<p style="color:#d27d00;font-size:18px;"><b>Client Address:</b>'.$client_address.'</p>';
$message  .= '<p style="color:#d27d00;font-size:18px;"><b>Job Type:</b>'.$job_type.'</p>';
$message  .= '<p style="color:#d27d00;font-size:18px;"><b>Request Time:</b>'.$req_time.'</p>';
$message  .= '<p style="color:#d27d00;font-size:18px;"><b>Description:</b> '.$description.' </p>';
$message  .= '</body>';
$message  .= '</html>';
// echo $message
 
// Sending email
if(mail($to, $subject, $message, $headers)){
  // echo 'Your mail has been sent successfully.';
	echo json_encode(array("server_responce"=>"Your mail has been sent successfully."));
} else{
    //echo 'Unable to send email. Please try again.';
	echo json_encode(array("server_responce"=>"Unable to send email. Please try again."));
}



?>