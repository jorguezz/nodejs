
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose');

var app = module.exports = express.createServer();

// Database
mongoose.connect('mongodb://localhost/mydb');

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Schema
var Schema = mongoose.Schema; 

// Schema Types
var Heroes = new Schema({
  name : {type : String, required: true},
  facts : {type: [String]}
});

// Create Model
var HeroesModel = mongoose.model('Heroes', Heroes);

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes
app.get('/', function(req, res){
  heroes =  HeroesModel.find(function(err, heroes){
    if(!err){
      console.log(heroes);
      res.render('index.jade', {heroes: heroes});
    } else {
      return console.log('error obteniendo heroes');
    }
  });
});

app.get('/hero/:name', function(req, res){
    HeroesModel.findOne({name : req.params.name }, function(err, heroe){
    console.log(heroe);
    if(!err){
        console.log(heroe);
        res.json(heroe.facts);
    } else {
      return console.log('error obteniendo heroe');
    }
  });
});


app.post('/hero/add-hero', function(req, res){
    var heroe = new HeroesModel({name : req.body.name});
      heroe.save(function(err, heroe){
      console.log(heroe);
      if(!err){
          console.log(heroe);
          res.json({name : req.body.name});
      } else {
        return console.log('error obteniendo heroe');
      }
    });
});

app.post('/hero/add-fact', function(req, res){
    HeroesModel.findOne({ name: req.body.name}, function(error, heroe){
      if(error){
          console.log(error);
          res.json(error);
      }
      else if(heroe == null){
          console.log(null);
          res.json('no such user!')
      }
      else{
          heroe.facts = req.body.fact;
          heroe.save( function(error, data){
              if(error){
                  res.json(error);
              }
              else{
                  res.json({fact : req.body.fact});
              }
          });
      }
  });
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

