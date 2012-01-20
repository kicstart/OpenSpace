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
      chainReact:       true,
    },

    initialize: function(options) {
      Vessel.prototype.initialize.call(this, options);
      this.bind('destroyed', this.destroyed, this);
    },

    detonate: function() {
      this.trigger('detonation', this);
    }, 

    destroyed: function() {
      if (this.get('chainReact')) {
        this.detonate();
      }
    },

  });

  return Torpedo;
});
