var models = exports;

models.connection = null;

models.configure = function(config){
  this.connection = config.connection;
  this.scraper = require("./scraper").init(this.connection);
  this.result = require("./result").init(this.connection);
}