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
    },

    initialize: function(options) {
      Vessel.prototype.initialize.call(this, options);
    },

  });

  return Torpedo;
});
