var express = require('express');

var app = express.createServer(),
    io = require('socket.io').listen(app);

io.configure(function() {
  io.set('log level', 1);
});

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

var theShip = {
  position: {x:0, y:0, z:0},
  thrust: 0,
}

var game = {
  gameTime: 33,
  gameLoop: function() {
    theShip.position.x += theShip.thrust;
    theShip.position.y += theShip.thrust;
    io.sockets.emit('openspace.loop', theShip);
  }
}

setInterval(game.gameLoop, game.gameTime);
setInterval(function() { console.log('Ship state', theShip) }, 1000);
io.sockets.on('connection', function (socket) {
  socket.emit('openspace.welcome', {msg: 'Welcome to OpenSpace'});

  socket.on('ship.thrust', function(ship) {
    theShip.thrust += 0.01;
    console.log(' Socket: ship.thrust', ship);
  });
});
app.listen(7814);
