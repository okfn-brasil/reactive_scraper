var reactiveScraper = {
  result: {
    update: function(data){
      var table = reactiveScraper.helpers.objToTable(data)
      $("#result").addClass("opened").find("#data").html(table);
    },
    reset: function(id){
      localStorage.setItem('result'+id, JSON.stringify([]));
    },
    add: function(data, scraperId, primaryKey){
      var result = JSON.parse(localStorage.getItem('result'+id));
      result.push(data);
      localStorage.setItem('result'+id, JSON.stringify(result));
      this.update(result);
    }
  },
  code: {
    save: function(code, id){
      socket.emit('save_code', { code: code, id: id  });
      localStorage.setItem('code'+id, code);
    },
    run: function(theCode){
      reactiveScraper.errors.verify(theCode);

      if(reactiveScraper.errors.self.length > 0){ return reactiveScraper.errors.show(); }

      reactiveScraper.iframe.update(theCode, function(){
        reactiveScraper.result.reset(window.id);
        var code = reactiveScraper.iframe.self();
        code.run();
        $(".loading").hide();
      });
    },
  },
  errors: {
    self: [],
    verify: function(code){
      $("ul.errors").html(" ");
      $(".activeline").removeClass("activeline");

      var jslintResult = JSLINT(code, this.config);
      this.self = JSLINT.errors
    },
    show: function(){
      for(var _i in this.self){
        var error = this.self[_i];
        if(error != null){
          window.codeEditor.setLineClass(error.line, null, "activeline");
          $("<li></li>").html(error.reason).appendTo("ul.errors");
        }
      }
    },
    config: {predef: ["$", "console"], sloppy: true, white: true, browser: true}
  },
  iframe: {
    html: "",
    self: function(){
      var frame = document.getElementById('target');
      return frame.contentDocument || frame.contentWindow.document;
    },
    update: function(code, callback) {
      var preview =  this.self()
        , host = window.location.origin;
      preview.open();
      preview.write(this.html+'<script src="'+ host +'/javascripts/jquery.js"></script><script src="'+ host +'/socket.io/socket.io.js"></script><script src="'+ host +'/javascripts/scraper.js"></script><script id="scraper_code">document.run = function(){'+ code +'}</script>');
      preview.close();
      setTimeout(callback, 1000);
    }
  },
  helpers: {
    objToTable: function(data){
     var table = "<table>";
      for (var _i in data) {
        var row = data[_i];
        table += "<tr>";
        if(typeof(row) == "object"){
          for(var _j in row){
            column = row[_j];
            if (typeof(column) == "object"){
              table += "<td>" + this.objToTable([column]) + "</td>";
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
  }
};

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
      $(".loading").show();
      var theCode = editor.getValue();
      reactiveScraper.code.save(theCode, id);
      reactiveScraper.code.run(theCode);
    }
  });

  $(".close").live("click", function(e){
    $("#result").removeClass("opened");
    e.preventDefault();
  });

  var encoded = $("iframe").html();
  reactiveScraper.iframe.html =  $('<textarea/>').html(encoded).val();
  reactiveScraper.iframe.update("", function(code){
    console.log("Loaded");
  });

}, false);