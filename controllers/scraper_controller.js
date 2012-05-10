var scraperController = exports;

var Scraper = null;

var DATA = [];
var RUNNING = false;

scraperController.enableIO = function(io){
  scraperController.scraper_io = io
  .on('connection', function (socket) {
    socket.on("save_code", function(data){
      Scraper.update({_id: data.id}, {code: new String(data.code)}, function(){});
    });
  });
}

scraperController.model =  function(model){
  Scraper = model
}

scraperController.new = function(req, res){
  res.render('scraper/new', { title: 'Reactive Scraper' })
};

scraperController.create = function(req, res){
  var open = require("open-uri")
  , url_target = req.body.url;

  scraper = new Scraper({url: url_target, code: ""})
  scraper.save(function(e){
    if(e == null){
      var open = require("open-uri")
      Scraper.findById(scraper._id, function(err, scraper){
        open(scraper.url, function(x, html){
          Scraper.update({_id: scraper._id}, {html: html}, function(){
            res.redirect("/scraper/"+scraper._id, 301);
          });
        });
      });
    }else{
      res.render('scraper/new', { title: 'Reactive Scraper' })
    }
  })
};

scraperController.show = function(req, res){
  var id =  req.params.id;
  Scraper.findById(id, function (err, scraper){
    res.render('scraper/show', { title: 'Scraper ' + scraper._id, scraper: scraper })
  });
}