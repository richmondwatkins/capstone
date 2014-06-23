var gameCollection = global.nss.db.collection('games');
// var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class Game{
  static create(obj, username, fn){
    console.log(obj);
    var game = new Game();
    game.score = obj.score *1;
    game.coords = obj.coords;
    game.user = username;
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
}

module.exports = Game;
