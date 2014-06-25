/* global google:true */
/* jshint unused: false, undef: false, camelcase: false*/
(function(){
  'use strict';


  var panorama;
  var streetViewLoc;
  var map;
  var marker;

  $(document).ready(init);

  function init(){
    randomStreetView();
  }

  function randomStreetView(){
  var geocoder = new google.maps.Geocoder();
  var coords = chance.coordinates().split(',');
  var latLng = new google.maps.LatLng(coords[0], coords[1]);
  var streetView = new google.maps.StreetViewService();
  streetView.getPanoramaByLocation(latLng, 1000, response=>{
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

      initialize();

      var isUser = $('#username').attr('data-username');
      if(isUser !== undefined){
        favoriteButton();
        $('body').on('click', '#favorite', saveFavorite);
      }

      spinGlobe();
      $('body').on('click', '#spin', randomStreetView);

   } else{
    $('#globe').addClass('loading');
    randomStreetView();
   }
 });
}

function initialize() {
  var myLatlng = new google.maps.LatLng(37.71859,-16.875);
  var mapOptions = {
    zoom: 1,
    center: myLatlng,
    draggableCursor: 'crosshair',
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };
   map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

    marker = new google.maps.Marker({
      position: streetViewLoc,
      map: map,
      animation: google.maps.Animation.DROP
    });

    infoWindow();
}



function infoWindow(){
  var infowindow = new google.maps.InfoWindow();
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({'latLng': streetViewLoc}, function(results, status) {
    infowindow.setContent(results[1].formatted_address);
    infowindow.open(map, marker);
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

function spinGlobe(){
  // Create a div to hold the control.
  var controlDiv = document.createElement('div');

  controlDiv.style.padding = '5px';
  controlDiv.setAttribute('id', 'spin');

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
  controlText.innerHTML = '<strong>Spin the Globe!</strong>';
  controlUI.appendChild(controlText);

  controlDiv.index = 1;
  panorama.controls[google.maps.ControlPosition.TOP_CENTER].push(controlDiv);

}


function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
$.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}


})();
