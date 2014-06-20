'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Game = traceur.require(__dirname + '/../models/game.js');


exports.new = (req, res)=>{
  res.render('users/new', {title: 'Login'});
};

exports.homeCreate = (req, res)=>{
  console.log('inside routeeee');
  console.log(req.body);
  User.create(req.body, user=>{
    console.log(user);
    if(user){
      req.session.userId = user._id;
      res.redirect('/');
    }else{
      res.redirect('/');
    }
  });
};

exports.gameCreate = (req, res)=>{
  console.log('inside routeeee');
  console.log(req.body);
  User.create(req.body, user=>{
    console.log(user);
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
      console.log('in game login');
      console.log(user);
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
      console.log(user);
      res.redirect('/');
    }else{
      res.redirect('/');
    }
  });
};

exports.show = (req, res)=>{
  User.findByUsername(req.params.username, owner=>{
    Game.findByUsername(owner.username, games=>{
      res.render('users/show', {title: `${owner.username} Profile`, owner:owner, games: games});
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

exports.saveGame = (req, res)=>{
  console.log(req.body);
};
