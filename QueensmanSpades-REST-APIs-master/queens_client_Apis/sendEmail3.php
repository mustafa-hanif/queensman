<?php
require_once("Mail.php");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');
date_default_timezone_set("Asia/Karachi");

$to = 'm.saad@skynners.com';
$subject = $_GET['subject'];
$from = 'Skynners <skynners.dev@gmail.com>';
$cc = 'm.soman@skynners.com';

$host = "email-smtp.us-east-1.amazonaws.com";
$username = "AKIAX6QMVR76B5NCTIXR";
$password = "BKVJUWZaVvG/x8VP4+TlQoxeM/C+kbJL2y+Jg5EyBeKT";
// print_r($_GET);
// echo  $callout_id .' '. $client_name.' '. $client_address.' '.$job_type .' '. $description .' '. $req_time;

// To send HTML mail, the Content-type header must be set

// $headers  = 'MIME-Version: 1.0' . "\r\n";
// $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
 
// Create email headers
$headers = array('From' => $from, 'To' => $to, 'Subject' => $subject, 'CC' => $cc);
// $headers .= 'From: '.$from."\r\n".
//     'Reply-To: '.$from."\r\n" .
//     'Cc:' . $cc . "\r\n".
//     'X-Mailer: PHP/' . phpversion();

// Compose a simple HTML email message

$message   = '<html>';
$message  .= '<body>';
$message  .= '<h1 style="color:#f40;">Greetings!</h1>';
$message  .= '</body>';
$message  .= '</html>';
// echo $message

$smtp = Mail::factory('smtp', array ('host' => $host,
                                     'auth' => true,
                                     'username' => $username,
                                     'password' => $password));

$mail = $smtp->send($to, $headers, $message);

if ( PEAR::isError($mail) ) {
    echo("<p>Error sending mail:<br/>" . $mail->getMessage() . "</p>");
} else {
    echo("<p>Email message sent.</p>");
}


?>
