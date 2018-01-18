<?php
include '../lib/connect.php';
$email = 0;
$login = 0;
$password = 0;
$time_st = 0;
$user_hash = 0;
$user_ip = 0;

function registration()
{
  $login = htmlspecialchars($_POST['login']);
  $email = htmlspecialchars($_POST['email']);
  $password = trim($_POST['password']);
  $time_st = time();
  $user_hash = mt_rand(100, 999);
  $password = md5(md5($password).$user_hash);
  $user_ip = $_SERVER['REMOTE_ADDR'];
  $sql = "INSERT INTO users (user_nickname, email, password, user_hash, user_ip, status, time_stamp, is_online) 
VALUES ('" . $login . "','" . $email. "','" . $password . "','". $user_hash . "','" . $user_ip . "','0','" . $time_st . "','0')";
  if($conn = connect_db())
  {
    if (mysqli_query($conn, $sql))
    {
      //$_SESSION['id'] = mysqli_query("SELECT ID * FROM users WHERE login=".$login);
      //setcookie ("_lg", $login, time() + 3600*24, '/'); 				
      //setcookie ("_ps", md5($login.$password), time() + 3600*24, '/');
    }
    
    mysqli_close($conn); 
  }
  header("Location: ../index.php"); exit();
}

if (isset($_POST['password']) && isset($_POST['login']) && isset($_POST['email']))
{
  registration();
}

?>