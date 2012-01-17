define([
  'backbone',
  'underscore',
  'model/vessel',
], function(Backbone, _, Vessel){
  var Vessels = Backbone.Collection.extend({
    model: Vessel,

    processFromJSON: function(json) {
      // first remove the missing objects
      this.each(function(vessel) {
        var found = _.find(json, function(obj) { return obj.id == vessel.id });
        if (!found)
          this.remove(vessel.id);
      }, this);
  
      // now add new vessels and update other vessels
      _.each(json, function(obj) {
        var found = this.get(obj.id);
        if (found) {
          found.setPositionState(obj);
        } else {
          this.add(obj);
        }
      }, this);
    
    },
  });

  return Vessels;
});
