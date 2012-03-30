
/*
 * GET home page.
 */

 exports.index = function(req, res){
 	res.render('index', { title: 'Express' })
 };


exports.scraper = function(req, res){
	var url = req.body.url
	req.session.scraper = {url: url, url_name: url.replace("http://","")}
	res.render('scraper', { title: 'Scraper: ' + req.session.scraper.url_name})
};