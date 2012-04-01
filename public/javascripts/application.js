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
    onChange: function() {
      clearTimeout(delay);
      //delay = setTimeout(updateResultIframe, 300);
    }
  });

    function updateResultIframe(html) {
      var previewFrame = document.getElementById('result');
      var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
      preview.open();
      preview.write(html);
      preview.close();
    }

    //var delay = setTimeout(updateResultIframe, 300);


  var socket = io.connect(window.location.hostname);
  socket.on("updated_code", function(){
    console.log("socket callback", "updated_code")
  });

  socket.on("set_target_html", function(html){
    updateResultIframe(html);
  });

  $(".CodeMirror textarea").keyup(function(){
    var code = $(this).val();
    var id = $(this).parents("div.scraper").attr("id")

    socket.emit('update_code', { code: code, id: id  });
  });

  socket.emit('get_target_html', $("div.scraper").attr("id"));
}, false);
