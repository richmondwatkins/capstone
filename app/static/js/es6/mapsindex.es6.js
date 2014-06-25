/* global google:true */
/* jshint unused: false, undef: false, camelcase: false*/
(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    showMaps();
    $('body').on('click', '.deleteGame', deleteGame);
    // place();
  }

// function place(){
//   var maps = $('.leader-maps').toArray();
//   var placeNum = 0;
//   maps.forEach(i=>{
//     placeNum += 1;
//     $('#place').text(place);
//
//   });
//
// }

function deleteGame(){
  var gameId = $(this).siblings('.leader-maps').attr('id');
  // var data = {};
  // var ownerId = $('#owner').attr('data-id');
  // data.owner = ownerId;
  $.ajax({url: `/game/destroy/${gameId}`, type: 'POST', data: null, success: null});
    location.reload(true);
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
