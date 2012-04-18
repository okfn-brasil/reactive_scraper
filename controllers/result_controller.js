var resultController = exports;

var Result = null;

resultController.model =  function(model, others){
  Result = model;
}
resultController.show = function(req, res){
  var id =  req.params.id;
  var format = req.params.format
  console.log(id)
  console.log(format)
  Result.findOne({scraper_id: id}, function (err, result){
    switch(format){
      case "json":
        res.json(result.data)
        break;
      case "html":
        res.render('result/show', { title: 'Result ' + result._id, result: result });
        break;
    }
  });
}