var fs = require('fs');

// Read and eval quaternion library from three.js
filedata = fs.readFileSync('./vendors/mrdoom/three.js/src/core/Quaternion.js','utf8');
THREE = {};
eval(filedata);
console.log(THREE);


/* The quadtree.js file defines a class 'QuadTree' which is all we want to export */

exports.Quaternion = THREE.Quaternion;
