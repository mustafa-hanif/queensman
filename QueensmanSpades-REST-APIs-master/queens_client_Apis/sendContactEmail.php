<?php
require_once("Mail.php");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');
date_default_timezone_set("Asia/Karachi");

$to = 'm.soman@skynners.com';
$subject = 'Query from Queensman Spades';
$subject_msg = $_GET['subject_msg'];
$client_id = $_GET['client_id'];
$client_name = $_GET['client_name'];
$client_email = $_GET['client_email'];
$client_phone = $_GET['client_phone'];
$client_message = $_GET['message'];

$from = 'Skynners <skynners.dev@gmail.com>';
$cc = 'm.saad@skynners.com';

$host = "email-smtp.us-east-1.amazonaws.com";
$username = "AKIAX6QMVR76B5NCTIXR";
$password = "BKVJUWZaVvG/x8VP4+TlQoxeM/C+kbJL2y+Jg5EyBeKT";
// print_r($_GET);
// echo  $callout_id .' '. $client_name.' '. $client_address.' '.$job_type .' '. $description .' '. $req_time;

// To send HTML mail, the Content-type header must be set
$headers = array('From' => $from, 'To' => $to, 'Subject' => $subject, 'CC' => $cc,'MIME-Version' => 1,'Content-type' => 'text/html;charset=iso-8859-1');
 


// Compose a simple HTML email message

$message = '<html>';
$message .= '<head>';
$message .= '</head>';
$message .= '<body>';
$message .= '<h2>Contact Details</h2>';
$message .= '<p><b>Client ID:</b> <span>'.$client_id.'</span> </p>';
$message .= '<p><b>Client Name:</b> <span>'.$client_name.'</span></p>';
$message .= '<p><b>Client Phone:</b> <span>'.$client_phone.'</span></p>';
$message .= '<p><b>Client Email: </b><span>'.$client_email.'</span></p>';
$message .= '<p><b>Subject: </b><span>'.$subject_msg.'</span></p>';
$message .= '<p><b>Message: </b><span>'.$client_message.'</span></p>' ;
$message .= '</body>';
$message .= '</html>';

// echo $message
 
// Sending email
$smtp = Mail::factory('smtp', array ('host' => $host,
                                     'auth' => true,
                                     'username' => $username,
                                     'password' => $password));

$mail = $smtp->send($to, $headers, $message);

if ( PEAR::isError($mail) ) {
    echo("<p>Error sending mail:<br/>" . $mail->getMessage() . "</p>");
} else {
//    echo("<p>Email message sent.</p>");
    echo json_encode(array("server_responce"=>"Your mail has been sent successfully."));
}



?>
