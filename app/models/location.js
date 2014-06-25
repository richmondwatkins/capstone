var locationCollection = global.nss.db.collection('locations');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
// var _ = require('lodash');

class Location{
  static create(obj, userId, fn){
      var location = new Location();
      location.userId =  userId;
      location.locations = obj.coords;
      locationCollection.save(location, ()=>fn());
    }


  static findById(id, fn){
    Base.findById(id, locationCollection, Location, fn);
  }

  static findAll(fn){
    Base.findAll(locationCollection, Location, fn);
  }


}

module.exports = Location;
