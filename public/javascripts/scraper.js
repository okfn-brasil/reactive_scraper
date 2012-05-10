document.addEventListener("DOMContentLoaded", function(){
  document.save = function(primary_key_or_data, data) {
    var scraper_id = window.parent.window.id
      , reactive_scraper = window.parent.window.reactive_scraper;

    var primary_key = (data == null) ? null : primary_key_or_data
    var data = (data == null) ? primary_key_or_data : data

    reactive_scraper.add_result(data, scraper_id);
  }

  window.console = {
    log: function(data){
      window.parent.console.log(data);
    }
  };
});