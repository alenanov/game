$(document).ready(function() {
  
 

  //----------------------- obrabotka oschibok --------------------------
  function validateEmail(email) {
    // Now validate the email format using Regex
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i;
    return re.test(email);
  }

  function isEmpty(field) {
    return $(field).val() !== '' ? false : true;
  }

  function isEqual(field1, field2) {
    return $(field1).val() == $(field2).val() ? true : false;
  }

  //otpravka ajax-saprosa na server 
  function checkData() {

    var dataPr = {
      login: $('#reg input[name=login]').val(),
      email: $('#reg input[name=email]').val(),
    };


    var flag = 0;
    dataPr = $.param(dataPr);

    $.ajax({    
      url: '../lib/validate.php',
      type: 'POST',
           //data: $('#reg').serialize(),
      data: dataPr,
      //dataType: 'json',
       success: function(data) { 
        //console.log(data);
        data = JSON.parse(data);
        console.log(data);
        if (data.login == 1 && data.email == 1) {
          flag = 1;
        } else if (data.email === 1 && data.login === 0) {

          $("#reg input[name='login']").prev().text("Debil, takoj login ushe est!").show();
          $("#reg input[name='login']").removeClass("is-valid");
          $("#reg input[name='login']").addClass("is-invalid");
          flag = 2;
        } else if (data.login === 1 && data.email === 0) {
          $("#reg input[name='email']").prev().text("Debil, takoj email ushe est!").show();
          $("#reg input[name='email']").removeClass("is-valid");
          $("#reg input[name='email']").addClass("is-invalid");
          flag = 3;
        } else if (data.login === 0 && data.email === 0) {
          $("#reg input[name='login']").prev().text("Debil, takoj login ushe est!").show();
          $("#reg input[name='login']").removeClass("is-valid");
          $("#reg input[name='login']").addClass("is-invalid");
          $("#reg input[name='email']").prev().text("Debil, takoj email ushe est!").show();
          $("#reg input[name='email']").removeClass("is-valid");
          $("#reg input[name='email']").addClass("is-invalid");
        }
      },
      async: false //?????????
    });
    return flag;
  }

  function addBorder() {
    if ($(this).val() !== '' && !$(this).hasClass("is-valid")) {
      $(this).addClass("is-valid");
      $(this).removeClass("is-invalid");
      $(this).prev().hide();
    }
    if ($(this).val() === '' && !$(this).hasClass("is-invalid")) {
      $(this).removeClass("is-valid");
      $(this).addClass("is-invalid");
      $(this).prev().show();
    }
  }

  function isValid() {
    var fields = $("#reg input");
    var count_error = 0;

    fields.addClass("is-valid");
    fields.on("keyup", addBorder);

    for (var i = 0; i < fields.length; i++) {
      if (isEmpty(fields[i])) {
        count_error++;
        $(fields[i]).prev().show();
        $(fields[i]).removeClass("is-valid");
        $(fields[i]).addClass("is-invalid");
      } else {
        if ($(fields[i]).prop("name") == "email") {
          if (!validateEmail($(fields[1]).val())) {
            count_error++;
            $("#reg input[type='email']").prev().text("Debil, vvedi normalny e-mail!").show();
            $(fields[i]).removeClass("is-valid");
            $(fields[i]).addClass("is-invalid");
          }
        } else if ($(fields[i]).prop("name") == "password" && !isEmpty(fields[3])) {
          if (!isEqual(fields[2], fields[3])) {
            count_error++;
            $("#reg input[name='password']").prev().text("Debil, password rasnyi!").show();
            $(fields[i]).removeClass("is-valid");
            $(fields[i]).addClass("is-invalid");
          }
        }
      }
    }
    if (count_error === 0) {
      if (checkData() == 1) return true;
      else {
        return false;
      }
    }

  }


  $("#reg").submit(function(event) {
    // isValid();
    if (isValid() > 0) {
      return;
    }
    event.preventDefault();

  });

  $("#f-login").submit(function(event) {

    if (!isEmpty("#password") && !isEmpty("#login")) {
      return;
    }
    $("#f-login input").addClass("is-valid");
    $("#f-login input").on("keyup", addBorder);
    if (isEmpty("#password")) {
      $("#f-login #password").prev().show();
      $("#password").removeClass("is-valid");
      $("#password").addClass("is-invalid");
    }
    if (isEmpty("#login")) {
      $("#f-login #login").prev().show();
      $("#login").removeClass("is-valid");
      $("#login").addClass("is-invalid");
    }
    event.preventDefault();

  });


  //----------------------- prorisovka polja --------------------------

  $("#game-field").append("<table></table>");

  for (var i = 1; i < 11; i++) {
    $("#game-field table").append("<tr></tr>");
  }
  var row = $("#game-field table tr");
  row.each(function(index) {
    for (var j = 0; j < 10; j++) {
      if(index === 0)
      {
          $(this).append("<td id='" + j + "'></td>");
      }
      else
      {
         $(this).append("<td id='" + (+index) + (+j) + "'></td>");
      }
    }
  });
  
  
  var obj = {
    data: 0,
    coord: ""
  }
  var arr_cells = [];
  // arr_cells - massiv dlja sanjatyx jacheek, chob ne perepisyvalos snachenie
  
  function draw(coord)
  {
    $("#" + coord).html("0");
    $("#" + coord).css("color", "green");
    arr_cells.push("#" + coord);
  }
  
   var timerId;
   var timerSleep;
   var flagTimer = true;
   
  
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
        if (dataArr.code == "step")
        {
          clearInterval(timerId);
          flagTimer = true;
          //---------- esli net aktivnosti 45s govorim, chto protivnik sasnul
          timerSleep = setTimeout(sleep, 45000); 
          //==============================================  
          $("#game-field table td").on( "click", step);
          $("#game-field table td").css( "cursor", "pointer");
          $(".message").html("Step...");
        }
        if (dataArr.code == "weit")
        {
          obj.data = 4;
          if(flagTimer)
          {
            timerId = setInterval(send_ajax, 5000);
            flagTimer = false;
          }
        }
        if (dataArr.code == "coord")
        {
          clearInterval(timerId);
          flagTimer = true;
          if(dataArr.coord.length > 3) //?======================================
          {
            clearInterval(timerId);
            flagTimer = true;
            $("#start").show();
            dataArr.coord = JSON.parse(dataArr.coord);
            $("#" + dataArr.coord[dataArr.coord.length-1]).html("0");
            for (var j = 0; j < dataArr.coord.length; j++ )
            {
               $("#" + dataArr.coord[j]).css("color", "red");
            }
            $("#game-field table td").css( "cursor", "auto");
            $("#game-field table td").off( "click", step);
            $(".message").html("Vy proigrali. Mojete nachat igry sanovo...");
          }
          else{
            draw(dataArr.coord);
            //---------- esli net aktivnosti 45s govorim, chto protivnik sasnul
            timerSleep = setTimeout(sleep, 45000); 
            //==============================================  
            $("#game-field table td").on( "click", step);
            $("#game-field table td").css( "cursor", "pointer");
            for (var i = 0; i < arr_cells.length; i++)
            {
               $("#game-field table " + arr_cells[i]).off( "click", step);
               $("#game-field table " + arr_cells[i]).css( "cursor", "auto");
            }
            $(".message").html("Step...");
          } 
        }
        if (dataArr.code == "gameover")
        {
          clearInterval(timerId);
          flagTimer = true;
          $("#start").show();
          $("#game-field table td").css( "cursor", "auto");
          $("#game-field table td").off( "click", step);
          $(".message").html("vash protivnik smylsja. Mojete nachat igry sanovo...");
        }
        console.log(data);
      }
    });
  }
    
  $("#start").click(function(){
    
     $("#start").hide();
     
     if( $(".message").css( "display") == "none")
     {
        $(".message").show();
     }
     clear(); // ????????????????
     obj.data = 1;
     send_ajax();
  });
   
  //----------------------- obrabotka clicka --------------------------
  // arr_coord - massiv dlja byigrysh kombinazii
  var arr_coord = [];
  
  function step()
  {
    clearTimeout(timerSleep);
    $(this).html("X");
    arr_cells.push("#" + this.id);
    $("#game-field table td").off( "click", step);
    $("#game-field table td").css( "cursor", "auto");
    
    if(check_step(this.id, 10))
    {
      $(".message").html("Congratulations...");
      obj.data = 6;
      obj.coord = JSON.stringify(arr_coord);
      send_ajax();
    }
    else
    {
      $(".message").html("Weit...");
      obj.data = 3;
      obj.coord = this.id;
      send_ajax();
    }
  }
  
  //--------------------------proverka sleep----------------------------
  function sleep()
  {
     flagTimer = true;
     obj.data = 5;
     send_ajax();
     $("#start").show();
     $("#game-field table td").css( "cursor", "auto");
     $("#game-field table td").off( "click", step);
     $(".message").html("Vy sasnyli. Mojete nachat igry sanovo...");
  }
  
  //--------------------------proverka xoda----------------------------
  var COUNT_X = 5;
   
  
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
      return true;
    } else {
      arr_coord.length = 0;
      return false;
    }
  }
  
  //--------------------clear-----------------------------------
  function clear()
  {
    $("#game-field table td").html("");
    $(".message").html("Weit...");
  }
  //-------------------------------vyxod--------------------------------
 
  
  window.onbeforeunload = function(e) {
     //var dialogText = 'Dialog text here';
     //e.returnValue = dialogText;
     //return dialogText;
    clearInterval(timerId);
    flagTimer = true;
    obj.data = 5;
    send_ajax();
};

});




