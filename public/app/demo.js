require.config({
  paths: {
    'underscore'  :'vendors/underscore',
    'backbone'    :'vendors/backbone',   
    'jquery'      :'vendors/jquery.min',
  },

  locale: "en_ca",
});

require([
  'jquery',
], function($) {

  var socket = io.connect('http://'+location.host);
  $(function() {
    console.log('Loaded');
  });

});
