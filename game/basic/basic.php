<?php
include '../lib/connect.php';
session_start();
$time_st = 0;
$flag = false;
$conn = 0;
$row = 0;
$dataArr = array(
  "code"  => "",
  "coord" => "" 
);

if(isset ($_POST['data']) &&  $_POST['data'] == 1)
{
  
  $sql = "UPDATE users SET status = '1' WHERE ID=".$_SESSION['id'];
  $sql2 = "SELECT * FROM rooms WHERE count='0'";
  $sql3 = "";

  if($conn = connect_db())
  {
    
    if (mysqli_query($conn, $sql))
    {
       $result = mysqli_query($conn, $sql2);
       
      
       if (mysqli_num_rows($result) > 0)
       {
          $flag = true;
          $time_st = time();
          $row = mysqli_fetch_assoc($result);
          $sql3 = "UPDATE rooms SET id_player2 = '". $_SESSION['id'] ."', count = '1',
                  timestamp = '". $time_st ."' 
                  WHERE ID =".$row['ID'] .
                  " AND count = 0";
         
         if (mysqli_query($conn, $sql3))
         {
            if (mysqli_affected_rows($conn) == 1){
              $dataArr['code'] = "step";
              echo json_encode($dataArr);
              $_SESSION['id_game'] = $row['ID'];
            } 
         } 
       }
       else
       {
          $time_st = time();
          $sql3 = "INSERT INTO rooms (ID, count, id_player1, id_player2, timestamp)
          VALUES ('".$time_st."','0','".$_SESSION['id'] ."','0','".$time_st."' )";
          if (mysqli_query($conn, $sql3))
          {
            if (mysqli_affected_rows($conn) == 1)
            {
              $dataArr['code'] = "weit";
              echo json_encode($dataArr);
              $_SESSION['id_game'] = $time_st;
              $_SESSION['timestamp'] = $time_st;
            }
              
          }
        }
     }//if (mysqli_query($conn, $sql))
     
    
  }
 mysqli_close($conn);
}



if( isset($_POST['data']) &&  $_POST['data'] == 3 )
{
  
  if ( isset($_POST['coord']) )
  {
    $step = $_POST['coord'];
  }
  
  $time_st = time();
  $sql = "UPDATE rooms SET step = '". $step ."', 
                  timestamp = '". $time_st ."'
                  WHERE ID =".$_SESSION['id_game'];

  if( $conn = connect_db() )
  {
    if (mysqli_query($conn, $sql))
    {
       if (mysqli_affected_rows($conn) == 1)
       {
          $dataArr['code'] = "weit";
          echo json_encode($dataArr);
          $_SESSION['timestamp'] = $time_st;
       } 
    } 
  }
  mysqli_close($conn);
}

if( isset($_POST['data']) &&  $_POST['data'] == 4 )
{
  $sql = "SELECT * FROM rooms WHERE ID=".$_SESSION['id_game'];
  $sql2 = "UPDATE users SET status = '0' WHERE ID=".$_SESSION['id'];
  if($conn = connect_db())
  {
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0)
    {
      $row = mysqli_fetch_assoc($result);
      if($row['count'] == "-1" && strlen($row['step']) < 3)
      {
        if (mysqli_query($conn, $sql2)) {
          unset($_SESSION['id_game']);
          $dataArr['code'] = "gameover";
          echo json_encode($dataArr);
        }
      }
      else{
        if($row['timestamp'] != $_SESSION['timestamp'] && $row['step'] !="")
        {
          $dataArr['code'] = "coord";
          $dataArr['coord'] = $row['step'];
          echo json_encode($dataArr);
        }
        else 
        {
          $dataArr['code'] = "weit";
          echo json_encode($dataArr);
        }
      }
    }
  }
  mysqli_close($conn);
}



if( isset($_POST['data']) &&  $_POST['data'] == 5 )
{
  
  $sql = "SELECT * FROM rooms WHERE ID=".$_SESSION['id_game'];
  $sql2 = "UPDATE rooms SET count = '-1' WHERE ID=".$_SESSION['id_game'];
  $sql3 = "UPDATE users SET status = '0' WHERE ID=".$_SESSION['id'];
  
  if($conn = connect_db())
  {
    
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0)
    {
      if (mysqli_query($conn, $sql2)) {

        if (mysqli_query($conn, $sql3)) {
          $dataArr['code'] = "true";
          echo json_encode($dataArr);
        }
        unset($_SESSION['id_game']);
      } else {
        //echo "Error updating record: " . mysqli_error($conn);
      }
    }
  }
  mysqli_close($conn);
}

if( isset($_POST['data']) &&  $_POST['data'] == 6 )
{
  
  if ( isset($_POST['coord']) )
  {
    $step = $_POST['coord'];
  }
  $time_st = time();
  
  
  //Udalit objasytelno!!!!!!!!!!!!!!!!!!
  $session_id_game = 1515686822;
  $session_id = 15;  
  
  //≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠≠
  
  
  
  $sql = "SELECT * FROM rooms WHERE ID=".$_SESSION['id_game'];
  //$sql = "SELECT * FROM rooms WHERE ID=".$session_id_game;
  
  $sql2 = "UPDATE rooms SET step = '". $step ."', 
                  timestamp = '". $time_st ."', 
                  count = '-1' 
                  WHERE ID=".$_SESSION['id_game'];
  
  /*$sql2 = "UPDATE rooms SET step = '". $step ."', 
                  timestamp = '". $time_st ."', 
                  count = '-1' 
                  WHERE ID=".$session_id_game;*/
  
  
  if($conn = connect_db())
  {
    
    $result = mysqli_query($conn, $sql);
    if (mysqli_num_rows($result) > 0)
    {
      if (mysqli_query($conn, $sql2)) {
        
        $sql3 = "SELECT * FROM users WHERE ID=".$_SESSION['id'];
        //$sql3 = "SELECT * FROM users WHERE ID=".$session_id;
        $result2 = mysqli_query($conn, $sql3);
        if (mysqli_num_rows($result2) > 0)
        {
          $row2 = mysqli_fetch_assoc($result2);
          $score = $row2['score'] + 1;
          $sql4 = "UPDATE users SET status = '0', score = '". $score ."'  WHERE ID=".$_SESSION['id'];
          //$sql4 = "UPDATE users SET status = '0', score = '". $score ."'  WHERE ID=".$session_id;
          if (mysqli_query($conn, $sql4))
          {
            unset($_SESSION['id_game']);
            $dataArr['code'] = "stop";
            $dataArr['coord'] = $step;
            echo json_encode($dataArr);
          }
          else {
             $dataArr['code'] = "false";
             echo json_encode($dataArr);
          }
        }
       }
     }
   }
  mysqli_close($conn);
}






/*
  s - SELECT
  ui - UPDATE/INSERT
  i - INSERT
*/
//=======================================================================
/*function query($sql, $query_type)
{
  $result_query = false;
  if($conn = connect_db())
  {
    $result = mysqli_query($conn, $sql);
    switch ($query_type) {
    case "s":
        if (mysqli_num_rows($result) > 0)
        {
          $row = mysqli_fetch_assoc($result);
          $result_query = $row;
        }
        break;
    case "ui":
        if ($result > 0)
        {
          $result_query = mysqli_affected_rows($conn);
        }
        break;
    }
  }
  mysqli_close($conn);
  return $result_query;
}

//#########################################################
if(isset($_POST['data']) &&  $_POST['data'] == 1)
{
  
  $sql = "UPDATE users SET status = '1' WHERE ID=".$_SESSION['id'];
  $sql2 = "SELECT * FROM rooms WHERE count='0'";
  $sql3 = "";
  
  if (query($sql,"ui"))
  {
    $row = query($sql2,"s");
     if ($row != 0)
     {
       $flag = true;
       $time_st = time();
       
       
       $sql3 = "UPDATE rooms SET id_player2 = '". $_SESSION['id'] ."', count = '1',
                  timestamp = '". $time_st ."' 
                  WHERE ID =".$row['ID'] .
                  " AND count = 0";
       if (query($sql3,"ui"))
       {
          $dataArr['code'] = "step";
          echo json_encode($dataArr);
          $_SESSION['id_game'] = $row['ID'];
       } 
     }
     else
     {
       $time_st = time();
       $sql3 = "INSERT INTO rooms (ID, count, id_player1, id_player2, timestamp)
       VALUES ('".$time_st."','0','".$_SESSION['id'] ."','0','".$time_st."' )";
       if (query($sql3,"ui"))
       {
         $dataArr['code'] = "weit";
         echo json_encode($dataArr);
         $_SESSION['id_game'] = $time_st;
         $_SESSION['timestamp'] = $time_st;
       } 
     }
  }  
}
*/


?>