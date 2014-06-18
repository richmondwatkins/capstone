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
  // var guessLoc = $('#guessLoc').attr('data-coords');
  var maps = $('.leader-maps');
  var ids = [];
  for(var i = 0; i<maps.length; i++){
    ids.push($(maps[i]).attr('id'));
  }

  ids.forEach(i=>{
    var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
    var mapOptions = {
      zoom: 1,
      center: myLatlng
    };
        leaderMaps = new google.maps.Map(document.getElementById(i), mapOptions);
  });

  //
  //
  //

  //     locations.forEach(l=>{
  //       gameMarker = new google.maps.Marker({
  //          position: l.coords[0],
  //          map: gameMap
  //        });
  //        drawLine(l.coords, gameMap);
  //      });

}





})();
