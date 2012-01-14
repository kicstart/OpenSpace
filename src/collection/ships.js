define(['backbone', 'underscore', 'model/ship'], function(Backbone, _, Ship) {
  var Ships = Backbone.Collection.extend({
    model: Ship,
  });

  return Ships;
});
