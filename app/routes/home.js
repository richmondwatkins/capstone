'use strict';
var traceur = require('traceur');
var Location = traceur.require(__dirname + '/../models/location.js');

exports.index = (req, res)=>{
  Location.findAll(locations=>{
    res.render('home/index', {title: 'World Explorer', locations: locations});
  });
};


exports.explore = (req, res)=>{
  res.render('home/explore', {title: 'Explore the World'});
};
