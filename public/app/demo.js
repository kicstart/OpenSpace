require.config({
  paths: {
    'underscore'  :'vendors/underscore',
    'backbone'    :'vendors/backbone',   
    'jquery'      :'vendors/jquery.min',
    'three'       :'libs/three',
    'model'       :'model',
    'collection'  :'collection',
    'order'       :'vendors/order',
  },

  locale: "en_ca",
});

require([
  'jquery',
  'collection/vessels',
  'model/ship'
], function($, Vessels, Ship) {

  var socket = io.connect('http://'+location.host);
  $(function() {
    var vessels = new Vessels();
    var ship = null;
    socket.on('openspace.welcome', function(welcome) {
      ship = new Ship(welcome.ship);
      console.log('Welcome to OpenSpace', welcome);
      console.log('MyShip ', ship);
    });

    socket.on('openspace.loop', function(world) {
      //console.log(world);
    });
  });

});
