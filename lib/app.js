import fs from 'fs'
import _ from 'underscore'
import gp from 'get-pixels'
import async from 'async'
import voxel from 'voxel'
import THREE from 'three'

const OrbitControls = require('three-orbit-controls')(THREE)
var controls, scene, camera, renderer, material

const cubeGeo = new THREE.CubeGeometry(1, 1, 1)
const printable = new THREE.Geometry()

gp('./selfie.png', (e, p) => { // get pixels
  const w = p.shape[0]
  const h = p.shape[1]
  for(var y = 0; y < h; y++) {
    for(var x = 0; x < w; x++) {
      var val = p.data[((w * y) + x) * 4]
      if (val===255) drawPixel(x,y)
    }
  }
  exportSTL('./plate.stl', printable)
})

function drawPixel (x,y) {
  const pixel = new THREE.Mesh(cubeGeo.clone())
  pixel.position.x = x
  pixel.position.y = -y
  pixel.updateMatrix()
  printable.merge(pixel.geometry,pixel.matrix)
}
 
function init() {
  scene = new THREE.Scene()
  material = 
    new THREE.MeshLambertMaterial({
      color:0x333333, 
      shading:THREE.FlatShading
    })

  //lights
  var light = new THREE.DirectionalLight( 0xffffff )
  light.position.set(1,1,1)
  scene.add(light)
  light = new THREE.DirectionalLight( 0x002288 )
  light.position.set(-1,-1,-1)
  scene.add(light)
  light = new THREE.AmbientLight( 0x222222 )
  scene.add(light)

  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 20000 )
  camera.position.set(15,15,15)

  renderer = new THREE.WebGLRenderer( { antialias: false } );
  renderer.setClearColor('pink', 1 );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement )

  controls = new OrbitControls(camera)
  controls.addEventListener( 'change', draw )

  //animate()
}

// init()

function draw () {
  renderer.render(scene,camera)
}

function exportSTL(filePath, geom) {
  const file = fs.createWriteStream('./export.stl')
  const vertices = geom.vertices;
  const tris     = geom.faces;

  file.write("solid pixel")
  for(var i = 0; i<tris.length; i++){
   file.write(("facet normal "+stringifyVector( tris[i].normal )+" \n"))
   file.write(("outer loop \n"))
   file.write(stringifyVertex( vertices[ tris[i].a ] ))
   file.write(stringifyVertex( vertices[ tris[i].b ] ))
   file.write(stringifyVertex( vertices[ tris[i].c ] ))
   file.write(("endloop \n"))
   file.write(("endfacet \n"))
  }
  file.write("endsolid")
  file.close()
  file.on('close', () => {
    console.log('plate saved')
  })
}

function stringifyVector(vec){
  return ""+vec.x+" "+vec.y+" "+vec.z;
}

function stringifyVertex(vec){
  return "vertex "+stringifyVector(vec)+" \n";
}

function animate() {
  requestAnimationFrame( animate )
  controls.update()
}

function render() {
  renderer.render( scene, camera )
}
