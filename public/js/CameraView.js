CameraViewController = function(){
  this.currentView = 1;
  this.views = {1:{'name':'front', f:this.front},
                2:{'name':'back', f:this.back},
                3:{'name':'left', f:this.left},
                4:{'name':'right', f:this.right},
                5:{'name':'top', f:this.top},
                6:{'name':'bottom', f:this.bottom},
                7:{'name':'inspection', f:this.inspection},
                0:{'name':'lookAt', f:this.lookAt},
               };
  this.target = {x:0, y:0, z:0};
  this.zoom = 0;
  this.zoomScale = 100;
  this.currentState = this.views[this.currentView].name;
};

CameraViewController.prototype = {
  
  constructor: CameraViewController,

  init: function(){
  },

  setView: function(cameraCode){
    if(cameraCode in this.views){
      this.currentView = cameraCode;
      this.currentState = this.views[cameraCode].name; 
    }
    else {
      this.currentView = 1;
      this.currentState = this.views[1].name;
    };
  },

  setCamera: function(){
    var p = ships[shipID].position;
    var q = ships[shipID].mesh.quaternion;
    camera.position.x = p.x;
    camera.position.y = p.y;
    camera.position.z = p.z;
    this.views[this.currentView].f(this);
  },

  front: function(context){
    var vec = ships[shipID].getForwardVector();
    var backVector = ships[shipID].getForwardVector();
    var upVector = ships[shipID].getUpVector();
    var camPt = camera.position.clone();
    backVector.setLength(-10);
    upVector.setLength(2);
    camPt.add(backVector, camPt);
    camPt.add(upVector, camPt);
    var lookAtPt = camera.position.clone();
    vec.setLength(100);
    lookAtPt.add(vec, lookAtPt);
    
    camera.lookAt(lookAtPt);
    camera.position = camPt;
  },

  back: function(context){
    var vec = ships[shipID].getBackwardVector();
    var fwdVector = ships[shipID].getBackwardVector();
    var upVector = ships[shipID].getUpVector();
    var camPt = camera.position.clone();
    fwdVector.setLength(-10);
    upVector.setLength(2);
    camPt.add(fwdVector, camPt);
    camPt.add(upVector, camPt);
    var lookAtPt = camera.position.clone();
    vec.setLength(100);
    lookAtPt.add(vec, lookAtPt);
    camera.lookAt(lookAtPt);
    camera.position = camPt;
  },

  left: function(context){
    var vec = ships[shipID].getLeftVector();
    var leftVector = ships[shipID].getLeftVector();
    var upVector = ships[shipID].getUpVector();
    var camPt = camera.position.clone();
    leftVector.setLength(-10);
    upVector.setLength(2);
    camPt.add(leftVector, camPt);
    camPt.add(upVector, camPt);
    var lookAtPt = camera.position.clone();
    vec.setLength(100);
    lookAtPt.add(vec, lookAtPt);
    camera.lookAt(lookAtPt);
    camera.position = camPt;
  },

  right: function(context){
    var vec = ships[shipID].getRightVector();
    var rightVector = ships[shipID].getRightVector();
    var upVector = ships[shipID].getUpVector();
    var camPt = camera.position.clone();
    rightVector.setLength(-10);
    upVector.setLength(2);
    camPt.add(rightVector, camPt);
    camPt.add(upVector, camPt);
    var lookAtPt = camera.position.clone();
    vec.setLength(100);
    lookAtPt.add(vec, lookAtPt);
    camera.lookAt(lookAtPt);
    camera.position = camPt;
  },

  top: function(context){
    var vec = ships[shipID].getUpVector();
    var forwardVector = ships[shipID].getForwardVector();
    var upVector = ships[shipID].getUpVector();
    var camPt = camera.position.clone();
    forwardVector.setLength(-1)
    upVector.setLength(-10);
    camPt.add(forwardVector, camPt);
    camPt.add(upVector, camPt);
    var lookAtPt = camera.position.clone();
    vec.setLength(100);
    lookAtPt.add(vec, lookAtPt);
    
    camera.lookAt(lookAtPt);
    camera.position = camPt;
  },
 
  bottom: function(context){
    var vec = ships[shipID].getDownVector();
    var forwardVector = ships[shipID].getForwardVector();
    var downVector = ships[shipID].getDownVector();
    var camPt = camera.position.clone();
    downVector.setLength(-10);
    forwardVector.setLength(-1);
    camPt.add(forwardVector, camPt);
    camPt.add(downVector, camPt);
    var lookAtPt = camera.position.clone();
    vec.setLength(100);
    lookAtPt.add(vec, lookAtPt);
    camera.lookAt(lookAtPt);
    camera.position = camPt;
  },

  inspection: function(context){
    var timer = new Date().getTime() * 0.00005;
    var s = ships[shipID];
    camera.position.x += Math.sin( timer ) * 10 + 10 * context.zoom;
    camera.position.z += Math.cos( timer ) * 10 + 10 * context.zoom;
    camera.lookAt(s.mesh.position);
  },

  lookAt: function(context){
    camera.lookAt(context.target);
    var camForward = new THREE.Vector3(camera.matrix.n13,
                                       camera.matrix.n23,
                                       camera.matrix.n33);
    var camPt = camera.position.clone();
    camForward.setLength(10);
    camPt.add(camForward, camPt);
    camera.position = camPt;
  },
};



