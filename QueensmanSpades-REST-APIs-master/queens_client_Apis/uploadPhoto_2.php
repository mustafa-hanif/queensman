<?php 
    // Defining DB
    require "./DBConnect/conn.php";

    // Fetching current callout ID from DB
    $mysql_qry = "SELECT max(id) FROM callout;";
    $result = mysqli_query($conn, $mysql_qry);
    
    $response = array();
    $callout_id = "";
    
    while ($row = mysqli_fetch_array($result)){
        array_push($response,array("callout_id"=>$row[0]));
        $callout_id = "".$row[0];
    }

    // Uploading file
    $target_dir = "./photos/";
    $target_file = $target_dir.basename($_FILES['photo']['name']);
    //move_uploaded_file($_FILES['photo']['tmp_name'], './photos/' . $_FILES['photo']['name']); 

    $uploadOk = 1;
    $imageFileType = strtolower(pathinfo($target_file,PATHINFO_EXTENSION));
    // Check if image file is a actual image or fake image
    
    $check = getimagesize($_FILES["photo"]["tmp_name"]);
    if($check !== false) {
        echo "File is an image - " . $check["mime"] . ".";
        $uploadOk = 1;
    } else {
        echo "File is not an image.";
        $uploadOk = 0;
    }

    // Check if file already exists
    if (file_exists($target_file)) {
        echo "Sorry, file already exists.";
        $uploadOk = 0;
    }
    // Check file size
    if ($_FILES["photo"]["size"] > 500000) {
        echo "Sorry, your file is too large.";
        $uploadOk = 0;
    }
    // Allow certain file formats
    if($imageFileType != "jpg" && $imageFileType != "png" && $imageFileType != "jpeg" && $imageFileType != "gif" ) {
        echo "Sorry, only JPG, JPEG, PNG & GIF files are allowed.";
        $uploadOk = 0;
    }
    // Check if $uploadOk is set to 0 by an error
    if ($uploadOk == 0) {
        echo "Sorry, your file was not uploaded.";
    // if everything is ok, try to upload file
    } else {
        if (move_uploaded_file($_FILES["photo"]["tmp_name"], $target_file)) {
            $target_file = ltrim($target_file, '.');
            $target_file = "http://www.queensman.com/queens_client_Apis/".$target_file;

            // Uploading image link to database
            $mysql_qry2 = "UPDATE callout SET picture2 = '$target_file' WHERE id = '$callout_id';";
            $result2 = $conn->query($mysql_qry2);

            if ($result2 === TRUE) {
                echo $target_file;
                echo "The file ". basename( $_FILES["photo"]["name"]). " has been uploaded.";
            } else {
                echo "The file hasn't been uploaded to database correctly.";
            }
        } else {
            echo "Sorry, there was an error uploading your file.";
        }
    }

?>
