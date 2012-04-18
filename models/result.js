exports.init = function(connection){
  var Schema = connection.Schema;

  var ResultSchema = new Schema({
      scraper_id        : { type: String, index: { unique: true }}
    , data              : Array
  });

  var Result = module.exports = connection.model('Result', ResultSchema);
  return Result
}
