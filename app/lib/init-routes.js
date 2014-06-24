'use strict';

var traceur = require('traceur');
var dbg = traceur.require(__dirname + '/route-debugger.js');
var initialized = false;


module.exports = (req, res, next)=>{
  if(!initialized){
    initialized = true;
    load(req.app, next);
  }else{
    next();
  }
};

function load(app, fn){

  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var games = traceur.require(__dirname + '/../routes/games.js');
  var locations = traceur.require(__dirname + '/../routes/locations.js');
  var maps = traceur.require(__dirname + '/../routes/maps.js');



  app.all('*', users.lookup);
  app.get('/', dbg, home.index);


  // app.get('/login', dbg, users.new);
  app.post('/register', dbg, users.gameCreate);
  app.post('/home/register', dbg, users.homeCreate);

  app.post('/login', dbg, users.gameLogin);
  app.post('/home/login', dbg, users.homeLogin);

  app.post('/logout', dbg, users.logout);

  app.get('/play', dbg, games.play);
  app.post('/save/:username', dbg, games.save);
  app.get('/leaderboard', dbg, games.leaderboard);

  app.get('/maps', dbg, maps.index);
  app.get('/maps/:mapId', dbg, maps.show);
  app.get('/create', dbg, maps.new);
  app.post('/create', dbg, maps.create);
  app.post('/map/destroy/:mapId', dbg, maps.destroy);


  app.post('/save/location/:username', locations.save);
  app.get('/users/:username', dbg, users.show);
  app.post('/game/destroy/:gameId', dbg, games.destroy);




  app.all('*', users.bounce);



  console.log('Routes Loaded');

  fn();
}
