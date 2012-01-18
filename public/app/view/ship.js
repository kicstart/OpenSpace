define([
  'backbone',
  'underscore',
  'jquery',
  'model/vessel',
  'text!template/ship.tpl.html',
], function(Backbone, $, Ship, shipTemplate) {
  
  var ShipView = Backbone.View.extend({
  
    tagName: 'div',
    className: 'ship',

    template: shipTemplate,

    events: {
      'click .thrust':      'thrust',
      'click .drive':       'drive',
      //'click .fire':        'fire',
    },

    initialize: function(options) {
      _.bindAll(this); // bind all functions on this so this means this :)

      this.socket = options.socket;
      this.model.bind('change', this.update, this); 
    },

    render: function() {
      $(this.el).html(_.template(shipTemplate, this.model.toJSON()));

      return this;
    },

    thrust: function(e) {
      var target = $(e.target);

      if (target.hasClass('rollLeft'))
        this.socket.emit('ship.thrust', {type: 'rollLeft', shipId: this.model.id});
      if (target.hasClass('rollRight'))
        this.socket.emit('ship.thrust', {type: 'rollRight', shipId: this.model.id});
      if (target.hasClass('pivotLeft'))
        this.socket.emit('ship.thrust', {type: 'pivotLeft', shipId: this.model.id});
      if (target.hasClass('pivotRight'))
        this.socket.emit('ship.thrust', {type: 'pivotRight', shipId: this.model.id});
      if (target.hasClass('noseUp'))
        this.socket.emit('ship.thrust', {type: 'noseUp', shipId: this.model.id});
      if (target.hasClass('noseDown'))
        this.socket.emit('ship.thrust', {type: 'noseDown', shipId: this.model.id});
    },

    update: function() {
      this.$('.position .x').html(this.model.position.x); 
      this.$('.position .y').html(this.model.position.y); 
      this.$('.position .z').html(this.model.position.z); 
    },

    drive: function() {
      this.socket.emit('ship.drive', {shipId: this.model.id});
    },
  });

  return ShipView;

});
