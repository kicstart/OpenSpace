var express = require('express');

var app = express.createServer(),
    io = require('socket.io').listen(app);

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

app.listen(7814);
