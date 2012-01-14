define([
  'backbone', 
  'underscore', 
  'three',
  'model/vessel'
], function(Backbone, _, THREE, Vessel){

  var Ship = Vessel.extend({
    defaults: {
      type:             'ship',
      hull:             800,
      torpedoInventory: 20,
    },

    //TODO: Should we store the THREE objects in the attributes hash, or directly on the object?
    initialize: function(options) {
      Vessel.prototype.initialize.call(this, options);
      this.set({
        'torpedoes': new Array(),
      }, {silent: true})
    },

    hasTorpedoes: function() {
      return this.get('torpedoInventory') > 0;
    },

    fireTorpedo: function() {
      var torpedo = new Ship({type: 'torpedo'});
      torpedo.setState(this.getState());
      torpedo.set({ownerId: this.id}); // set a reference to the owning ship
      torpedo.drive(1);
      this.decTorpedoes();
    
      return torpedo;
    },

    decTorpedoes: function() {
      this.set({torpedoInventory: this.get('torpedoInventory') - 1});
    },

    destroyTorpedo: function (torpedo) {
      if (this.type != 'ship') return;

      this.torpedos = _.reject(this.torpedos, function(t) { return t.id == torpedo.id });
    },

  });

  return Ship;
});

