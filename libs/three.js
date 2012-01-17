define(function() {
  THREE = typeof THREE === 'undefined' ? {} : THREE;

  // TODO: We should probably wrap the individual libraries in AMD definitions so we can require in only the things we need
  if (typeof THREE.Quaternion == 'undefined')
    requirejs(['vendors/mrdoob/three.js/src/core/Quaternion']);
  if (typeof THREE.Vector3 == 'undefined')
    requirejs(['vendors/mrdoob/three.js/src/core/Vector3']);
  if (typeof THREE.Matrix3 == 'undefined')
    requirejs(['vendors/mrdoob/three.js/src/core/Matrix3']);
  if (typeof THREE.Matrix4 == 'undefined')
    requirejs(['vendors/mrdoob/three.js/src/core/Matrix4']);

  /**
   * Custom quaternion factory from @KyleYoung
   *
   * TODO: This function feels like it's in the wrong place? Should it be THREE.Quaternion.fromYawPitchRoll()??
   */
  THREE.quaternionFromYawPitchRoll = function(yaw, pitch, roll){
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

  return THREE;
});
