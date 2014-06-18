/* global google:true */
/* jshint unused: false, undef: false, camelcase: false*/
(function(){
  'use strict';

  var leaderMaps;


  $(document).ready(init);

  function init(){
    showMaps();
  }



function showMaps(){
  var maps = $('.leader-maps');
  var allGames = [];
  for(var i = 0; i< maps.length; i++){
    var game = {};
    game.guessLoc = $(maps[i]).attr('data-guess');
    game.actualLoc = $(maps[i]).attr('data-actual');
    game.id = $(maps[i]).attr('id');
    allGames.push(game);
  }

  allGames.forEach(g=>{
    var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
    var mapOptions = {
      zoom: 1,
      center: myLatlng
    };
      g.guessLoc = g.guessLoc.toString();
      g.actualLoc = g.actualLoc.toString();

    // var guessLatlng = new google.maps.LatLng(g.guessLoc);
        g.guessLoc = g.guessLoc.replace('(', '');
        g.guessLoc = g.guessLoc.replace(')', '').split(',');

        g.actualLoc = g.actualLoc.replace('(', '');
        g.actualLoc = g.actualLoc.replace(')', '').split(',');
        console.log(g.actualLoc);

        var guessLoc = new google.maps.LatLng(g.guessLoc[0], g.guessLoc[1]);
        var actualLoc = new google.maps.LatLng(g.actualLoc[0], g.actualLoc[1]);

        leaderMaps = new google.maps.Map(document.getElementById(g.id), mapOptions);
        console.log(guessLoc);
        // var actualLoc = new google.maps.LatLng(g.actualLoc);
        var markers = new google.maps.Marker({
          position: guessLoc,
          map: leaderMaps
        });
        drawLine(guessLoc, actualLoc, leaderMaps);
  });

}

function drawLine(guessLoc, actualLoc, selectedMap){
  var flightPath = new google.maps.Polyline({
    path: [guessLoc, actualLoc],
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });

    flightPath.setMap(selectedMap);
}






})();
