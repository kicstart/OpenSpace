require.config({
  paths: {
    'underscore'  :'vendors/underscore',
    'backbone'    :'vendors/backbone',   
    'jquery'      :'vendors/jquery.min',
    'three'       :'libs/three',
    'model'       :'model',
    'collection'  :'collection',
    'text'        :'vendors/text',
  },

  locale: "en_ca",
});

require([
  'jquery',
  'underscore',
  'collection/vessels',
  'model/vessel',
  'view/ship',
], function($, _, Vessels, Vessel, ShipView) {

  var socket = io.connect('http://'+location.host);
  $(function() {
    vessels = new Vessels(); // TODO: rescope these

    ship = null;
    torpedoes = new Vessels();
    shipView = null;
    vessels.bind('add', function(vessel) {
      console.log('New ' + vessel.get('type') + ' id: ' + vessel.id);
      if (vessel.get('ownerId') == ship.id) {
        torpedoes.add(vessel);
      }
    });
    vessels.bind('remove', function(vessel) {
      console.log('Removed ' + vessel.get('type') + ' id:' + vessel.id);
      if (vessel.get('ownerId') == ship.id) {
        torpedoes.remove(vessel.id);
      }
    });


    // Socket message handling
    socket.on('openspace.welcome', function(welcome) {
      console.log('Welcome to OpenSpace', welcome);
      console.log('MyShip ', ship);

      ship = new Vessel(welcome.ship);
      shipView = new ShipView({model: ship});
      $('body').append(shipView.render().el);
    });

    socket.on('openspace.loop', function(world) {
      //console.log(world);
      vessels.processFromJSON(world.vessels);
    });


  });

});
