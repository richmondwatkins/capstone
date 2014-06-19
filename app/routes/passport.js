'use strict';

exports.index = (req, res)=>{
  res.render('passport/index', {title: 'Node.js: Home'});
};


exports.profile = (req, res)=>{
  res.render('passport/profile', {
    user: req.user
  });
};
