document.addEventListener("DOMContentLoaded", function(){
  document.save = function(primaryKeyOrData, data) {
    var scraperId = window.parent.window.id
      , reactiveScraper = window.parent.window.reactiveScraper;

    var primaryKey = (data == null) ? null : primaryKeyOrData
    var data = (data == null) ? primaryKeyOrData : data

    reactiveScraper.result.add(data, scraperId, primaryKey);
  }
});