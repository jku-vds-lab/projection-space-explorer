






/**
 * Sets up the THREE.js scene from the given dataset.
 */
function setupScene(container, vectors) {
  var scene = new THREE.Scene();

  var width = container.offsetWidth;
  var height = container.offsetHeight;

  camera = getDefaultCamera(width, height, loaded)

  problem.particles = new meshes.PointVisualization(settings)
  problem.particles.createMesh(loaded, segments, algorithms)
  problem.particles.zoom(camera.zoom)



  var renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  problem.renderer = renderer
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize(width, height);
  renderer.setClearColor( 0xffffff, 1);
  renderer.sortObjects = false;

  container.innerHTML = ""
  container.appendChild( renderer.domElement );
  //
  mouse = new THREE.Vector2();




  // First add lines to scene... so they get drawn first
  problem.lines = meshes.renderLines2(segments, algorithms)
  problem.lines.forEach(line => problem.scene.add(line.line))
  //fatLines(segments)

  problem.particles.update()
  // Then add particles
  problem.scene.add( problem.particles.mesh );


  if (rectangleSelection != null) {
    rectangleSelection.dispose()
  }
  rectangleSelection = new RectangleSelection(loaded, settings, problem)
}




/**
 * Calculates the default zoom factor by examining the bounds of the data set
 * and then dividing it by the height of the viewport.
 */
function getDefaultZoom(vectors, width, height) {
  var zoom = 10

  // Get rectangle that fits around data set
  var minX = 1000, maxX = -1000, minY = 1000, maxY = -1000;
  vectors.forEach (vector => {
    minX = Math.min(minX, vector.x)
    maxX = Math.max(maxX, vector.x)
    minY = Math.min(minY, vector.y)
    maxY = Math.max(maxY, vector.y)
  })

  // Get biggest scale
  var horizontal = Math.max(Math.abs(minX), Math.abs(maxX))
  var vertical = Math.max(Math.abs(minY), Math.abs(maxY))

  // Divide the height/width through the biggest axis of the data points
  return Math.min(width, height) / Math.max(horizontal, vertical) / 2
}




















/**
 * Returns an orthographic camera that is zoomed in at a correct distance for the given
 * data set.
 */
function getDefaultCamera(width, height, vectors) {
  var camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
  camera.zoom = getDefaultZoom(vectors, width, height);
  camera.position.z = 1;
  camera.lookAt(new THREE.Vector3(0,0,0));
  camera.updateProjectionMatrix();
  return camera
}
