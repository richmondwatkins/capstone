'use strict';

var traceur = require('traceur');
var UserMap = traceur.require(__dirname + '/../models/map.js');

exports.index = (req, res)=>{
  UserMap.findAll(maps=>{
    console.log(maps);
    res.render('maps/index', {title: 'Make a new game', maps:maps});
  });
};

exports.new = (req, res)=>{
  res.render('maps/new', {title: 'Make a new game'});
};

exports.create = (req, res)=>{
  UserMap.create(req.body);
};
