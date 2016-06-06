'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _three = require('three');

var _three2 = _interopRequireDefault(_three);

exports['default'] = function (object) {
  var vector = new _three2['default'].Vector3();
  var normalMatrixWorld = new _three2['default'].Matrix3();

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

        process.stdout.write('\tfacet normal ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n' + '\t\touter loop\n');

        var indices = [face.a, face.b, face.c];

        for (var j = 0; j < 3; j++) {
          vector.copy(vertices[indices[j]]).applyMatrix4(matrixWorld);
          process.stdout.write('\t\t\tvertex ' + vector.x + ' ' + vector.y + ' ' + vector.z + '\n');
        }
        process.stdout.write('\t\tendloop\n\tendfacet\n');
      }
    }
    process.stdout.write('endsolid exported\n');
    process.exit(0);
  }
};

module.exports = exports['default'];
