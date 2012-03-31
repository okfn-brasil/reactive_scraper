document.addEventListener("DOMContentLoaded", function(){
  var code_textarea = document.getElementById("code");
  var code_editor = CodeMirror.fromTextArea(code_textarea, {mode: "javascript", theme:"monokai"});
}, false);
