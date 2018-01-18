<?php
include 'connect.php';

if(isset ($_POST['login']) && isset ($_POST['email']))
{
  $sql = "SELECT * FROM users WHERE user_nickname='".$_POST['login']."'";
  $sql2 = "SELECT * FROM users WHERE email='".$_POST['email']."'";
  $flag = array(
    'login' => 1,
    'email' => 1,
  );
  if($conn = connect_db())
  {
    if(checkData($conn, $sql) > 0) $flag['login'] = 0;
    if(checkData($conn, $sql2) > 0) $flag['email'] = 0;
    mysqli_close($conn); 
    $flag = json_encode($flag);
    echo $flag;
  }
 
}

function checkData($conn, $sql)
{
  $result = mysqli_query($conn, $sql);
  if (mysqli_num_rows($result) > 0)
  {
    return true;
  }
  else return false;
}

?>