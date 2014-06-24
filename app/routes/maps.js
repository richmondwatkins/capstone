'use strict';

var traceur = require('traceur');
var UserMap = traceur.require(__dirname + '/../models/map.js');

exports.index = (req, res)=>{
  UserMap.findAll(maps=>{
    res.render('maps/index', {title: 'Make a new game', maps:maps});
  });
};

exports.new = (req, res)=>{
  res.render('maps/new', {title: 'Make a new game'});
};

exports.create = (req, res)=>{
  UserMap.create(req.body);
};

exports.show = (req, res)=>{
  UserMap.findById(req.params.mapId, map=>{
    res.render('maps/show', {map: map});
  });
};

exports.destroy = (req, res)=>{
  console.log(req.params.mapId);
  UserMap.findAndRemove(req.params.mapId);
};
