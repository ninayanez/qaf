import THREE from 'three'

export default function (object) {
  const vector = new THREE.Vector3()
  const normalMatrixWorld = new THREE.Matrix3()

  if (object instanceof THREE.Mesh) {
    const geometry = object.geometry
    const matrixWorld = object.matrixWorld

    if( geometry instanceof THREE.Geometry) {
      var vertices = geometry.vertices
      var faces = geometry.faces
      normalMatrixWorld.getNormalMatrix(matrixWorld)

      for ( var i = 0, l = faces.length; i < l; i ++ ) {
        var face = faces[i]
        vector.copy(face.normal)
              .applyMatrix3(normalMatrixWorld)
              .normalize()

        process.stdout.write(
          '\tfacet normal '+vector.x+' '+vector.y+' '+vector.z+'\n'
          +'\t\touter loop\n')

        var indices = [face.a,face.b,face.c]

        for ( var j = 0; j < 3; j ++ ) {
          vector.copy(vertices[indices[j]]).applyMatrix4(matrixWorld)
          process.stdout.write(
            '\t\t\tvertex '+vector.x+' '+vector.y+' '+vector.z+'\n')
        }
        process.stdout.write('\t\tendloop\n\tendfacet\n')
      }
    }
    process.stdout.write('endsolid exported\n')
    process.exit(0)
  }
}
