<?php
require_once("Mail.php");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');
date_default_timezone_set("Asia/Karachi");

$to = 'services@queensman.com';
$subject = $_GET['subject'];

$callout_id =  $_GET['callout_id'];
$client_id = $_GET['client_id'];
$client_name = $_GET['client_name'];
$client_email = $_GET['client_email'];
$client_phone = $_GET['client_phone'];
$job_type = $_GET['job'];
$req_time = date("M,d,Y h:i:s A");
$description = $_GET['description'];
$callout_urgency = $_GET['callout_urgency'];
$property_id = $_GET['property_id'];
$property_address = $_GET['property_address'];
$community = $_GET['community'];
$city = $_GET['city'];
$country = $_GET['country'];

$from = 'Skynners <skynners.dev@gmail.com>';
$cc = 'm.saad@skynners.com,m.soman@skynners.com,aalvi@queensman.com,ffakhri@queensman.com,msidiqi@queensman.com';

$host = "email-smtp.us-east-1.amazonaws.com";
$username = "AKIAX6QMVR76B5NCTIXR";
$password = "BKVJUWZaVvG/x8VP4+TlQoxeM/C+kbJL2y+Jg5EyBeKT";
//print_r($_GET);
// echo  $callout_id .' '. $client_name.' '. $client_address.' '.$job_type .' '. $description .' '. $req_time;

// To send HTML mail, the Content-type header must be set

// $headers  = 'MIME-Version: 1.0' . "\r\n";
// $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
 
// Create email headers
//$headers = array('From' => $from, 'To' => $to, 'Subject' => $subject, 'CC' => $cc);
//$headers = array('From' => $from, 'To' => $to, 'Subject' => $subject, 'CC' => $cc);
$headers = array('From' => $from, 'To' => $to, 'Subject' => $subject, 'Cc' => $cc,'MIME-Version' => 1,'Content-type' => 'text/html;charset=iso-8859-1');

// $headers .= 'From: '.$from."\r\n".
//     'Reply-To: '.$from."\r\n" .
//     'Cc:' . $cc . "\r\n".
//     'X-Mailer: PHP/' . phpversion();

// Compose a simple HTML email message

//$message   = '<html>';
//$message  .= '<body>';
//$message  .= '<h1 style="color:#f40;">Greetings!</h1>';
//$message  .= '</body>';
//$message  .= '</html>';
// echo $message

$message   = '<html>';
$message  .= '<body>';
$message  .= '<h2>Client Details</h2>';
$message  .= '<p><b>Client ID: </b>'.$client_id.'</p>';
$message  .= '<p><b>Client Name:    </b>'.$client_name.'</p>';
$message  .= '<p><b>Client Email: </b>'.$client_email.'</p>';
$message  .= '<p><b>Client Phone: </b>'.$client_phone.'</p>';
$message  .= '<h2>Callout Details</h2>';
$message  .= '<p><b>Callout ID:     </b>'.$callout_id .'</p>';
$message  .= '<p><b>Job Type:       </b>'.$job_type.'</p>';
$message  .= '<p><b>Callout Urgency: </b>'.$callout_urgency.'</p>';
$message  .= '<p><b>Description:    </b> '.$description.' </p>';
$message  .= '<p><b>Request Time:   </b>'.$req_time.'</p>';
$message  .= '<h2>Property Details</h2>';
$message  .= '<p><b>Property ID: </b>'.$property_id.'</p>';
$message  .= '<p><b>Property Address:     </b>'.$property_address.'</p>';
$message  .= '<p><b>Community:       </b>'.$community.'</p>';
$message  .= '<p><b>City:   </b>'.$city.'</p>';
$message  .= '<p><b>Country:    </b> '.$country.' </p>';
$message  .= '</body>';
$message  .= '</html>';


$smtp = Mail::factory('smtp', array ('host' => $host,
                                     'auth' => true,
                                     'username' => $username,
                                     'password' => $password));
$to = $to .",".$cc;

$mail = $smtp->send($to, $headers, $message);

if ( PEAR::isError($mail) ) {
    echo("<p>Error sending mail:<br/>" . $mail->getMessage() . "</p>");
} else {
//    echo("<p>Email message sent.</p>");
    echo json_encode(array("server_responce"=>"Your mail has been sent successfully."));
}


?>
