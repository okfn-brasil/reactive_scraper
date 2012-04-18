document.addEventListener("DOMContentLoaded", function(){
  document.save = function(primary_key_or_data, data) {
    var socket     = window.parent.window.socket
      , scraper_id = window.parent.window.id; 
   
    var primary_key = (data == null) ? null : primary_key_or_data
    var data = (data == null) ? primary_key_or_data : data
    socket.emit("save_result", { data: data, scraper_id: scraper_id, primary_key: primary_key}); 
  }
});