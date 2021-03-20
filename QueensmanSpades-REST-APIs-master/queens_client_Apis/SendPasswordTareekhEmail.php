<?php
require_once("Mail.php");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

// $to = 'services@queensman.com';
$to = $_GET['email'];
$subject = 'Tareekh: Request Password';
$user_password = $_GET['password'];
$from = 'Skynners <skynners.dev@gmail.com>';
//  print_r($to);

// $to = 'm.saad@skynners.com';
// $subject = $_GET['subject'];
// $from = 'Skynners <skynners.dev@gmail.com>';
// $cc = 'm.saad@skynners.com';
$cc = 'm.soman@skynners.com,m.saad@skynners.com';

$host = "email-smtp.us-east-1.amazonaws.com";
$username = "AKIAX6QMVR76B5NCTIXR";
$password = "BKVJUWZaVvG/x8VP4+TlQoxeM/C+kbJL2y+Jg5EyBeKT";
// print_r($_GET);
// echo  $callout_id .' '. $client_name.' '. $client_address.' '.$job_type .' '. $description .' '. $req_time;

// To send HTML mail, the Content-type header must be set

// $headers  = 'MIME-Version: 1.0' . "\r\n";
// $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
 
// Create email headers
$recipients = $to.", ".$cc;
$headers = array('From' => $from, 'To' => $to, 'Subject' => $subject, 'CC' => $cc,'MIME-Version' => 1,'Content-type' => 'text/html;charset=iso-8859-1');
// $headers .= 'From: '.$from."\r\n".
//     'Reply-To: '.$from."\r\n" .
//     'Cc:' . $cc . "\r\n".
//     'X-Mailer: PHP/' . phpversion();

// Compose a simple HTML email message

// $message   = '<html>';
// $message  .= '<body>';
// $message  .= '<h1 style="color:#f40;">Greetings!</h1>';
// $message  .= '</body>';
// $message  .= '</html>';


$message   = '<html>';
$message  .= '<body>';
$message  .= '<h2>Requested Password</h2>';
$message  .= '<p><b>Manager Email: </b>'.$to.'</p>';
$message  .= '<p><b>Manager Password: </b>'.$user_password.'</p>';
$message  .= '</body>';
$message  .= '</html>';
// echo $message

$smtp = Mail::factory('smtp', array ('host' => $host,
                                     'auth' => true,
                                     'username' => $username,
                                     'password' => $password));

$mail = $smtp->send($recipients, $headers, $message);

if ( PEAR::isError($mail) ) {
    echo("<p>Error sending mail:<br/>" . $mail->getMessage() . "</p>");
} else {
    echo json_encode(array("server_response"=>"Email message sent."));
//     echo("Email message sent.");
}


?>