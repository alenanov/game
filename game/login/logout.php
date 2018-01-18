<?php
session_start();

if (isset($_POST["btn_logout"]))
{
  // remove all session variables
  session_unset(); 

  // destroy the session 
  session_destroy(); 
  setcookie("_lg", "", time() - 360000, '/'); 
  setcookie("_ps", "", time() - 360000, '/');
  header("Location: ../index.php"); exit();
}
?>