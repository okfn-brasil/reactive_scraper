var scraperController = exports;

var Scraper = null;

scraperController.enableIO = function(io){
  var scraper_io = io
  .on('connection', function (socket) {
    socket.on('update_code', function (data) {
      Scraper.update({_id: data.id}, {code: new String(data.code)}, {}, function (err, num){
        socket.emit("updated_code");
      });
    });
  });
}

scraperController.model =  function(model){
  Scraper = model;
}

scraperController.new = function(req, res){
  res.render('scraper/new', { title: 'Reactive Scraper' })
};


scraperController.create = function(req, res){
  scraper = new Scraper({url: req.body.url, code: ""})
  scraper.save(function(e){
    if(e == null){
      res.redirect("/scraper/"+scraper._id, 301);
    }else{
      res.render('scraper/new', { title: 'Reactive Scraper' })
    }
  })
};

scraperController.show = function(req, res){
  var id =  req.params.id;

  Scraper.findById(id, function (err, scraper){
    res.render('scraper/show', { title: 'Scraper ' + scraper._id, scraper: scraper, target: "" })
  });
}