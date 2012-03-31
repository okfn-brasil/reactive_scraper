document.addEventListener("DOMContentLoaded", function(){
  var code_textarea = $("#code");
  var code_editor = CodeMirror.fromTextArea(code_textarea[0], {mode: "javascript", theme:"monokai", value: code_textarea.val()});


  var socket = io.connect('http://localhost:4000');
   socket.on("updated_code", function(){
      console.log("Opa")
   });

  $(".CodeMirror textarea").keyup(function(){
    var code = $(this).val();
    var id = $(this).parents("div.scraper").attr("id")

    socket.emit('update_code', { code: code, id: id  });
  });
}, false);
