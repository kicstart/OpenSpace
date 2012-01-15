define([
  'backbone',
  'underscore',
  'model/vessel',
], function(Backbone, _, Vessel){

  var Torpedo = Vessel.extend({
    defaults: {
      ownerId:          null,
      type:             'torpedo',
      hull:             50,
      yield:            200000,
    },

    initialize: function(options) {
      Vessel.prototype.initialize.call(this, options);
    },

    detonate: function() {
      this.trigger('detonation', this);
    }, 

  });

  return Torpedo;
});
