var scraperController = exports;

var Scraper = null;

var DATA = [];
scraperController.enableIO = function(io){
  scraperController.scraper_io = io
  .on('connection', function (socket) {
    socket.on("save_code", function(data){
      Scraper.update({_id: data.id}, {code: new String(data.code)}, function(){});
    });
    socket.on("get_to_run", function(id){
      Scraper.findById(id, function(err, scraper){
        DATA = [];
        socket.emit("run", scraper);
      });
    });
    socket.on('popule_iframe', function(id){
      Scraper.findById(id, function(err, scraper){
        socket.emit("data_to_iframe", scraper.html)
      });
    });

    socket.on("save_result", function(to_save){
      DATA.push(to_save.data);
    });

    socket.on("sync_result_database", function(scraper_id){
      var createResult = function() {
        result = new Result({scraper_id: scraper_id, data: []});
        result.save(updateResult);
      };

      var updateResult = function(err, result){
        if(result == null) return createResult();
        Result.update({_id: result.id}, {data: DATA}, function(){});
      };

      Result.findOne({scraper_id: scraper_id}, updateResult);
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