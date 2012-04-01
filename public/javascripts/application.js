document.addEventListener("DOMContentLoaded", function(){
  var code_textarea = $("#code");
  var code_editor = CodeMirror.fromTextArea(code_textarea[0], {
    mode: "javascript",
    theme:"monokai",
    value: code_textarea.val(),
    lineNumbers: true,
    gutter: true,
    matchBrackets: true,
    indentWithTabs:true,
    indentUnit:4,
    tabSize:4,
    fixedGutter:true,
  });


  var socket = io.connect(window.location.hostname);
  socket.on("updated_code", function(){
    console.log("socket callback", "updated_code")
  });

  $(".CodeMirror textarea").keyup(function(){
    var code = $(this).val();
    var id = $(this).parents("div.scraper").attr("id")

    socket.emit('update_code', { code: code, id: id  });
  });
}, false);
