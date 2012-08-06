$(document).on('ready', function(){
  // Código aplicación
  $('#right-column').hide(); // ocultar columna derecha

  $('li.hero-name a').on('click',function(){ // al hacer click en nombre de heroe
      var name = $(this).text(); // recoger nombre heroe
    
      $('#right-column h2').text(name); // colocar nombre heroe como título en columna derecha

      $('#facts li').remove();

      $.getJSON('/hero/' + name, function(data){
          for(var i=0; i < data.length; i++){
            $('<li>').appendTo('#facts').text(data[i]);
          }
      });

      $('#right-column').show();

      return false;
  });


  $('#add-new-fact').on('click', function(){
    var name = $('#right-column h2').text();
    var fact = $('#new-fact').val();

    $.ajax({
      type: "POST",
      url: "/hero/add-fact",
      data: JSON.stringify({name:name, fact:fact}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data){
        $('<li>').appendTo('#facts').text(fact);
        $('#new-fact').val('');
      },

      error: function(err){
        var msg = 'Status: ' + err.status + ':' + err.responseText;
        alert(msg);
        console.log(msg);
      }

    });
    return false;
  });


  $('#add-new-hero').on('click', function(){
    var name = $('#new-hero').val();

    $.ajax({
      type: "POST",
      url: "/hero/add-hero",
      data: JSON.stringify({name:name}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function(data){
        $("#heroes").append('<li class="hero-name"><a href="#">'+data.name+'</a></li>');
        $("#new-hero").val("");
      },

      error: function(err){
        var msg = 'Status: ' + err.status + ':' + err.responseText;
        alert(msg);
        console.log(msg);
      }

    });
    return false;
  });
});