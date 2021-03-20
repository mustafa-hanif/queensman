<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: *');
header('Content-Type: application/json');

    $dbserver = "166.62.30.147";
    $dbuser = "skynners_javed";
    $dbpass = "JJu}01]Gmj([";
    $dbname = "obaid_db4";

    $responceMsg='';

    $conn = new mysqli($dbserver,$dbuser,$dbpass,$dbname);
    $data_for_customer = array();

    if(!$conn->connect_error){
        //echo "success";
        if($_GET){
            $name = $_GET['name'];
            $cnic = $_GET['cnic'];
            $project = $_GET['project'];
            $phone = $_GET['phone'];
            $email = $_GET['email'];
            $address = $_GET['address'];
    
            $query = "INSERT INTO `deal_request` 
                      VALUES ('$cnic','$name','$phone','$email','$address','$project',CURRENT_TIMESTAMP);";
           
            //  echo $query;
            $result = mysqli_query($conn,$query);
            if($result){
                $responceMsg = 'Deal Request Sent.';
                
            }

            if($project =='1'){
                $project= "National Industrial Hub";
            } else if($project == '2'){
                $project = "NEDians";
            } else if($project == '3'){
                $project = "Murree Oaks";
            } else if($project == '4'){
                $project = "Ever Green Farm House";
            } else if($project == '5'){
                $project = "Muqadas Town";
            } else if($project == '6'){
                $project = "Green Orchard Farms";
            } else if($project == '7'){
                $project = "Samanan Town";
            } else if($project == '8'){
                $project = "Obaid City";
            }

        $to = 'maj03334554955@gmail.com';
        $subject = 'Deal Request';
        $msg = "name: $name <br>  Phone: $phone <br>  Email: $email <br> CNIC: $cnic <br>  Address: $address <br>  Project: $project";
        $from = 'skynners.dev@gmail.com';
        // print_r($_GET);

        // To send HTML mail, the Content-type header must be set
        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
        
        // Create email headers
        $headers .= 'From: '.$from."\r\n".
            'Reply-To: '.$from."\r\n" .
            'X-Mailer: PHP/' . phpversion();
        
        // Compose a simple HTML email message
        $message  = '<html><body>';
        $message .= '<h1 style="color:#f40;">Greetings!</h1>';
        $message .= '<h3 style="color:#f40;">Request Deal!</h3>';
        $message .= '<p style="color:#080;font-size:18px;">' . $msg .' </p>';
        $message .= '</body></html>';
        
        // Sending email
        if(mail($to, $subject, $message, $headers)){
            $responceMsg .='Your mail has been sent successfully.';
            print_r(json_encode(array('server_responce'=>$responceMsg)));
        } else{
            $responceMsg.= 'Unable to send email. Please try again.';
            print_r(json_encode(array('server_responce'=>$responceMsg)));

        }

      
     
        

           

            
                    
      }else {
          echo 'no get variable';
      }
        
    }else {
        echo "failed";
        throw new Exception ($conn->connect_errno);


    }
    

?>