/* global google:true */
/* jshint unused: false, undef: false, camelcase: false*/
(function(){
  'use strict';

  $(document).ready(init);

  function init(){
    $('body').on('click', '.deleteGame', deleteGame);
    $('body').on('click', '.deleteMap', deleteMap);
    $('#my-games').hide();
    $('#my-maps').hide();
    showFavs();
    $('#revealGames').click(showGames);
    $('#revealFavs').click(showFavs);
    $('#revealMaps').click(showMyMaps);

    initDialog();

  }

function showMyMaps() {
  $('#my-games').hide();
  $('#pan').hide();
  $('#favsMap').hide();
  $('#my-maps').show();

  $('#revealMaps').addClass('current-tab');

  $('#revealFavs').removeClass('current-tab');
  $('#revealGames').removeClass('current-tab');

  showUserMaps();
}

function showFavs(){
  $('#my-games').hide();
  $('#my-maps').hide();
  $('#pan').show();
  $('#favsMap').show();

  $('#revealFavs').addClass('current-tab');

  $('#revealGames').removeClass('current-tab');
  $('#revealMaps').removeClass('current-tab');

  showFaveLocs();
}

function showGames(){
  $('#favsMap').hide();
  $('#pan').hide();
  $('#my-maps').hide();
  $('#my-games').show();

  $('#revealGames').addClass('current-tab');

  $('#revealMaps').removeClass('current-tab');
  $('#revealFavs').removeClass('current-tab');
  showMaps();

}



function deleteGame(){
  var gameId = $(this).siblings('.leader-maps').attr('id');

  ajax( `/game/destroy/${gameId}`, 'POST', null, res=>{
    console.log(res);
    location.reload(true);
  });
}

function deleteMap(){
  var mapId = $(this).siblings('.maps').attr('id');
  ajax( `/map/destroy/${mapId}`, 'POST', null, res=>{
    console.log(res);
    location.reload(true);
  });
}


function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
$.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}


var userMaps;

function showUserMaps(){
  var maps = $('.maps');
  var mapSettings = $('.map-settings');


  var mapsArray = [];
  for(var i = 0; i < maps.length; i ++){
    var mapObj = {};
        mapObj.zoom = $(mapSettings[i]).attr('data-zoom');
        mapObj.center = $(mapSettings[i]).attr('data-center');
        mapObj.id = $(maps[i]).attr('id');
    mapsArray.push(mapObj);
  }

  mapsArray.forEach(m=>{

    m.center = m.center.replace(')', '').replace('(', '').split(',');
    m.zoom *= 1;

    var center = new google.maps.LatLng(m.center[0], m.center[1]);

    var mapOptions = {
      zoom: m.zoom,
      center: center,
    };
      userMaps = m.id;
      userMaps = new google.maps.Map(document.getElementById(m.id), mapOptions);
  });

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
      zoom: 2,
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
        $( '#dialog' ).dialog('open');
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
    infowindow.setContent(results[2].formatted_address);
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
  var windowHeight = $(window).height();
  var windowWidth= $(window).width();


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
