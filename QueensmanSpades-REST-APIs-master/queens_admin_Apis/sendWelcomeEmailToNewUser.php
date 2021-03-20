<?php
require_once("Mail.php");
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');
date_default_timezone_set("Asia/Karachi");

$to = $_GET["user_email"];

$subject = "Welcome to Queensman Spades!";

$client_name = $_GET['client_name'];

$from = 'Gathra Nyahuma <gnyahuma@queensman.com>';
$cc = 'aalvi@queensman.com, ffakhri@queensman.com, gnyahuma@queensman.com, ojong@queensman.com, m.saad@skynners.com';

$host = "email-smtp.us-east-1.amazonaws.com";
$username = "AKIAX6QMVR76B5NCTIXR";
$password = "BKVJUWZaVvG/x8VP4+TlQoxeM/C+kbJL2y+Jg5EyBeKT";

$headers = array('From' => $from, 'To' => $to, 'Subject' => $subject, 'Cc' => $cc,'MIME-Version' => 1,'Content-type' => 'text/html;charset=iso-8859-1');

$message   = '<html>';
$message  .= '<body>';
$message  .= '<p>Dear '.$client_name.',</p>';
$message  .= '<p>Please download the Queensman Spades App from apple store or play store, you can also use https://www.client.queensman.com/ and sign in with your email address provided on the signed contract.'.'</p>';
$message  .= '<p>You can now submit your callouts through the app and view scheduled services.'.'</p>';
$message  .= '<p>Thank you for being part of Queensman Spades family.'.'</p>';
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
    echo json_encode(array("server_response"=>"An e-mail to client, ".$client_name.", has been sent successfully."));
}


?>
