define([
  'backbone',
  'underscore',
  'model/vessel',
], function(Backbone, _, Vessel){
  var Vessels = Backbone.Collection.extend({
    model: Vessel,

    vesselsFromJSON: function(json) {
      _.each(json, function(obj) {
        var vessel = this.get(obj.id);
        if (vessel) { // vessel already exists
          vessel.setPositionState(obj);  
        } else { // vessel does not exist
          this.add(obj);
        }
      }, this);
    },
  });

  return Vessels;
});
