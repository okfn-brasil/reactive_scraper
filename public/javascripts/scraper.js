var datahub = {
  defaultConfig: {
    endpoint: "datahub.io"
  },
  config: {},
  save: function(primaryKeyOrData, data) {
    var scraperId = window.parent.window.id
      , reactiveScraper = window.parent.window.reactiveScraper;

    var primaryKey = (data == null) ? null : primaryKeyOrData
    var data = (data == null) ? primaryKeyOrData : data

    reactiveScraper.datahub.updateConfig($.extend(datahub.defaultConfig, datahub.config));

    reactiveScraper.result.add(data, scraperId, primaryKey);
  }
};

// compability
document.save = datahub.save
