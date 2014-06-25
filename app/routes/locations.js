'use strict';

var traceur = require('traceur');
var User = traceur.require(__dirname + '/../models/user.js');
var Location = traceur.require(__dirname + '/../models/location.js');





exports.save = (req, res)=>{
  User.findByUsername(req.params.username, user=>{
    user.saveLocation(req.body);
    Location.create(req.body, user, fn=>{
      console.log(fn);
      res.render('maps/success');
    });
  });
};
