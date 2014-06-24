var mapCollection = global.nss.db.collection('maps');
var Mongo = require('mongodb');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');

class Map{
  static create(obj, fn){
    var map = new Map();
        map.user= obj.username;
        map.userId = Mongo.ObjectID(obj.userId);
        map.zoom= obj.zoom;
        map.ne = obj.ne;
        map.sw= obj.sw;
        map.center= obj.center;
        map.title = obj.title;
        map.date = new Date();
    mapCollection.save(map, ()=>{});
  }

  static findAll(fn){
    Base.findAll(mapCollection, Map, fn);
  }

  static findByUsername(username, fn){
    mapCollection.find({user: username}).toArray((err, maps)=>{
      fn(maps);
    });
  }


  static findById(id, fn){
    Base.findById(id, mapCollection, Map, fn);
  }

  static findAndRemove(id){
    Base.findAndRemove(mapCollection, Map, id);
  }


}

module.exports = Map;
