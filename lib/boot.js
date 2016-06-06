import THREE from 'three'
import gp from 'get-pixels'
import exp from './export.js'
const log = require('single-line-log').stdout

const image = process.argv[2]

const pixelGeo = new THREE.PlaneGeometry(1, 1, 1)
const printable = new THREE.Geometry()

gp(image, (e, p) => { // get pixels
  const w = p.shape[0]
  const h = p.shape[1]
  for(var y = 0; y < h; y++) {
    log(y+'/'+(h-1))
    for(var x = 0; x < w; x++) {
      var val = p.data[((w * y) + x) * 4]
      if (val===0) savePixel(x,y)
    }
  }
  const model = new THREE.Mesh(printable)
  model.name = image.replace('.png','.stl')
  exp(model)
})

function savePixel (x,y) {
  const pixel = new THREE.Mesh(pixelGeo.clone())
  pixel.position.x = x
  pixel.position.y = -y
  pixel.updateMatrix()
  printable.merge(pixel.geometry,pixel.matrix)
}
