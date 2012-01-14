define([
  'backbone', 
  'underscore', 
  'model/vessel',
  'collection/torpedoes',
  'model/torpedo',
], function(Backbone, _, Vessel, Torpedoes, Torpedo){

  var Ship = Vessel.extend({
    defaults: {
      type:             'ship',
      hull:             800,
      torpedoInventory: 20, // TODO: Torpedoes might be useful as a preset collection of torpedoes that literally "launch"
    },

    //TODO: Should we store the THREE objects in the attributes hash, or directly on the object?
    initialize: function(options) {
      Vessel.prototype.initialize.call(this, options);
      this.torpedoes = new Torpedoes();
    },

    hasTorpedoes: function() {
      return this.get('torpedoInventory') > 0;
    },

    fireTorpedo: function() {
      var torpedo = new Torpedo();
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

      this.torpedoes.remove(torpedo.id);
    },

  });

  return Ship;
});

