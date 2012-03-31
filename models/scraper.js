var mongoose = require('mongoose')
  , mongo_url = process.env.MONGOLAB_URI || "mongodb://localhost/reactive_scraper";

mongoose.connect(mongo_url);


var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;


var ScraperSchema = new Schema({
    url       : String
  , code      : String
});

var Scraper = module.exports = mongoose.model('Scraper', ScraperSchema);