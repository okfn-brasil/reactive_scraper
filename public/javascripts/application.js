document.addEventListener("DOMContentLoaded", function(){
  var socket = io.connect(window.location.hostname);

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
    tabSize:2,
    fixedGutter:true,
    onChange: function(editor) {
      var id = $("div.scraper").attr("id")

      socket.emit('update_code', { code: editor.getValue(), id: id  });
    }
  });

  function updateResultIframe(html, code) {
    var previewFrame = document.getElementById('result');
    var preview =  previewFrame.contentDocument ||  previewFrame.contentWindow.document;
    preview.open();
    preview.write(html+'<script src="'+window.location.origin+'/javascripts/jquery.js"></script><script id="scraper_code">document.run = function(){'+ code +'}</script>');
    preview.close();
    return preview;
  }

  socket.on("updated_code", function(scraper){
    updateResultIframe(scraper.html, scraper.code).run();
  });

  socket.on("set_target_html", function(html){
    updateResultIframe(html, "console.log('Loaded')").run();
  });


  socket.emit('get_target_html', $("div.scraper").attr("id"));

}, false);