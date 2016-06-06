'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _three = require('three');

var _three2 = _interopRequireDefault(_three);

var _getPixels = require('get-pixels');

var _getPixels2 = _interopRequireDefault(_getPixels);

var _exportJs = require('./export.js');

var _exportJs2 = _interopRequireDefault(_exportJs);

var log = require('single-line-log').stdout;

var image = process.argv[2];

var pixelGeo = new _three2['default'].PlaneGeometry(1, 1, 1);
var printable = new _three2['default'].Geometry();

(0, _getPixels2['default'])(image, function (e, p) {
  // get pixels
  var w = p.shape[0];
  var h = p.shape[1];
  for (var y = 0; y < h; y++) {
    log(y + '/' + (h - 1));
    for (var x = 0; x < w; x++) {
      var val = p.data[(w * y + x) * 4];
      if (val === 0) savePixel(x, y);
    }
  }
  var model = new _three2['default'].Mesh(printable);
  model.name = image.replace('.png', '.stl');
  (0, _exportJs2['default'])(model);
});

function savePixel(x, y) {
  var pixel = new _three2['default'].Mesh(pixelGeo.clone());
  pixel.position.x = x;
  pixel.position.y = -y;
  pixel.updateMatrix();
  printable.merge(pixel.geometry, pixel.matrix);
}
