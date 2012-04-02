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
    var preview =  getIframeDocument();
    preview.open();
    preview.write(html+'<script src="'+ window.location.origin +'/javascripts/jquery.js"></script><script id="scraper_code">document.run = function(){'+ code +'}</script>');
    preview.close();
  }

  function getIframeDocument(){
    var frame = document.getElementById('result');
    return frame.contentDocument || frame.contentWindow.document;
  }

  socket.on("updated_code", function(scraper){
    updateResultIframe(scraper.html, scraper.code);
  });

  socket.on("set_target_html", function(html){
    updateResultIframe(html, "console.log('Loaded')");
  });


  socket.emit('get_target_html', $("div.scraper").attr("id"));

  $("#run_code").live("click", function(){
    var code = getIframeDocument();
    code.run();
  });
}, false);