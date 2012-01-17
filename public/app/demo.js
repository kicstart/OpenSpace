require.config({
  paths: {
    'underscore'  :'vendors/underscore',
    'backbone'    :'vendors/backbone',   
    'jquery'      :'vendors/jquery.min',
    'three'       :'libs/three',
    'model'       :'model',
    'collection'  :'collection',
  },

  locale: "en_ca",
});

require([
  'jquery',
  'underscore',
  'collection/vessels',
  'model/vessel'
], function($, _, Vessels, Vessel) {

  var socket = io.connect('http://'+location.host);
  $(function() {
    vessels = new Vessels(); // TODO: rescope these
    ship = null;
    torpedoes = new Vessels();
    vessels.bind('add', function(vessel) {
      console.log('New ' + vessel.get('type') + ' id: ' + vessel.id);
    });
    console.log(vessels);




    // Socket message handling
    socket.on('openspace.welcome', function(welcome) {
      ship = new Vessel(welcome.ship);
      console.log('Welcome to OpenSpace', welcome);
      console.log('MyShip ', ship);
    });

    socket.on('openspace.loop', function(world) {
      //console.log(world);
      vessels.addIfNew(world.ships);
      _.each(world.torpedoes, function(torpedo) {
        // we each over the torpedoes instead of addIfNew for the entire array
        // as we need to handle our own torpedoes
        vessels.addIfNew(torpedo);
        if (torpedo.ownerId == ship.id) {
          torpedoes.add(vessels.get(torpedo.id));
        }
      });
    });


  });

});
