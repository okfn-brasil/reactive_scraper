document.addEventListener("DOMContentLoaded", function(){
  var code_textarea = document.getElementById("code");
  var CodeMirror = CodeMirror.fromTextArea(code_textarea, {mode: "javascript", theme:"monokai"});
}, false);
