

// remove interior geo

function generateSTL(geom){
  var vertices = geom.vertices;
  var tris     = geom.faces;

  stl = "solid pixel";
  for(var i = 0; i<tris.length; i++){
    stl += ("facet normal "+stringifyVector( tris[i].normal )+" \n");
    stl += ("outer loop \n");
    stl += stringifyVertex( vertices[ tris[i].a ] );
    stl += stringifyVertex( vertices[ tris[i].b ] );
    stl += stringifyVertex( vertices[ tris[i].c ] );
    stl += ("endloop \n");
    stl += ("endfacet \n");
  }
  stl += ("endsolid");

  return stl
}

function stringifyVector(vec){
  return ""+vec.x+" "+vec.y+" "+vec.z;
}

function stringifyVertex(vec){
  return "vertex "+stringifyVector(vec)+" \n";
}

function removeDuplicateFaces(geometry){
  for(var i=0; i<geometry.faces.length; i++){
    var tri = geometry.faces[i];
    var inds = [tri.a, tri.b, tri.c, tri.d].sort();
    for(var j=0; j<i; j++){
      var tri_2 = geometry.faces[j];
      if( tri_2 !== undefined ){
        var inds_2 = [tri_2.a, tri_2.b, tri_2.c, tri_2.d].sort();
        if( isSame( inds, inds_2 ) ){
          delete geometry.faces[i];
          delete geometry.faces[j];
        }
      }
    }
  }
  geometry.faces = geometry.faces.filter( function(a){ return a!==undefined });
  return geometry;
}

function isSame(a1, a2){
  return !(a1.sort() > a2.sort() || a1.sort() < a2.sort());
}



// FULL

var container, stats;
var camera, scene, renderer;
var projector, plane, cube;
var mouse2D, mouse3D, raycaster,
rollOveredFace, isShiftDown = false,
theta = 45 * 0.5, isCtrlDown = false;

var cubeGeo, cubeMaterial;
var i, intersector;

init();

function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  camera = new THREE.CombinedCamera( window.innerWidth, window.innerHeight, 40, 1, 10000, -2000, 10000 );
  camera.position.y = 800;

  scene = new THREE.Scene();

  // cubes
  cubeGeo = new THREE.CubeGeometry( 50, 50, 50 );
  cubeMaterial = new THREE.MeshLambertMaterial( { color: 0x00ff80 } );
  // cubeMaterial = new THREE.MeshNormalMaterial();
  cubeMaterial.color.setHSV( 0.1, 0.7, 1.0 );
  cubeMaterial.ambient = cubeMaterial.color;

  // picking
  projector = new THREE.Projector();

  renderer = new THREE.WebGLRenderer( { antialias: true } );

  renderer.setSize( window.innerWidth, window.innerHeight );

  container.appendChild( renderer.domElement );
}

function setVoxelPosition( intersector ) {
  tmpVec.copy( intersector.face.normal );
  tmpVec.applyMatrix4( intersector.object.matrixRotationWorld );
  voxelPosition.addVectors( intersector.point, tmpVec );
  voxelPosition.x = Math.floor( voxelPosition.x / 50 ) * 50 + 25;
  voxelPosition.y = Math.floor( voxelPosition.y / 50 ) * 50 + 25;
  voxelPosition.z = Math.floor( voxelPosition.z / 50 ) * 50 + 25;
}

var geometry = new THREE.Geometry();

function onDocumentMouseDown( event ) {
    // create cube
    setVoxelPosition( intersector );
    var voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
    voxel.position.copy( voxelPosition );
    voxel.matrixAutoUpdate = false;
    voxel.updateMatrix();
    voxel.name = "voxel";
    
    THREE.GeometryUtils.merge( geometry, voxel );
    scene.add( voxel );
}

function save() {
  var stl = startExport();
  var blob = new Blob([stl], {type: 'text/plain'});
  saveAs(blob, 'pixel_printer.stl');
}

function render() {
  renderer.render( scene, camera );
}

function startExport(){
  geometry = removeDuplicateFaces( geometry );
  THREE.GeometryUtils.triangulateQuads( geometry );
  var stl = generateSTL( geometry );
  return stl;
}
