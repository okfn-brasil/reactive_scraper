var Scraper = require('../models/scraper');

exports.enableIO = function(io){
  var scraper_io = io
  .on('connection', function (socket) {
    socket.on('update_code', function (data) {
      Scraper.update({_id: data.id}, {code: new String(data.code)}, {}, function (err, num){
        socket.emit("updated_code");
      });
    });
  });
}

exports.new = function(req, res){
  res.render('scraper/new', { title: 'Reactive Scraper' })
};


exports.create = function(req, res){
  scraper = new Scraper({url: req.body.url, code: ""})
  scraper.save(function(e){
    if(e == null){
      res.redirect("/scraper/"+scraper._id, 301);
    }else{
      res.render('scraper/new', { title: 'Reactive Scraper' })
    }
  })
};

exports.show = function(req, res){
  var id =  req.params.id;

  Scraper.findById(id, function (err, scraper){
    res.render('scraper/show', { title: 'Scraper ' + scraper._id, scraper: scraper, target: "" })
  });
}