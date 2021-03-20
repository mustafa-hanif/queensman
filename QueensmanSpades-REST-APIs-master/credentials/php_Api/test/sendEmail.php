<?php
$to = $_GET['to'];
$subject = $_GET['subject'];
$msg = $_GET['message'];
$from = 'SK Tech Support<support@sktechsupport.com>';;
 print_r($_GET);
 
 $msg = str_replace('\n',"<br>",$msg);
 echo $msg;
 

// To send HTML mail, the Content-type header must be set
$headers  = 'MIME-Version: 1.0' . "\r\n";
$headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headers .= 'Cc: support@sktechsupport.com' . "\r\n";
 
// Create email headers
$headers .= 'From: '.$from."\r\n".
    'Reply-To: '.$from."\r\n" .
    'X-Mailer: PHP/' . phpversion();
 
// Compose a simple HTML email message
$message  = '<html><body>';
$message .= '<h1 style="color:#f40;">Greetings!</h1>';
$message .= '<p style="color:#080;font-size:18px;">' . $msg .' </p>';
$message .= '</body></html>';
 
// Sending email
if(mail($to, $subject, $message, $headers)){
    echo 'Your mail has been sent successfully.';
} else{
    echo 'Unable to send email. Please try again.';
}



?>