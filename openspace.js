var express = require('express');

var app = express.createServer(),
    io = require('socket.io').listen(app);

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

var theShip = {
  position: {x:0, y:0, z:0},
}

io.sockets.on('connection', function (socket) {
  socket.emit('openspace.welcome', {msg: 'Welcome to OpenSpace'});

  socket.on('ship.thrust', function(ship) {
    theShip.position.x++;
    theShip.position.y++;
    socket.emit('position.set', theShip);
  });
});
app.listen(7814);
