/* global google:true */
/* jshint unused: false, undef: false, camelcase: false*/
(function(){
  'use strict';

  $(document).ready(init);

  function init(){

    showFaveLocs();


    initDialog();

  }



var favLocMap;

function showFaveLocs(){
  var locations = $('.faveLocs');
  var favLocsArray = [];
    for(var i = 0; i< locations.length; i++){
      var locsObj = {};
      locsObj.user = $(locations[i]).attr('data-user');
      locsObj.coords = $(locations[i]).attr('data-coords');
      favLocsArray.push(locsObj);
    }

    var centerLatLng = new google.maps.LatLng(37.71859,-16.875);

    var mapOptions = {
      zoom: 2,
      center: centerLatLng,
    };

    favLocMap = new google.maps.Map(document.getElementById('home-map'), mapOptions);

    favLocsArray.forEach(c=>{
      console.log(c.user);
      c.coords = c.coords.toString();

      c.coords = c.coords.replace(')' , '').replace('(', '').split(',');
      var favCoords = new google.maps.LatLng(c.coords[0], c.coords[1]);


      favCoords = new google.maps.Marker({
        position: favCoords,
        map: favLocMap,
        animation: google.maps.Animation.DROP
      });


      google.maps.event.addListener(favCoords, 'click', function(event) {
        $( '#dialog' ).dialog('open');

       showPanorama(event.latLng);
       infoWindows(favCoords,event.latLng, c.user);
     });

    });


}


var geocoder;
var infowindow = new google.maps.InfoWindow();

function infoWindows(favCoords,coords, user){
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({'latLng': coords}, function(results, status) {
    var content = `<div>
                  <h3>${results[1].formatted_address}</h3>
                  <div id='pan'></div>
                  <a href=/users/${user}>Found by: ${user}</a>
                  </div>`;
      infowindow.setContent(content);
      infowindow.open(favLocMap, favCoords);

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



function initDialog(){
  var windowHeight = $(window).height() * 0.75;
  var windowWidth= $(window).width() * 0.75;


  $( '#dialog' ).dialog({
    dialogClass: 'no-close',
    autoOpen: false,
    modal: true,
    height: windowHeight,
    width: windowWidth,
    buttons: [
              {
                text: 'X',
                click: function() {
                  $( this ).dialog( 'close' );
                }
              }

            ]
  });

}



})();
