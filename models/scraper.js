exports.init = function(connection){
	var Schema = connection.Schema;

	var ScraperSchema = new Schema({
	    url       : String
	  , code      : String
	});

	var Scraper = module.exports = connection.model('Scraper', ScraperSchema);
	return Scraper
}
