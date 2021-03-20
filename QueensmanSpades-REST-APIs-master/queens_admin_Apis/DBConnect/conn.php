<?php

$db_name = "queens_db";
$mysql_username = "queens_user";
$mysql_password = "63NIxHPF8VUdsX31";
$server_name = "localhost";
$conn = new mysqli($server_name, $mysql_username, $mysql_password, $db_name);

if ($conn -> connect_errno) {
    echo "Failed to connect to MySQL: " . $mysqli -> connect_error;
    exit();
  }

?>