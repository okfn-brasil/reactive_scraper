var iframeTarget = {
  html: "",
  get: function(){
    var frame = document.getElementById('target');
    return frame.contentDocument || frame.contentWindow.document;
  },
  update: function(code, callback) {
    var preview =  this.get()
      , host = window.location.origin;
    preview.open();
    preview.write(this.html+'<script src="'+ host +'/javascripts/jquery.js"></script><script src="'+ host +'/socket.io/socket.io.js"></script><script src="'+ host +'/javascripts/scraper.js"></script><script id="scraper_code">document.run = function(){'+ code +'}</script>');
    preview.close();

    setTimeout(callback, 1000);
  },
  run_code: function(the_code){
    iframeTarget.update(the_code, function(){
      reactive_scraper.reset_result(window.id);
      var code = iframeTarget.get();
      code.run();
      $(".loading").hide();
      socket.emit("sync_result_database", window.id);
    });
  }
};

var reactive_scraper = {
  update_result: function(data){
    var table = "<table>";
    for (var _i in data) {
      var row = data[_i];
      table += "<tr>";
      if(typeof(row) == "object"){
        for(var _j in row){
          column = row[_j];
          table += "<td>" + column + "</td>";
        }
      }
      table += "</tr>";
    }
    table += "</table>";
    $("#result").addClass("opened").find("#data").html(table);
  },
  save_code: function(code, id){
    localStorage.setItem('code'+id, code);
  },
  reset_result: function(id){
    localStorage.setItem('result'+id, JSON.stringify([]));
  },
  add_result: function(data, id){
    var result = JSON.parse(localStorage.getItem('result'+id));
    result.push(data);
    localStorage.setItem('result'+id, JSON.stringify(result));
    this.update_result(result);
  }
};

var showErrors = function(errors) {
  for(var _i in errors){
    var error = errors[_i];
    if(error != null){
      window.code_editor.setLineClass(error.line, null, "activeline");
      $("<li></li>").html(error.reason).appendTo("ul.errors");
    }
  }
}

document.addEventListener("DOMContentLoaded", function(){
  window.socket = io.connect(window.location.hostname);
  window.id = $("div.scraper").attr("id");

  var code_textarea = $("#code")
  window.code_editor = CodeMirror.fromTextArea(code_textarea[0], {
    mode:           "javascript",
    theme:          "monokai",
    value:          code_textarea.val(),
    lineNumbers:    true,
    gutter:         true,
    matchBrackets:  true,
    indentWithTabs: true,
    indentUnit:     4,
    tabSize:        2,
    fixedGutter:    true,
    onChange:       function(editor) {
      var theCode = editor.getValue();
      var jslintResult = JSLINT(theCode, {predef: ["$"], sloppy: true, white: true, browser: true});
      $("ul.errors").html(" ");
      $(".activeline").removeClass("activeline");

      socket.emit('save_code', { code: theCode, id: id  });
      reactive_scraper.save_code(theCode, id);

      if(!jslintResult) return showErrors(JSLINT.errors);

      iframeTarget.run_code(theCode);
      $(".loading").show();
    }
  });

  $(".close").live("click", function(e){
    $("#result").removeClass("opened");
    e.preventDefault();
  });

  var encoded = $("iframe").html();
  iframeTarget.html =  $('<textarea/>').html(encoded).val();
  iframeTarget.update("", function(code){
    console.log("Loaded");
  });

}, false);