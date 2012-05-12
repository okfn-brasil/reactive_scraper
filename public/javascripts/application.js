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
  runCode: function(theCode){
    iframeTarget.update(theCode, function(){
      reactiveScraper.resetResult(window.id);
      var code = iframeTarget.get();
      code.run();
      $(".loading").hide();
      socket.emit("sync_result_database", window.id);
    });
  }
};

var reactiveScraper = {
  updateResult: function(data){
    var table = this.createTable(data, false)
    $("#result").addClass("opened").find("#data").html(table);
  },
  saveCode: function(code, id){
    localStorage.setItem('code'+id, code);
  },
  resetResult: function(id){
    localStorage.setItem('result'+id, JSON.stringify([]));
  },
  addResult: function(data, id){
    var result = JSON.parse(localStorage.getItem('result'+id));
    result.push(data);
    localStorage.setItem('result'+id, JSON.stringify(result));
    this.updateResult(result);
  },
  createTable: function(data){
   var table = "<table>";
    for (var _i in data) {
      var row = data[_i];
      table += "<tr>";
      if(typeof(row) == "object"){
        for(var _j in row){
          column = row[_j];
          if (typeof(column) == "object"){
            table += "<td>" + this.createTable([column]) + "</td>";
          }else{
            table += "<td>" + column + "</td>";
          }
        }
      }
      table += "</tr>";
    }
    table += "</table>";
    return table;
  }
};

var showErrors = function(errors) {
  for(var _i in errors){
    var error = errors[_i];
    if(error != null){
      window.codeEditor.setLineClass(error.line, null, "activeline");
      $("<li></li>").html(error.reason).appendTo("ul.errors");
    }
  }
}

document.addEventListener("DOMContentLoaded", function(){
  window.socket = io.connect(window.location.hostname);
  window.id = $("div.scraper").attr("id");

  var codeTextarea = $("#code")
  window.codeEditor = CodeMirror.fromTextArea(codeTextarea[0], {
    mode:           "javascript",
    theme:          "monokai",
    value:          codeTextarea.val(),
    lineNumbers:    true,
    gutter:         true,
    matchBrackets:  true,
    indentWithTabs: true,
    indentUnit:     4,
    tabSize:        2,
    fixedGutter:    true,
    onChange:       function(editor) {
      var theCode = editor.getValue();
      var jslintResult = JSLINT(theCode, {predef: ["$", "console"], sloppy: true, white: true, browser: true});
      $("ul.errors").html(" ");
      $(".activeline").removeClass("activeline");

      socket.emit('save_code', { code: theCode, id: id  });
      reactiveScraper.saveCode(theCode, id);

      if(!jslintResult) return showErrors(JSLINT.errors);

      iframeTarget.runCode(theCode);
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