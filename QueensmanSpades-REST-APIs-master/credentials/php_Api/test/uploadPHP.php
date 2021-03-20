<?php
require "./DBConnect/conn.php";


	if (!$conn) {
		die("Connection failed: " . mysqli_connect_error());
	}
	// echo "Connected successfully";

	// Type your website name or domain name here.
	$domain_name = "http://localhost/php_api/test/" ;
	
	// Image uploading folder.
	$target_dir = "test";
	
	// Generating random image name each time so image name will not be same .
	$target_dir = $target_dir . "/" .rand() . "_" . time() . ".jpeg";
	
	// Receiving image tag sent from application.
	// $img_tag = $_POST["image_tag"];
	
	// Receiving image sent from Application
	// echo "target dir: " . $target_dir;
	$tmp = $target_dir;
	$target_dir = "/" .$target_dir;
	$target_dir = "C:/xampp/htdocs/php_Api" . $target_dir;
	// echo "target dir: " . $target_dir;
	// print_r($_FILES);
	
	if(move_uploaded_file($_FILES['fileToUpload']['tmp_name'], $target_dir)){
		
		// Adding domain name with image random name.
		$target_dir = $tmp;
		$target_dir = $domain_name . $target_dir ;
		
		// Inserting data into MySQL database.
		$img_tag = "cute";
		$sql = "insert into image_upload_table ( image_tag, image_path) VALUES('$img_tag' , '$target_dir')"; //query here
		// mysql_query("insert into image_upload_table ( image_tag, image_path) VALUES('$img_tag' , '$target_dir')");
		$MESSAGE = "Image Uploaded Successfully." ;
		if ($conn->query($sql) === TRUE) {
			$MESSAGE = "New record created successfully";
			
		} else {
			$MESSAGE =  "Error: " . $sql . "<br>" . $conn->error;
		}
		
		
			
		// Printing response message on screen after successfully inserting the image .	
		//echo json_encode($MESSAGE);
		echo json_encode(array("server_responce"=>$MESSAGE));
	}


?>