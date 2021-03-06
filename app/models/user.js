var bcrypt = require('bcrypt');
var userCollection = global.nss.db.collection('users');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
var _ = require('lodash');
var async = require('async');

class User{
  static create(obj, fn){
    console.log(obj);
    userCollection.findOne({email:obj.email, username:obj.username}, (e,u)=>{
      if(!u){
        var user = new User();
        user._id = Mongo.ObjectID(obj._id);
        user.email = obj.email;
        user.username = obj.username;
        user.password = bcrypt.hashSync(obj.password, 8);
        user.explorer = obj.explorer;
        user.faveLocs = [];
        userCollection.save(user, ()=>fn(user));
      }else{
        fn(null);
      }
    });
  }

  static login(obj, fn){
    userCollection.findOne({email:obj.email}, (e,u)=>{
      if(u){
        var isMatch = bcrypt.compareSync(obj.password, u.password);
        if(isMatch){
          fn(u);
        }else{
          fn(null);
        }
      }else{
        fn(null);
      }
    });
  }

  static findById(id, fn){
    Base.findById(id, userCollection, User, fn);
  }


  static findByUsername(username, fn){
    userCollection.findOne({username:username}, (err, user)=>{
      if(user){
        user = _.create(User.prototype, user);
        fn(user);
      }else{
        fn(null);
      }
    });
  }


  isOwner(user){
    return user.toString() === this._id.toString();
  }


  saveLocation(obj){
    this.faveLocs.push(obj.coords);
    userCollection.save(this, ()=>{});
  }


  static findImages(maps, fn){
    async.map(maps, findAllImages, (e, images)=>{
      fn(images);
    });
  }

}

//returns all of the users that are found from the async
function findAllImages(users, fn){
  'use strict';
  User.findById(users.userId, user=>{
    fn(null, user);
  });
}

module.exports = User;
