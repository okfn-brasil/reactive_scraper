/**
 * Module dependencies.
 */

var express = require('express')
  , app = module.exports = express.createServer()
  , io = require('socket.io').listen(app)
  , scraperController = require('./controllers/scraper_controller');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser());
  app.use(express.session({ secret: 'x1236casgusadd12' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

io.configure(function () {
  io.set("transports", ["xhr-polling"]);
  io.set("polling duration", 10);
});

scraperController.enableIO(io);

// Routes

app.get('/', scraper_controller.new);

  // Scraper Resources
  app.post('/scraper', scraperController.create);
  app.get('/scraper/:id', scraperController.show);


var port = process.env.PORT || 3000;
app.listen(port);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);