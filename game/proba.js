$(document).ready(function() {

  var obj = {
    data: 0,
    coord: ""
  }
  
  
  $("#game-field").append("<table></table>");

  for (var i = 1; i < 11; i++) {
    $("#game-field table").append("<tr></tr>");
  }
  var row = $("#game-field table tr");
  row.each(function(index) {
    for (var j = 0; j < 10; j++) {
      if (index === 0) {
        $(this).append("<td id='" + j + "'></td>");
      } else {
        $(this).append("<td id='" + (+index) + (+j) + "'></td>");
      }
    }
  });

  

  $("#game-field table td").on("click", step);
  //$("#game-field table #0").off("click",  step);
  
  $("#game-field table td").css("cursor", "pointer");

  //--------------------------proverka xoda----------------------------
  var COUNT_X = 5;
  var arr_coord = []; 
  // arr_coord - massiv dlja byigrysh kombinazii
  // COUNT_X - kolvo podrjad stojachix X, nushnyx dlja vyigrasha
  //id - id jacheiki s xodom
  //size - rasmernost setki (v dannom sluchae 10)
  //r_x - id poslednej jacheiki po gorisontali v stroke
  //l_x - id pervoj jacheiki po gorisontale v stroke
  //d_x - rasstojanie mechdy krajnej levoi jacheikoi i tekuwei
  function check_step(id, size) {
    var sum = 1;
    var l_x = 0;
    var r_x = 0;
    var d_x = 0;
    var dw_y = 0;
    var id_n = Number(id);
    

    if (id > size) {
      l_x = parseInt(id_n / size) * size;
      r_x = l_x + size - 1;
      d_x = id_n % size;
    } else {
      l_x = 0;
      r_x = 9;
      d_x = id_n;
    }

    dw_y = size * (size - 1) + d_x;

    // -------------po gorisontale---------------------------------
    for (var i = id_n + 1; i <= r_x; i++) {
      if ($("#" + i).html() != "X" || sum == COUNT_X) break;
      arr_coord.push(i);
      sum++;
    }
    if (sum < COUNT_X) {
      for (i = id_n - 1; i >= l_x; i--) {
        if ($("#" + i).html() != "X" || sum == COUNT_X) break;
        arr_coord.push(i);
        sum++;
      }
    }
    // -------------po vertikale-----------------------------------

    //console.log("dw_y: " + dw_y + "d_x: " + d_x);
    if (sum < COUNT_X) {
      sum = 1;
      arr_coord.length = 0;
      for (i = id_n + size; i <= dw_y; i += size) {
        if ($("#" + i).html() != "X" || sum == COUNT_X) break;
        arr_coord.push(i);
        sum++;
      }
    }
    if (sum < COUNT_X) {
      for (i = id_n - size; i >= d_x; i -= size) {
        if ($("#" + i).html() != "X" || sum == COUNT_X) break;
        arr_coord.push(i);
        sum++;
      }
    }
    // -------------po diagonale \------------------------------------
    if (sum < COUNT_X) {
      sum = 1;
      arr_coord.length = 0;
      for (i = id_n - size - 1; i >= 0; i = i - size - 1) {
        if ($("#" + i).html() != "X" || sum == COUNT_X) break;
        arr_coord.push(i);
        sum++;
      }
    }

    if (sum < COUNT_X) {
      for (i = id_n + size + 1; i <= 99; i = i + size + 1) {
        if ($("#" + i).html() != "X" || sum == COUNT_X) break;
        arr_coord.push(i);
        sum++;
      }
    }
    
    // -------------po diagonale /------------------------------------
    if (sum < COUNT_X)
    {
      sum = 1;
      arr_coord.length = 0;
      for (i = id_n - size + 1; i >= 0; i = i - size + 1)
      {
         if ($("#" + i).html() != "X" || sum == COUNT_X) break;
         arr_coord.push(i);
         sum++;   
      }
    }
    if (sum < COUNT_X)
    {
      for (i = id_n + size - 1; i >= 0; i = i + size - 1)
      {
         if ($("#" + i).html() != "X" || sum == COUNT_X) break;
         arr_coord.push(i);
         sum++;   
      }
    }
    //console.log(sum);
    if (sum == COUNT_X) {
      arr_coord.push(id_n);
      for (i = 0; i < arr_coord.length; i++) 
      {
         $("#" + arr_coord[i]).css("color", "red");
      }
      console.log(arr_coord);
      return true;
    } else {
      arr_coord.length = 0;
      return false;
    }
  }
  
  
  //===============================================
  function step() {
    $(this).html("X");

    if (check_step(this.id, 10)) {
      $(".message").css("display", "block");
      $(".message").html("Congratulations...");
      $("#game-field table td").off("click", step);
      obj.data = 6;
      //obj.coord = 3;
      obj.coord = JSON.stringify(arr_coord);
      send_ajax();
      
    } else {
      //console.log("xx");
    }

  }
  
  
  //-------------------------------send ajax--------------------------------
  
  
  
  /*obj - dannye saprosa
  num - 1 - sapros na nachalo igry ("start")
        //2 - sapros na oshidanie protivnika("check")
        3 - otpravka dannyx xoda
        4 - sapros na polushenie dannyx protivnika
        5 - prosto sakryl browser ili peresagrusil stranizu
        6 - soobshenie o pobede*/
  function send_ajax()
  {
    $.ajax({    
      url: 'basic/basic.php',
      type: 'POST',
      data: obj,
      success: function(data){
        var dataArr = JSON.parse(data);
        if (dataArr.code == "stop")
        {
          if(dataArr.coord.length > 2)
          {
            //clearInterval(timerId);
            //flagTimer = true;
            //$("#start").show();
            
            //var str = dataArr.coord.substring(3);
            //$("#game-field table #" + str).html("0");
            
            dataArr.coord = JSON.parse(dataArr.coord);
            
            for (var i = 0; i < dataArr.coord.length; i++ )
            {
               /*if($("#" + dataArr.coord[i]).html() === "")
               {
                  $("#" + dataArr.coord[i]).html("0");
               }*/
               $("#" + dataArr.coord[dataArr.coord.length-1]).html("0");
               $("#" + dataArr.coord[i]).css("color", "red");
                
            }
            
            $("#game-field table td").css( "cursor", "auto");
            $("#game-field table td").off( "click", step);
            $(".message").html("Vy proigrali. Mojete nachat igry sanovo...");
          }
        }
        console.log(data);
      }
    });
    
  }
  
  
  
})