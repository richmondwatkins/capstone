var gameCollection = global.nss.db.collection('games');
// var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class Game{
  static create(obj, user, fn){
    var game = new Game();
    game.score = obj.score *1;
    game.coords = obj.coords;
    game.userImage = obj.userImage;
    game.userId = user._id;
    game.user = user.username;
    game.date = new Date();
    gameCollection.save(game, ()=>fn());

  }

  static findAll(fn){
    Base.findAllGames(gameCollection, Game, fn);
  }

  static findByUsername(username, fn){
    gameCollection.find({user: username}).toArray((err, games)=>{
      fn(games);
    });
  }


  static findById(id, fn){
    Base.findById(id, gameCollection, Game, fn);
  }

  static findAndRemove(id, fn){
    Base.findAndRemove(gameCollection, Game, id, fn);
  }


}

module.exports = Game;
