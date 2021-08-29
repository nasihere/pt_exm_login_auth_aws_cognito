
module.exports = function(app){
  app.use('/api', require('./src/controller/login'));

}