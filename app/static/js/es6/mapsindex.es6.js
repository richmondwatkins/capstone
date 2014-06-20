/* global google:true */
/* jshint unused: false, undef: false, camelcase: false*/
(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    showMaps();
    showFaveLocs();
  }

var favLocMap;

function showFaveLocs(){
  var locations = $('.faveLocs');
  var favLocsArray = [];
    for(var i = 0; i< locations.length; i++){
      var locsObj = {};
      locsObj.coords = $(locations[i]).attr('data-coords');
      favLocsArray.push(locsObj);
    }

    var centerLatLng = new google.maps.LatLng(37.71859,-16.875);

    var mapOptions = {
      zoom: 1,
      center: centerLatLng,
    };

        favLocMap = new google.maps.Map(document.getElementById('favsMap'), mapOptions);

    favLocsArray.forEach(c=>{
      c.coords = c.coords.toString();

      c.coords = c.coords.replace(')' , '').replace('(', '').split(',');
      var favCoords = new google.maps.LatLng(c.coords[0], c.coords[1]);


      favCoords = new google.maps.Marker({
        position: favCoords,
        map: favLocMap,
        animation: google.maps.Animation.DROP
      });


      google.maps.event.addListener(favCoords, 'click', function(event) {
       showPanorama(event.latLng);
       infoWindows(favCoords,event.latLng);
     });

    });


}
var geocoder;
var infowindow = new google.maps.InfoWindow();

function infoWindows(favCoords,coords){
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({'latLng': coords}, function(results, status) {
    console.log(results);
    infowindow.setContent(results[1].formatted_address);
    infowindow.open(favLocMap, favCoords);
  //   if (status === google.maps.GeocoderStatus.OK) {
  //     if (results[1]) {
  //       map.setZoom(11);
  //       infowindow.setContent(results[1].formatted_address);
  //       infowindow.open(favLocMap, favLocMarkers);
  //     } else {
  //       alert('No results found');
  //     }
  //   } else {
  //     alert('Geocoder failed due to: ' + status);
  //   }
  });
}

function showPanorama(coords){
  var panoramaOptions = {
    position: coords,
    addressControl: false,
    linksControl: false,
    panControl: false,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_RIGHT
    },
    pov: {
      heading: 34,
      pitch: 10
    }
  };

  var panorama = new  google.maps.StreetViewPanorama(document.getElementById('pan'), panoramaOptions);
   var isUser = $('#username').attr('data-username');
}

function showMaps(){
  var maps = $('.leader-maps');
  var coords = $('.coords');
  var coordsArray = [];
    for(var i = 0; i< coords.length; i++){
      var gameObj = {};
      gameObj.guessLoc = $(coords[i]).attr('data-guess');
      gameObj.actualLoc = $(coords[i]).attr('data-actual');
      coordsArray.push(gameObj);
    }

    var newArray = [];
    for (var f=0; f<coordsArray.length; f+=5) {
    var smallarray = coordsArray.slice(f,f+5);
      newArray.push(smallarray);
    }

    var gamesArray = [];
    for(var j = 0; j< maps.length; j++){
      var game = {};
      game.id = $(maps[j]).attr('id');
      gamesArray.push(game);
    }


    var allGameObjs = [];
    for(var k = 0; k < newArray.length; k++){
      var indGameObj = {};
      indGameObj.coords = newArray[k];
      indGameObj.id = gamesArray[k].id;
      allGameObjs.push(indGameObj);
    }

  var leaderMaps;

  allGameObjs.forEach(m=>{
    var myLatlng = new google.maps.LatLng(50.71859,-16.875);
    var mapOptions = {
      zoom: 1,
      center: myLatlng,
    };
      leaderMaps = m.id;
       leaderMaps = new google.maps.Map(document.getElementById(m.id), mapOptions);

     m.coords.forEach(g=>{

       g.guessLoc = g.guessLoc.toString();
       g.actualLoc = g.actualLoc.toString();

       g.guessLoc = g.guessLoc.replace('(', '');
       g.guessLoc = g.guessLoc.replace(')', '').split(',');

       g.actualLoc = g.actualLoc.replace('(', '');
       g.actualLoc = g.actualLoc.replace(')', '').split(',');

       var guessLoc = new google.maps.LatLng(g.guessLoc[0], g.guessLoc[1]);
       var actualLoc = new google.maps.LatLng(g.actualLoc[0], g.actualLoc[1]);

       var guessIcon = '/img/pin.png';

       var guessMarkers = new google.maps.Marker({
         position: guessLoc,
         map: leaderMaps,
         icon: guessIcon,
         animation: google.maps.Animation.DROP
       });

       var actualIcon = '/img/flag2.png';
       var actualMarkers = new google.maps.Marker({
         position: actualLoc,
         map: leaderMaps,
         icon: actualIcon,
       });

       var points = [guessLoc, actualLoc];

       drawLine(points, leaderMaps);
     });
  });
}

function drawLine(points, selectedMap){
  var flightPath = new google.maps.Polyline({
    path: points,
    geodesic: false,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

    flightPath.setMap(selectedMap);
}






})();
