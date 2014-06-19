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
        gameData.coords = [];
        gameData.score = totalPoints;
    gameLocations.forEach(l=>{
      var coords = {};
      coords.guessLoc = l.coords[0].toString();
      coords.actualLoc = l.coords[1].toString();
      gameData.coords.push(coords);
    });
    var userId = $('#username').attr('data-username');
    ajax(`/save/${userId}`, 'POST', gameData, null);
      window.location.href = '/';

  }

  function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}


  //---finds coords for marker and street view

  function calcDist(e){
    var distance = (google.maps.geometry.spherical.computeDistanceBetween(marker.position, streetViewLoc)).toFixed(2);
    var coordsArray = [];
    coordsArray.push(marker.position, streetViewLoc);

    distance = distance / 5280;

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

    if(round >= 5){
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
      zoom: 2,
      center: coords[1],
      mapTypeId: google.maps.MapTypeId.SATELLITE
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
    geodesic: false,
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
    if(dist <= 1245.1){
      totalPoints += 100;
    }
    if(dist >1245.1 && dist < 2490.2){
      totalPoints += 90;
    }
    if(dist >2490.2 && dist < 3735.3){
      totalPoints += 80;
    }
    if(dist >3735.3 && dist < 4980.4){
      totalPoints += 70;
    }
    if(dist >4980.4 && dist < 6225.5){
      totalPoints += 60;
    }
    if(dist >6225.5 && dist < 7470.6){
      totalPoints += 50;
    }
    if(dist >7470.6 && dist < 8715.7){
      totalPoints += 40;
    }
    if(dist >8715.7 && dist < 9960.8){
      totalPoints += 30;
    }
    if(dist >9960.8 && dist < 11205.9){
      totalPoints += 20;
    }
    if(dist >11205.9 && dist < 12451){
      totalPoints += 10;
    }
    $('.distance').text(dist);
    $('.points').text(totalPoints);
  }


// -------init map for marker and coordinate testing -----------

  function initialize() {
    var myLatlng = new google.maps.LatLng(-25.363882,131.044922);
    var mapOptions = {
      zoom: 1,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.SATELLITE
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
         zoomControlOptions: {
           position: google.maps.ControlPosition.TOP_RIGHT
         },
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
    modal: true,
    height: 'auto',
    maxWidth: 100,
    width: 'auto',
    buttons: [
              {
                text: 'Next Round',
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
    width: 1500,
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
