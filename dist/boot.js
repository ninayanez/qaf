'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _underscore = require('underscore');

var _underscore2 = _interopRequireDefault(_underscore);

var _three = require('three');

var _three2 = _interopRequireDefault(_three);

var _getPixels = require('get-pixels');

var _getPixels2 = _interopRequireDefault(_getPixels);

var _exportJs = require('./export.js');

var _exportJs2 = _interopRequireDefault(_exportJs);

var log = require('single-line-log').stdout;

var image = process.argv[2];

var map = { // front : 8,9 & back : 10,11
  right: 0, // faces 0,1
  left: 2, // faces 2,3
  top: 4, // faces 4,5
  bottom: 6 // faces 6,7
};

var pixelGeo = new _three2['default'].CubeGeometry(1, 1, 1);
var printable = new _three2['default'].Geometry();

(0, _getPixels2['default'])(image, function (e, p) {
  // get pixels
  var w = p.shape[0];
  var h = p.shape[1];
  var baseGeo = new _three2['default'].CubeGeometry(w, h, 4);
  baseGeo.center();
  for (var y = 0; y < h; y++) {
    // y row
    log(y + '/' + (h - 1));
    for (var x = 0; x < w; x++) {
      // x across y
      var val = p.data[(w * y + x) * 4];
      var sides = { // find connected pixels
        right: p.data[(w * y + (x + 1)) * 4] === 0 ? true : false,
        left: p.data[(w * y + (x - 1)) * 4] === 0 ? true : false,
        top: p.data[(w * (y - 1) + x) * 4] === 0 ? true : false,
        bottom: p.data[(w * (y + 1) + x) * 4] === 0 ? true : false
      };
      if (val === 0) savePixel(x, y, sides);
    }
  }
  // scale along z
  printable.scale(1, 1, 2.5); // ratio???
  printable.center();
  var base = new _three2['default'].Mesh(baseGeo);
  base.position.z = -2.5; // plus thicknes??
  base.updateMatrix();
  printable.merge(base.geometry, base.matrix);
  var model = new _three2['default'].Mesh(printable);
  model.name = image.replace('.png', '.stl');
  (0, _exportJs2['default'])(model);
});

function savePixel(x, y, sides) {
  var pixel = new _three2['default'].Mesh(pixelGeo.clone());
  var m = _underscore2['default'].clone(map);
  pixel.position.x = x;
  pixel.position.y = -y;
  _underscore2['default'].each(sides, function (v, k) {
    // remove colliding side
    if (v) {
      // array shifts!!! fuck!
      pixel.geometry.faces.splice(m[k], 2);
      _underscore2['default'].each(m, function (f, c) {
        if (c !== k) m[c] = f - 2;
      });
    }
  });
  pixel.updateMatrix();
  printable.merge(pixel.geometry, pixel.matrix);
}
