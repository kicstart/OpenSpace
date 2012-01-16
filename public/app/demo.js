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
  'three',
], function($, Vessels, THREE) {

  var socket = io.connect('http://'+location.host);
  $(function() {
    var vessels = new Vessels();
    console.log(vessels);
    socket.on('openspace.welcome', function(welcome) {
      console.log('Welcome received', welcome);
    });

    socket.on('openspace.loop', function(world) {
      //console.log(world);
    });
  });

});
