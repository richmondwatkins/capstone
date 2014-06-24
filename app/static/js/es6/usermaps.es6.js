/* global google:true */
/* jshint unused: false, undef: false, camelcase: false*/
(function(){
  'use strict';

  var userMaps;

  $(document).ready(init);

  function init(){
    showUserMaps();
  }

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


})();
