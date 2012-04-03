var iframeTarget = {
  get: function(){
    var frame = document.getElementById('target');
    return frame.contentDocument || frame.contentWindow.document;
  },
  update: function(html, code, callback) {
    var preview =  this.get();
    preview.open();
    preview.write(html+'<script src="'+ window.location.origin +'/javascripts/jquery.js"></script><script id="scraper_code">document.run = function(){'+ code +'}</script>');
    preview.close();
    callback(preview);
  }
}

document.addEventListener("DOMContentLoaded", function(){
  var socket = io.connect(window.location.hostname);
  var id = $("div.scraper").attr("id")
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
      socket.emit('save_code', { code: editor.getValue(), id: id  });
    }
  });

  socket.on("run", function(scraper){
    iframeTarget.update(scraper.html, scraper.code, function(code){
      code.run();
    });

  });

  socket.on("data_to_iframe", function(html){
    iframeTarget.update(html, "", function(code){
      console.log("Loaded");
    });
  });


  $("#run_code").live("click", function(e){
    socket.emit('get_to_run', id);
    e.eventPreventDefault();
  });

  socket.emit('popule_iframe', id);

}, false);