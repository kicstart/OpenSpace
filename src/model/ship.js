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
      this.torpedoes.bind('detonation', this.removeTorpedo, this); // TODO: should these be in the collection?
      this.torpedoes.bind('destroyed', this.removeTorpedo, this);
    },

    hasTorpedoes: function() {
      return this.get('torpedoInventory') > 0;
    },

    fireTorpedo: function() {
      var torpedo = new Torpedo();
      torpedo.setPositionState(this.toJSON());
      torpedo.set({ownerId: this.id}); // set a reference to the owning ship
      torpedo.drive(1);
      this.torpedoes.add(torpedo);
      this.decTorpedoes();
    
      return torpedo;
    },

    removeTorpedo: function(torpedo) {
      this.torpedoes.remove(torpedo);
    },

    detonate: function(id) {
      var search = id.id !== null ? id.id : id;
      var torpedo = this.torpedoes.get(id);
      if (torpedo) {
        torpedo.detonate();
      }
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

