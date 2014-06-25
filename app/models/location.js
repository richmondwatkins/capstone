var locationCollection = global.nss.db.collection('locations');
var traceur = require('traceur');
var Base = traceur.require(__dirname + '/base.js');
// var _ = require('lodash');

class Location{
  static create(obj, user, fn){
      var location = new Location();
      location.userId =  user._id;
      location.username =  user.username;
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
