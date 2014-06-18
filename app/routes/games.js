'use strict';

var traceur = require('traceur');
// var User = traceur.require(__dirname + '/../models/user.js');
var Game = traceur.require(__dirname + '/../models/game.js');


exports.play = (req, res)=>{
  res.render('game/play', {title: 'Play GeoFinder'});
};


exports.save = (req, res)=>{
  Game.create(req.body, req.params.userId, fn=>{
    console.log(fn);
  });
};


exports.leaderboard = (req, res)=>{
  Game.findAll(games=>{
    res.render('game/leaderboard', {title: 'GeoFinder Leaderboard', games: games});
  });
};
