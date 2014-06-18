/* global google:true */
/* jshint unused: false, undef: false, camelcase: false*/
(function(){
  'use strict';

  var map;
  var panorama;
  var marker;
  var streetViewLoc;
  var modalMarker;
  var modalMap;
  var gameMap;
  var gameMarker;

  $(document).ready(init);

  function init(){
    initialize();
    randomStreetView();
    $('#make-guess').click(calcDist);
    $('#game-over').on('click', '#save-game', saveGame);
    initDialogs();
  }

  function saveGame(){
    var gameData = {};
    gameData.score = totalPoints;

    gameLocations.forEach(l=>{
      gameData.guessLoc = l.coords[0].toString();
      gameData.actualLoc = l.coords[1].toString();
    });
    console.log(gameData);
    var userId = $('#userId').attr('data-id');
    ajax(`/save/${userId}`, 'POST', gameData, null);
  }

  function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}


  //---finds coords for marker and street view

  function calcDist(e){
    var distance = (google.maps.geometry.spherical.computeDistanceBetween(marker.position, streetViewLoc)).toFixed(2);
    var coordsArray = [];
    coordsArray.push(marker.position, streetViewLoc);
    roundResults(coordsArray, distance);

    e.preventDefault();
  }

//----keeps track of rounds shows results on map and ends game when when rounds hit specified amount
  var round = 0;
  var gameLocations = [];
  function roundResults(coords, distance){
    var roundRes = {};
    roundRes.coords = coords;
    roundRes.distance = distance;
    gameLocations.push(roundRes);
    round += 1;

    if(round >= 1){
      $( '#game-over' ).dialog('open');
      initModalMap(coords, distance);
      gameOver(gameLocations);
    }else {
      $( '#dialog' ).dialog('open');
      initModalMap(coords, distance);
      randomStreetView();
      initialize();
      clearMap();
    }
  }


  function initModalMap(coords, distance){
    var mapOptions = {
      zoom: 1,
      center: coords[1]
    };

      modalMap = new google.maps.Map(document.getElementById('map-modal'), mapOptions);
       modalMarker = new google.maps.Marker({
          position: coords[0],
          map: modalMap
      });

    drawLine(coords, modalMap);
    calcPoints(distance);
  }

  function drawLine(points, selectedMap){
   var flightPath = new google.maps.Polyline({
    path: points,
    geodesic: true,
    strokeColor: '#FF0000',
    strokeOpacity: 1.0,
    strokeWeight: 2
  });
    flightPath.setMap(selectedMap);
  }

  function clearMap(){
    marker.setMap(null);
    marker = null;
  }

  //---called on final round --- maps all of the random svs and guesses

  function gameOver(locations){
    var myLatlng = new google.maps.LatLng(-25.363882,131.044922);

    var mapOptions = {
      zoom: 1,
      center: myLatlng
    };

      gameMap = new google.maps.Map(document.getElementById('map-game'), mapOptions);

      locations.forEach(l=>{
        gameMarker = new google.maps.Marker({
           position: l.coords[0],
           map: gameMap
         });
         drawLine(l.coords, gameMap);
       });

  }

  function placeMarker() {
    google.maps.event.addListener(map, 'click', function (event) {
      var latitude = event.latLng.lat();
      var longitude = event.latLng.lng();
      let latLng = new google.maps.LatLng(latitude, longitude);
        if (!marker) {
          marker = new google.maps.Marker({
              position: latLng,
              map: map
          });
      } else {
          marker.setPosition(latLng);
      }
    });
  }


 // ----- Point calculation TODO Figure out a point system ------
   var totalPoints = 0;
  function calcPoints(dist){
    var points = ((dist/12451) * 100).toFixed(0) *1;
    totalPoints += points;
    $('.points').text(totalPoints);
  }


// -------init map for marker and coordinate testing -----------

  function initialize() {
    var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
    var mapOptions = {
      zoom: 1,
      center: myLatlng
    };
    map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
    placeMarker();
  }


  function randomStreetView(){
    var geocoder = new google.maps.Geocoder();
    var coords = chance.coordinates().split(',');
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var streetView = new google.maps.StreetViewService();
    streetView.getPanoramaByLocation(latLng, 1000, response=>{
      if(response !== null){
        streetViewLoc = response.location.latLng;
        // getCoords(response.location.latLng);
       var panoramaOptions = {
         position: response.location.latLng,
         addressControl: false,
         linksControl: false,
         panControl: false,
         pov: {
           heading: 34,
           pitch: 10
         }
       };
       var panorama = new  google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
     } else{
       randomStreetView();
     }
   });
  }

//---- intializes all modal/dialogue boxes ----

function initDialogs(){
  $( '#dialog' ).dialog({
    dialogClass: 'no-close',
    autoOpen: false,
    height: 600,
    width: 600,
    buttons: [
              {
                text: 'OK',
                click: function() {
                  $( this ).dialog( 'close' );
                }
              }
            ]
  });

  $( '#game-over' ).dialog({
    dialogClass: 'no-close',
    autoOpen: false,
    height: 600,
    width: 600,
    buttons: [
              {
                text: 'OK',
                click: function() {
                  $( this ).dialog( 'close' );
                }
              }
            ]
  });
}



})();
