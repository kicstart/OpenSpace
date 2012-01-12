define(['backbone', 'underscore', 'model/ship'], function(Backbone, _, Ship) {
  var Ships = Backbone.Model.extend({
    model: Ship,
  });

  return Ships;
});
