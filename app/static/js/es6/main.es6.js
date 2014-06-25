/* global google:true */
/* jshint unused: false, undef: false, camelcase: false*/
(function(){
  'use strict';

  var marker;
  var streetViewLoc;
  var map;
  var guessIcon = '/img/pin.png';
  var actualIcon = '/img/flag2.png';
  var panorama;
  var guessArray = [];

  $(document).ready(init);

  function init(){
    initialize();
    randomStreetView();
    $('#make-guess').click(calcDist);
    $('#game-over').on('click', '#save-game', saveGame);
    initDialogs();
  }

  //-----saves game

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
    var username = $('#username').attr('data-username');
    ajax(`/save/${username}`, 'POST', gameData, res=>{
      console.log(res);
      window.location.href = '/leaderboard';
    });
  }

  function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}


  //---finds coords for marker and street view

  function calcDist(e){
    var distance = (google.maps.geometry.spherical.computeDistanceBetween(marker.position, streetViewLoc)).toFixed(2);
    console.log(distance);
    var coordsArray = [];
    coordsArray.push(marker.position, streetViewLoc);

    distance = (distance / 1609.34).toFixed(2);

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

  //initalizes the modal after each round


  function initModalMap(coords, distance){
    var mapOptions = {
      zoom: 2,
      center: coords[1],
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
      var modalMarker;
      var actualMarker;

      var modalMap = new google.maps.Map(document.getElementById('map-modal'), mapOptions);

      addAllMarkers(modalMarker, coords[0], guessIcon, modalMap);

      addAllMarkers(actualMarker, coords[1], actualIcon, modalMap);

      drawLine(coords, modalMap);
      calcPoints(distance);
  }

  //draws line between guess and actual

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

//---clears markers

  function clearMap(){
    marker.setMap(null);
    marker = null;
  }

  //---called on final round --- maps all of the random svs and guesses

  function gameOver(locations){
    var myLatlng = new google.maps.LatLng(34.452218,-40.341797);

    var mapOptions = {
      zoom: 2,
      center: myLatlng,
      mapTypeId: google.maps.MapTypeId.TERRAIN

    };
      var gameMarker;
      var actualMarker;

      var gameMap = new google.maps.Map(document.getElementById('map-game'), mapOptions);

      locations.forEach(l=>{
        addAllMarkers(gameMarker, l.coords[0], guessIcon, gameMap);
        addAllMarkers(actualMarker, l.coords[1], actualIcon, gameMap);
         drawLine(l.coords, gameMap);
       });
  }

  // adds markers to game modal and round modal

  function addAllMarkers(markerName, markerCoords, icon, map){
    markerName = new google.maps.Marker({
       position: markerCoords,
       map: map,
       icon: icon,
       animation: google.maps.Animation.DROP
     });
  }

  // --- Places the marker for the uses guess -----

  function placeMarker() {

    google.maps.event.addListener(map, 'click', function (event) {
      //initializes guess button on map
      guessButton();
      var latitude = event.latLng.lat();
      var longitude = event.latLng.lng();
      let latLng = new google.maps.LatLng(latitude, longitude);
        if (!marker) {
          var guessIcon = '/img/pin.png';
          marker = new google.maps.Marker({
              position: latLng,
              map: map,
              icon: guessIcon
          });
      } else {
          marker.setPosition(latLng);
      }
    });
  }


 // ----- Point calculation TODO Figure out a point system ------

   var totalPoints = 0;
  function calcPoints(dist){
    var roundPoints = 0;
    if(dist <= 1245.1){
      totalPoints += 100;
      roundPoints += 100;
    }
    if(dist >1245.1 && dist < 2490.2){
      totalPoints += 90;
      roundPoints += 90;
    }
    if(dist >2490.2 && dist < 3735.3){
      totalPoints += 80;
      roundPoints += 80;
    }
    if(dist >3735.3 && dist < 4980.4){
      totalPoints += 70;
      roundPoints += 70;
    }
    if(dist >4980.4 && dist < 6225.5){
      totalPoints += 60;
      roundPoints += 60;
    }
    if(dist >6225.5 && dist < 7470.6){
      totalPoints += 50;
      roundPoints += 50;
    }
    if(dist >7470.6 && dist < 8715.7){
      totalPoints += 40;
      roundPoints += 40;
    }
    if(dist >8715.7 && dist < 9960.8){
      totalPoints += 30;
      roundPoints += 30;
    }
    if(dist >9960.8 && dist < 11205.9){
      totalPoints += 20;
      roundPoints += 20;
    }
    if(dist >11205.9 && dist < 12451){
      totalPoints += 10;
      roundPoints += 10;
    }

    $('.distance').text(`${dist} miles from actual location`);
    $('.roundPoints').text(`${roundPoints} points this round`);
    $('.gamePoints').text(`${totalPoints} out of 500 possible`);

    var percentage = (totalPoints / 500) * 100;
    $('.progress-bar.progress-bar-warning').css('width', `${percentage}%`);
  }


// -------init map for marker and coordinate testing -----------

  function initialize() {
    guessArray = [];
    var myLatlng = new google.maps.LatLng(37.71859,-16.875);
    var mapOptions = {
      zoom: 1,
      center: myLatlng,
      draggableCursor: 'crosshair',
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };
     map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);


    placeMarker();
  }

//---- The function name says it all ------

  function randomStreetView(){
    var geocoder = new google.maps.Geocoder();
    var coords = chance.coordinates().split(',');
    var latLng = new google.maps.LatLng(coords[0], coords[1]);
    var streetView = new google.maps.StreetViewService();
    streetView.getPanoramaByLocation(latLng, 1000, response=>{
      console.log(response);
      if(response !== null){
        $('#globe').removeClass('loading');

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

        panorama = new  google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
        var isUser = $('#username').attr('data-username');
        if(isUser !== undefined){
          favoriteButton();
          $('body').on('click', '#favorite', saveFavorite);
        }

     } else{
      $('#globe').addClass('loading');
      randomStreetView();
     }
   });
  }

//---- intializes all modal/dialogue boxes ----


function initDialogs(){
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
    height: windowHeight,
    width: windowWidth,
    buttons: [
              {
                text: 'New Game',
                click: function() {
                  $( this ).dialog( 'close' );
                  window.location.href = '/play';
                }
              },
              {
                text: 'Leaderboard',
                click: function(){
                  window.location.href = '/leaderboard';
                }
              }
            ]
  });
}



function saveFavorite (){
  var faveLoc = {};
  var username = $('#username').attr('data-username');
  faveLoc.coords = streetViewLoc.toString();

  ajax(`/save/location/${username}`, 'POST', faveLoc, null);
  $('#favorite > div').css('border-color', 'yellow');
}

function favoriteButton(){
  // Create a div to hold the control.
  var controlDiv = document.createElement('div');

  // Set CSS styles for the DIV containing the control
  // Setting padding to 5 px will offset the control
  // from the edge of the map.
  controlDiv.style.padding = '5px';
  controlDiv.setAttribute('id', 'favorite');

  // Set CSS for the control border.
  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = 'green';
  controlUI.style.borderStyle = 'solid';
  controlUI.style.borderWidth = '2px';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = 'Favorite this location';
  controlDiv.appendChild(controlUI);

  // Set CSS for the control interior.
  var controlText = document.createElement('div');
  controlText.style.fontFamily = 'Arial,sans-serif';
  controlText.style.fontSize = '25px';
  controlText.style.color = 'white';
  controlText.style.paddingLeft = '15px';
  controlText.style.paddingRight = '15px';
  controlText.innerHTML = '<strong>☆</strong>';
  controlUI.appendChild(controlText);

  controlDiv.index = 1;
  panorama.controls[google.maps.ControlPosition.RIGHT_CENTER].push(controlDiv);

}

//----adds the make guess button onto map

function guessButton (){

  var guess = $('#guess').toArray;
  guessArray.push(guess);

  if(guessArray.length <= 1){
    // Create a div to hold the control.
    var controlDiv = document.createElement('div');

    controlDiv.style.padding = '5px';
    controlDiv.setAttribute('id', 'guess');

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'green';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '2px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to make guess';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '25px';
    controlText.style.color = 'white';
    controlText.style.paddingLeft = '15px';
    controlText.style.paddingRight = '15px';
    controlText.innerHTML = '<strong>Submit Guess</strong>';
    controlUI.appendChild(controlText);

    controlDiv.index = 1;
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);

    google.maps.event.addDomListener(controlUI, 'click', function() {
        calcDist();
      });



  } else{
    return null;
  }

}

})();
