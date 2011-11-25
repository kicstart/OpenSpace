var fs = require('fs');

THREE = {};
// Read and eval quaternion library from three.js
fileQuaternion  = fs.readFileSync('./vendors/mrdoob/three.js/src/core/Quaternion.js','utf8');
fileVector3     = fs.readFileSync('./vendors/mrdoob/three.js/src/core/Vector3.js','utf8');
fileMatrix3     = fs.readFileSync('./vendors/mrdoob/three.js/src/core/Matrix3.js','utf8');
fileMatrix4     = fs.readFileSync('./vendors/mrdoob/three.js/src/core/Matrix4.js','utf8');
eval(fileQuaternion);
eval(fileVector3);
eval(fileMatrix3);
eval(fileMatrix4);

exports.Quaternion = THREE.Quaternion;
exports.Vector3 = THREE.Vector3
exports.Matrix3 = THREE.Matrix3;
exports.Matrix4 = THREE.Matrix4;
