define([
  'backbone',
  'underscore',
  'jquery',
  'model/vessel',
  'text!template/ship.tpl.html',
], function(Backbone, _, $, Ship, shipTemplate) {
  
  var ShipView = Backbone.View.extend({
  
    tagName: 'div',
    className: 'ship',

    template: shipTemplate,

    initialize: function() {
      this.model.bind('change', this.render, this); 
    },

    render: function() {
      $(this.el).html(_.template(shipTemplate, this.model.toJSON()));

      return this;
    }
  });

  return ShipView;

});
