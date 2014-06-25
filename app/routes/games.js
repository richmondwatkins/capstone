'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Game = traceur.require(__dirname + '/../models/game.js');


exports.play = (req, res)=>{
  res.render('game/play', {title: 'Play GeoFinder'});
};


exports.save = (req, res)=>{
  User.findByUsername(req.params.username, user=>{
    Game.create(req.body, user, fn=>{
      console.log(fn);
    });
  });
};


exports.leaderboard = (req, res)=>{
  Game.findAll(games=>{
    res.render('game/leaderboard', {title: 'GeoFinder Leaderboard', games: games});
  });
};


exports.destroy = (req, res)=>{
  Game.findAndRemove(req.params.gameId, fn=>{
    console.log(fn);
    res.render('maps/success');
  });
};
