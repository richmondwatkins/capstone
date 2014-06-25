'use strict';

exports.index = (req, res)=>{
  res.render('home/index', {title: 'Node.js: Home'});
};


exports.explore = (req, res)=>{
  res.render('home/explore', {title: 'Explore the World'});
};
