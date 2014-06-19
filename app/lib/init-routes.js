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
  // var passport = require('passport');
  // require('../config/passport')(passport);

  var home = traceur.require(__dirname + '/../routes/home.js');
  var users = traceur.require(__dirname + '/../routes/users.js');
  var games = traceur.require(__dirname + '/../routes/games.js');
  // var passport = traceur.require(__dirname + '/../routes/passport.js');
  // function isLoggedIn(req, res, next) {
  //   if (req.isAuthenticated()){
  //     return next();
  //   }
  //   res.redirect('/passport');
  // }

  app.all('*', users.lookup);
  app.get('/', dbg, home.index);


  // app.get('/login', dbg, users.new);
  app.post('/register', dbg, users.gameCreate);
  app.post('/home/register', dbg, users.homeCreate);

  app.post('/login', dbg, users.gameLogin);
  app.post('/home/login', dbg, users.homeLogin);

  app.post('/logout', dbg, users.logout);

  app.get('/play', dbg, games.play);
  app.post('/save/:userId', dbg, games.save);

  app.get('/leaderboard', dbg, games.leaderboard);

  app.get('/users/:username', dbg, users.show);


  // app.get('/passport', dbg, passport.index);
  // app.get('/passport/profile', isLoggedIn, passport.profile);
  //
  // app.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
  // app.get('/auth/facebook/callback',
  //   passport.authenticate('facebook', {
  //     successRedirect : '/passport/profile',
  //     failureRedirect : '/passport'
  //   }));
  //
  // app.get('/passport/logout', function(req, res) {
  //   req.logout();
  //   res.redirect('/passport');
  // });

  app.all('*', users.bounce);



  console.log('Routes Loaded');

  fn();
}
