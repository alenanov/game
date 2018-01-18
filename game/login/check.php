<?php
session_start();
include '../lib/connect.php';
if (isset($_POST["btn_login"]))
{
  $login = htmlspecialchars($_POST['login']);
  $password = htmlspecialchars($_POST['password']);
  
  
  $sql = "SELECT ID, password, user_hash FROM users WHERE user_nickname='".$_POST['login']."'";
  
  if($conn = connect_db())
  {
     $result = mysqli_query($conn, $sql);
     if (mysqli_num_rows($result) > 0) {
        $row = mysqli_fetch_assoc($result);
        mysqli_close($conn); 
       
        $password = md5(md5($password).$row["user_hash"]);
        if ($password === $row["password"])
        {
          $_SESSION['id'] = $row["ID"];
          if(isset($_POST["remember"]) && $_POST["remember"] == 1)
          {
            setcookie ("_lg", $login, time() + 3600*24, '/'); 				
            setcookie ("_ps", md5($login.$password), time() + 3600*24, '/');
           
          }
        }   
      }
      header("Location: ../index.php"); exit();
  }
}



if ( isset($_COOKIE["_lg"]) && isset($_COOKIE["_ps"]))
{
  if($conn = connect_db())
  {
    $sql = "SELECT ID, password, user_hash FROM users WHERE user_nickname='".$_COOKIE['_lg']."'";
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0)
    {
        $row = mysqli_fetch_assoc($result);
        if( md5($_COOKIE['_lg'].$row["password"])  == md5($_COOKIE['_lg'].$_COOKIE['_ps']) )
        {
          $_SESSION['id'] = $row["ID"];
        }
        else
        {
          setcookie("_lg", "", time() - 360000, '/'); 				
          setcookie("_ps", "", time() - 360000, '/');
        }
    }
  }
  header("Location: ../index.php"); exit();
  mysqli_close($conn);
}

?>