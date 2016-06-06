'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _getPixels = require('get-pixels');

var _getPixels2 = _interopRequireDefault(_getPixels);

var _async = require('async');

var _async2 = _interopRequireDefault(_async);

var _voxel = require('voxel');

var _voxel2 = _interopRequireDefault(_voxel);

var _three = require('three');

var _three2 = _interopRequireDefault(_three);

var OrbitControls = require('three-orbit-controls')(_three2['default']);
var controls, scene, camera, renderer, material;

var cubeGeo = new _three2['default'].CubeGeometry(1, 1, 1);
var printable = new _three2['default'].Geometry();

(0, _getPixels2['default'])('./selfie.png', function (e, p) {
  // get pixels
  var w = p.shape[0];
  var h = p.shape[1];
  for (var y = 0; y < h; y++) {
    for (var x = 0; x < w; x++) {
      var val = p.data[(w * y + x) * 4];
      if (val === 255) drawPixel(x, y);
    }
  }
  // export
  exportSTL('./plate.stl', printable);
});

function drawPixel(x, y) {
  console.log(y);
  var pixel = new _three2['default'].Mesh(cubeGeo.clone());
  pixel.position.x = x;
  pixel.position.y = -y;
  pixel.updateMatrix();
  printable.merge(pixel.geometry, pixel.matrix);
}

function init() {
  scene = new _three2['default'].Scene();
  material = new _three2['default'].MeshLambertMaterial({
    color: 0x333333,
    shading: _three2['default'].FlatShading
  });

  //lights
  var light = new _three2['default'].DirectionalLight(0xffffff);
  light.position.set(1, 1, 1);
  scene.add(light);
  light = new _three2['default'].DirectionalLight(0x002288);
  light.position.set(-1, -1, -1);
  scene.add(light);
  light = new _three2['default'].AmbientLight(0x222222);
  scene.add(light);

  camera = new _three2['default'].PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 20000);
  camera.position.set(15, 15, 15);

  renderer = new _three2['default'].WebGLRenderer({ antialias: false });
  renderer.setClearColor('pink', 1);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera);
  controls.addEventListener('change', draw);

  //animate()
}

// init()

function draw() {
  renderer.render(scene, camera);
}

function exportSTL(filePath, geom) {
  var file = _fs2['default'].createWriteStream('./export.stl');
  var vertices = geom.vertices;
  var tris = geom.faces;

  var s = "solid pixel";
  for (var i = 0; i < tris.length; i++) {
    s += "facet normal " + stringifyVector(tris[i].normal) + " \n";
    s += "outer loop \n";
    s += stringifyVertex(vertices[tris[i].a]);
    s += stringifyVertex(vertices[tris[i].b]);
    s += stringifyVertex(vertices[tris[i].c]);
    s += "endloop \n";
    s += "endfacet \n";
    file.write(s);
  }
  s += "endsolid";
  file.write(s);
  file.close();
  file.on('close', function () {
    console.log('plate saved');
  });
}

function stringifyVector(vec) {
  return "" + vec.x + " " + vec.y + " " + vec.z;
}

function stringifyVertex(vec) {
  return "vertex " + stringifyVector(vec) + " \n";
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
}

function render() {
  renderer.render(scene, camera);
}
