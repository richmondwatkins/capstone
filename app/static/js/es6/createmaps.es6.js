/* global google:true */
/* jshint unused: false, undef: false, camelcase: false*/
(function(){
  'use strict';
  var rectangle;
  var map;
  var infoWindow;
  var ne;
  var sw;
  var center;
  var zoom;
  $(document).ready(init);

  function init(){
    initialize();
    $('#save-map').click(saveMap);
    $('#save-map').hide();
    $('#map-title').click(showSave);
  }

  function showSave(){
    $('#save-map').fadeIn();
  }


  function initialize() {
    var mapOptions = {
      center: new google.maps.LatLng(37.71859,-16.875),
      zoom: 2
    };
    map = new google.maps.Map(document.getElementById('new-map'),
        mapOptions);

    var bounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(32.724169, -75.1333),
        new google.maps.LatLng(58.09083, 2.72106)
    );

    // Define the rectangle and set its editable property to true.
    rectangle = new google.maps.Rectangle({
      bounds: bounds,
      editable: true,
      draggable: true
    });

    rectangle.setMap(map);

    // Add an event listener on the rectangle.
    google.maps.event.addListener(rectangle, 'bounds_changed', function(){
      ne = rectangle.getBounds().getNorthEast();
      sw = rectangle.getBounds().getSouthWest();
      center = rectangle.getBounds().getCenter();
      zoom = map.getZoom();
    });

  }

  function saveMap(){
    var mapSettings = {};
        mapSettings.center = center.toString();
        mapSettings.ne = ne.toString();
        mapSettings.sw = sw.toString();
        mapSettings.zoom = zoom.toString();
        mapSettings.username = $('#user').attr('data-username');
        mapSettings.userId = $('#user').attr('data-userId');
        mapSettings.userImage = $('#user').attr('data-image');
        mapSettings.title = $('#map-title').val();
    ajax(`/create`, 'POST', mapSettings, res=>{
      $('#maps-success').empty().append(res);
      window.location.href = '/maps';
    });
  }

  function ajax(url, type, data={}, success=r=>console.log(r), dataType='html'){
  $.ajax({url:url, type:type, dataType:dataType, data:data, success:success});
}


})();
