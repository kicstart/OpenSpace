Hud = function(){
  this.top = document.createElement('div');
  this.SHP = new SHP();
  this.CAM = new CAM();
};

Hud.prototype = {
  constructor: Hud,
  init: function(parentNode){
    this.SHP.init();  
    this.CAM.init(); 
    this.top.id = 'hud';
    this.top.appendChild(this.SHP.SHP);
    this.top.appendChild(this.CAM.CAM);

    parentNode.appendChild(this.top); 
  },
  animate: function(){
    this.SHP.animate();
    this.CAM.animate();
  },
};


CAM = function(){
  this.CAM = document.createElement('div');
  this.name = document.createElement('div');
  this.zoom = document.createElement('div');
};

CAM.prototype = {
  constructor: CAM,

  init: function(){
    this.CAM.className = 'hudBoxBottom';
    this.CAM.id = 'hudCAM';
    this.CAM.innerHTML = '<h2>CAM</h2>';

    this.name.className = 'hudWidget';
    this.name.innerHTML = '<h3>view</h3>';
    this.CAM.appendChild(this.name);

    this.zoom.className = 'hudWidget';
    this.zoom.innerHTML = '<h3>zoom</h3>';
    this.CAM.appendChild(this.zoom);
  },

  animate: function(){
    this.name.innerHTML = '<h3>view</h3>';
    this.name.innerHTML += '<span class="camName">' + camView.currentState + '</span>';

    this.zoom.innerHTML = '<h3>zoom</h3>';
    this.zoom.innerHTML += '<span class="camZoom">' + camView.zoom + '</span>';
  },
};


SHP = function(){
  this.SHP = document.createElement('div');
  this.pos = document.createElement('div');
  this.vel = document.createElement('div');
  this.ang = document.createElement('div');
  this.hull = document.createElement('div');
};

SHP.prototype = {
  constructor: SHP,

  init: function(){
    this.SHP.className = 'hudBox';
    this.SHP.id = 'hudSHP';
    this.SHP.innerHTML = '<h2>SHP</h2>'

    this.pos.className = 'hudWidget';
    this.pos.innerHTML = '<h3>pos</h3>';
    this.SHP.appendChild(this.pos);

    this.hull.className = 'hudWidget';
    this.hull.innerHTML = '<h3>hull</h3>';
    this.SHP.appendChild(this.hull);

    var breaker = document.createElement('span');
    breaker.className = 'break';
    this.SHP.appendChild(breaker);

    this.vel.className = 'hudWidget';
    this.vel.innerHTML = '<h3>vel</h3>';
    this.SHP.appendChild(this.vel);
  
    this.ang.className = 'hudWidget';
    this.ang.innerHTML = '<h3>ang</h3>';
    this.SHP.appendChild(this.ang);
  },
  
  animate: function(){
    var s = ships[shipID];
    this.pos.innerHTML = '<h3>pos</h3><ul>';
    this.pos.innerHTML += '<li>x ' + s.position.x.toFixed(1) + '</li>';
    this.pos.innerHTML += '<li>y ' + s.position.y.toFixed(1) + '</li>';
    this.pos.innerHTML += '<li>z ' + s.position.z.toFixed(1) + '</li></ul>';

    this.vel.innerHTML = '<h3>vel</h3><ul>';
    this.vel.innerHTML += '<li>x ' + s.velocity.x.toFixed(3) + '</li>';
    this.vel.innerHTML += '<li>y ' + s.velocity.y.toFixed(3) + '</li>';
    this.vel.innerHTML += '<li>z ' + s.velocity.z.toFixed(3) + '</li></ul>';

    this.ang.innerHTML = '<h3>ang</h3><ul>';
    this.ang.innerHTML += '<li>x ' + s.angularVelocity.x.toFixed(4) + '</li>';
    this.ang.innerHTML += '<li>y ' + s.angularVelocity.y.toFixed(4) + '</li>';
    this.ang.innerHTML += '<li>z ' + s.angularVelocity.z.toFixed(4) + '</li></ul>';
    var hullPct = s.hull / s.shipClass.hull_pts * 100;
    this.hull.innerHTML = '<h3>hull</h3>';
    this.hull.innerHTML += '<span class="big">' + hullPct.toFixed(0) + '</span>';
    this.hull.innerHTML += '<span class="waterMark">%</span>';
  },
};
