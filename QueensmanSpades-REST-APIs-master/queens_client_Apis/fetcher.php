<?php
require "./DBConnect/conn.php";
$user_ID = $_GET["ID"]; 
$mysql_qry = "SELECT full_name FROM client WHERE id = '$user_ID';";
$result = mysqli_query($conn, $mysql_qry);

$response = array();
$id = "";
while ($row = mysqli_fetch_array($result)){
	
	array_push($response,array("full_name"=>$row[0]));
$id = "".$row[0];
}
echo $id;


?>
