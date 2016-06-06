'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _three = require('three');

var _three2 = _interopRequireDefault(_three);

var _through2 = require('through2');

var _through22 = _interopRequireDefault(_through2);

var log = require('single-line-log').stdout;

exports['default'] = function (object) {
  var s = (0, _through22['default'])();
  var file = _fs2['default'].createWriteStream(object.name, 'utf8');
  var vector = new _three2['default'].Vector3();
  var normalMatrixWorld = new _three2['default'].Matrix3();

  s.pipe(file);
  file.on('end', function () {
    log('exported');
  });

  if (object instanceof _three2['default'].Mesh) {
    var geometry = object.geometry;
    var matrixWorld = object.matrixWorld;

    if (geometry instanceof _three2['default'].Geometry) {
      var vertices = geometry.vertices;
      var faces = geometry.faces;
      normalMatrixWorld.getNormalMatrix(matrixWorld);

      for (var i = 0, l = faces.length; i < l; i++) {
        var face = faces[i];
        vector.copy(face.normal).applyMatrix3(normalMatrixWorld).normalize();

        s.write('\tfacet normal ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n' + '\t\touter loop\n');

        var indices = [face.a, face.b, face.c];

        for (var j = 0; j < 3; j++) {
          vector.copy(vertices[indices[j]]).applyMatrix4(matrixWorld);
          s.write('\t\t\tvertex ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n');
        }

        s.write('\t\tendloop\n\tendfacet\n');
        log(i + '/' + (faces.length - 1) + '\n');
      }
    }
    s.write('endsolid exported\n');
    s.end();
  }
};

module.exports = exports['default'];
