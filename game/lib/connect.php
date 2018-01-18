<?php
define("SERVERNAME", "localhost");
define("USERNAME", "root");
define("PASSWORD", "");
define("DB_NAME", "game");
$conn = null;

function connect_db()
{
  // Create connection
  $conn = mysqli_connect(SERVERNAME, USERNAME, PASSWORD, DB_NAME);

  // Check connection
  if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
    return false;
  }
 return $conn;
}

?>