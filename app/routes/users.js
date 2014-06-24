'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Game = traceur.require(__dirname + '/../models/game.js');
var UserMap = traceur.require(__dirname + '/../models/map.js');


exports.new = (req, res)=>{
  res.render('users/new', {title: 'Login'});
};

exports.homeCreate = (req, res)=>{
  User.create(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.redirect('/');
    }else{
      res.redirect('/');
    }
  });
};

exports.gameCreate = (req, res)=>{
  User.create(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.render('users/gameover', {user: user});
    }else{
      res.render('users/error');
    }
  });
};

exports.gameLogin = (req, res)=>{
  User.login(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.render('users/gameover', {user: user});
    }else{
      res.render('users/error');
    }
  });
};

exports.homeLogin = (req, res)=>{
  User.login(req.body, user=>{
    if(user){
      req.session.userId = user._id;
      res.redirect('/');
    }else{
      res.redirect('/');
    }
  });
};

exports.show = (req, res)=>{
  User.findByUsername(req.params.username, owner=>{
    Game.findByUsername(owner.username, games=>{
      UserMap.findByUsername(owner.username, maps=>{
      res.render('users/show', {title: `${owner.username} Profile`, owner:owner, games: games, maps: maps});
      });
    });
  });
};

exports.logout = (req, res)=>{
  req.session = null;
  res.redirect('/');
};

exports.lookup = (req, res, next)=>{
  User.findById(req.session.userId, user=>{
    if(user){
      res.locals.user = user;
    }else{
      res.locals.user = null;
    }

    next();
  });
};

exports.bounce = (req, res, next)=>{
  if(res.locals.user){
    next();
  }else{
    res.redirect('/');
  }
};
