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
      // reset ship reference to point at vessels ship reference
      if (vessel.id == ship.id) {
        ship = vessel;
        shipView = new ShipView({model: ship});
        $('body').append(shipView.render().el);
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
    });

    socket.on('openspace.loop', function(world) {
      //console.log(world);
      vessels.processFromJSON(world.vessels);
    });


  });

});
