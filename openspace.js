var express = require('express');

var app = express.createServer(),
    io = require('socket.io').listen(app);

var THREE = require('./libs/quaternion.js');

io.configure(function() {
  io.set('log level', 1);
});

app.configure(function() {
  app.use(express.static(__dirname + '/public'));
});

function quaterionFromYawPitchRoll(yaw, pitch, roll){
  var q = new THREE.Quaternion();
  var n1, n2, n3, n4, n5, n6, n7, n8, n9;
  n9 = roll * 0.5;
  n6 = Math.sin(n9);
  n5 = Math.cos(n9);
  n8 = pitch * 0.5;
  n4 = Math.sin(n8);
  n3 = Math.cos(n8);
  n7 = yaw * 0.5;
  n2 = Math.sin(n7);
  n1 = Math.cos(n7);
  q.x = ((n1 * n4) * n5) + ((n2 * n3) * n6);
  q.y = ((n2 * n3) * n5) - ((n1 * n4) * n6);
  q.z = ((n1 * n3) * n6) - ((n2 * n4) * n5);
  q.w = ((n1 * n3) * n5)  + ((n2 * n4) * n6);
  
  return q;
}

var theShip = {
  position:         {x:0, y:0, z:0},
  velocity:         {x:0, y:0, z:0},
  angularVelocity:  {x:0, y:0, z:0},
  quaternion: new THREE.Quaternion(),
  animate:function(){						
    this.position.x += this.velocity.x;						
    this.position.y += this.velocity.y;
    this.position.z += this.velocity.z;
    
    var yaw, pitch, roll;
    
    yaw = this.angularVelocity.z;
    pitch = this.angularVelocity.y;
    roll = this.angularVelocity.x;
    this.quaternion.multiply(this.quaternion, quaterionFromYawPitchRoll(yaw, pitch, roll));

  },

}

var game = {
  gameTime: 33,
  gameLoop: function() {
    theShip.animate();
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

  socket.on('ship.noseDown', function() {
    theShip.angularVelocity.y -= 0.0001;
  });

  socket.on('ship.noseUp', function() {
    theShip.angularVelocity.y += 0.0001;
  });
});
app.listen(7814);
