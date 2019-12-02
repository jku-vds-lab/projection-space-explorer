var clustering = require('density-clustering');
var THREE = require('three');

var meshes = require('./view/meshes')

var chess = require('./problems/chess')
var rubik = require('./problems/rubik')
var neural = require('./problems/neural')

var loader = require('./util/loader')



class Problem {
  constructor(type) {
    this.type = type
  }

  aggregate(vectors) {
    setAggregateView(document.getElementById('aggregate'), vectors, true)
  }
}


const ProblemType = Object.freeze({
 "CHESS" : 1,
 "RUBIK" : 2
})



  function setAggregateView(element, list, aggregation) {
    element.innerHTML = ""

    if (problem.type == ProblemType.CHESS) {
      element.innerHTML = chess.aggregate(list)
    }
    if (problem.type == ProblemType.RUBIK) {
      element.innerHTML = rubik.aggregate(list)
    }
    if (problem.type == ProblemType.NEURAL) {
      element.innerHTML = neural.aggregate(list, aggregation)
    }
  }



  function intToComponents(colorBeginner) {
      var compBeginner = {
        r: (colorBeginner & 0xff0000) >> 16,
        g: (colorBeginner & 0x00ff00) >> 8,
        b: (colorBeginner & 0x0000ff)
      };

      return compBeginner
  }

  function * colorGenerator() {
    while (true) {
      yield 0x2d7864 // Elf green
      yield 0x943b80 // Vivid violet
      yield 0xff6600 // Yellow
      yield 0x0084c8 // Orange
      yield 0xb88100 // Gray
      yield 0xdc0000
      yield 0x364e59
    }
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













/**
 * Rectangle selection tool.
 */
class RectangleSelection {
  constructor(vectors, settings, problem) {
    this.vectors = vectors
    this.settings = settings
    this.problem = problem

    this.create = false

    this.geometry = new THREE.PlaneGeometry(1, 1, 32);
    this.material = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    console.log(this.material)
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.plane.position.x = 0
    this.plane.position.y = 0
    this.plane.scale.x = 0
    this.plane.scale.y = 0
  }

  mouseDown(x, y) {
    // dispose old selection
    this.problem.scene.remove(this.plane)

    if (this.create == false) {
      this.startX = x
      this.startY = y

      this.plane.position.x = this.startX
      this.plane.position.y = this.startY
      this.plane.scale.x = 0
      this.plane.scale.y = 0

      this.problem.scene.add(this.plane);

      this.create = true
    }
  }

  mouseMove(x, y) {
    if (this.create) {
      var w = x - this.startX
      var h = y - this.startY
      this.plane.scale.x = w
      this.plane.scale.y = h
      this.plane.position.x = x - w / 2
      this.plane.position.y = y - h / 2
    }
  }

  mouseUp() {
    if (this.create) {
      //this.problem.scene.remove(this.plane)
      var width = Math.abs(this.plane.scale.x)
      var height = Math.abs(this.plane.scale.y)
      var vectors = this.select({ x: this.plane.position.x - width / 2, y: this.plane.position.y - height / 2, w: width, h: height })

      // Create aggregation
      this.problem.aggregate(vectors)

      this.create = false
    }
  }

  dispose() {
    if (this.plane != null) {
      this.problem.scene.remove(this.plane)
    }

    this.geometry.dispose()
    this.material.dispose()
  }

  select(rect) {
    var set = []

    this.vectors.forEach(vector => {
      if (vector.visible && (this.settings.showIntPoints || vector.cp == 1)) {
        if (vector.x > rect.x && vector.y > rect.y && vector.x < rect.x + rect.w && vector.y < rect.y + rect.h) {
          set.push(vector)
        }
      }
    })

    return set
  }
}





    window.showGuide = function() {
      if (document.getElementById("guide").style.display == "none") {
        document.getElementById("guide").style.display = "block"
      } else {
        document.getElementById("guide").style.display = "none"
      }

    }


          var problem = null


          var loaded = null;
          var segments = null;
    			var camera;

    			var intersects;
    			var mouse, INTERSECTED;

          var mouseDownPosition = null;
          var mouseDown = false;
          var strokeTexture = null;

          var settings = {
            showIntPoints: true
          }

          var currentHoverIdx = null;


          var chooseColor = colorGenerator();

          var algorithms = { };


    /**
     * Checkbox determining if intermediate points should be drawn.
     */
    window.showIntermediatePoints = function () {
      settings.showIntPoints = !settings.showIntPoints

      problem.particles.update()
    }


    window.toggleData = function(element, algo) {
      segments.forEach((segment) => {
        if (segment.algo == algo) {
          segment.line.visible = element.checked


          segment.vectors.forEach((vector) => {
            if (vector.algo == algo) {
              vector.visible = element.checked
            }
          })
        }
      })

      problem.particles.update()
    }

    window.selectDataset = function (value) {
      cleanup()

      if (problem != null) {
        console.log("cleanup ----")
        console.log(problem.renderer.info)
        console.log("-------")
      }

      if (value.startsWith("chess")) {
        problem = new Problem(ProblemType.CHESS)
        loadData(problem, "datasets/chess/" + value.substring(6))
      } else if (value.startsWith("rubik")) {
        problem = new Problem(ProblemType.RUBIK)
        loadData(problem, "datasets/rubik/" + value.substring(6));
      } else if (value.startsWith("neural")) {
        problem = new Problem(ProblemType.NEURAL)
        loadData(problem, "datasets/neural/" + value.substring(7))
      }
    }





      var rectangleSelection = null



      function cleanup() {
        if (problem != null) {

          if (problem.lines != null) {
            console.log("disposing lines")
            problem.lines.forEach(line => {
              line.dispose()
            })
          }

          if (problem.particles != null) {
            console.log("get rid of particles")
            problem.particles.dispose()
          }

          if (problem.renderer != null) {
            problem.renderer.renderLists.dispose()
            console.log("disposed render lists")
          }

          problem.scene.dispose()
        }
      }



      /**
       * Loads a specific problem set, creating menus, displaying vectors etc.
       */
      function loadData(problem, file) {
        chooseColor = colorGenerator();
        algorithms = {}

        setAggregateView(document.getElementById('info'), [], false)
        setAggregateView(document.getElementById('aggregate'), [], true)




        // Load csv file
        loader.load(file, problem, algorithms, chooseColor, data => {
          loaded = data;

          segments = getSegments(loaded);

          init(loaded, problem);

          problem.particles.update()

          loadLegend(problem);
        })
      }

      function loadLegend(problem) {
        var chessOpeners = [ "Barnes Hut Opening", "Kings Pawn Opening", "English Opening" ]

        if (problem.type == ProblemType.RUBIK) {
          document.getElementById('legend').innerHTML = rubik.legend(algorithms[1].color, algorithms[0].color)
        } else if (problem.type == ProblemType.CHESS) {
          document.getElementById('legend').innerHTML = chess.legend(Object.keys(algorithms).sort().map(function (key, index) {return { 'color': algorithms[key].color, 'name': chessOpeners[key], 'algo': key } }))
        } else if (problem.type == ProblemType.NEURAL) {
          document.getElementById('legend').innerHTML = neural.legend(Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'learningRate': key } }))
        }
      }






      function getSegments(data) {
        //creating an array holding arrays of x,y,cubenum,algo,age for each cube

        // Sort data by cubeNum
        data.sort((a, b) => a.cubeNum - b.cubeNum)


        var n = data.length
        var points = new Array()
        var currentCube = 0
        var newArray = { vectors: new Array(), algo: data[0].algo }
        for (var i = 0; i < n; i++) {
          if(data[i].cubeNum != currentCube) {
            points.push(newArray)
            currentCube = data[i].cubeNum

            newArray = { vectors: new Array(), algo: data[i].algo }
          }

          newArray.vectors.push(data[i])
        }
        points.push(newArray)
        return points
    }







    function onDocumentMouseUp(e) {

      var test = mouseToWorld(e)

      if (rectangleSelection != null) {
        rectangleSelection.mouseUp(test.x, test.y)
      }


      mouseDown = false;
    }

    function onDocumentMouseDown(e) {
      e.preventDefault();

      var container = document.getElementById( 'container' );
      var width = container.offsetWidth;
      var height = container.offsetHeight;

      if (e.altKey && rectangleSelection != null) {
        var test = mouseToWorld(event)
        rectangleSelection.mouseDown(test.x, test.y)

      } else {
        // Dragging data around
        mouseDownPosition = normaliseMouse(e)
        mouseDown = true;
      }
    }

    function mouseToWorld(event) {
      var container = document.getElementById( 'container' );
      var width = container.offsetWidth;
      var height = container.offsetHeight;

      const rect = container.getBoundingClientRect();

      var test = {
        x: (event.clientX - rect.left - width / 2) / camera.zoom + camera.position.x,
        y: -(event.clientY - rect.top - height / 2) / camera.zoom + camera.position.y
      }

      return test
    }

    function onDocumentMouseMove( event ) {
      event.preventDefault();

      var test = mouseToWorld(event)

      if (rectangleSelection != null) {
        rectangleSelection.mouseMove(test.x, test.y)
      }

      if (window.infoTimeout != null) {
        clearTimeout(window.infoTimeout)
      }
      if (!mouseDown) {
        window.infoTimeout = setTimeout(function() {
          window.infoTimeout = null

          // Get index of selected node
          var idx = choose(test)
          problem.particles.highlight(idx)

          var list = []
          if (idx >= 0) list.push(loaded[idx])
          setAggregateView(document.getElementById('info'), list, false)
        }, 10);
      }



      // Dragging
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

      if (mouseDown) {
        camera.position.x = camera.position.x - (mouse.x - mouseDownPosition.x) * (600 / camera.zoom);
        camera.position.y = camera.position.y - (mouse.y - mouseDownPosition.y) * (600 / camera.zoom);
        mouseDownPosition = normaliseMouse(event)
        camera.updateProjectionMatrix()
      }
    }



			function init(data, problem) {
				var container = document.getElementById( 'container' );

        problem.scene = new THREE.Scene();

        var width = container.offsetWidth;
        var height = container.offsetHeight;

        camera = getDefaultCamera(width, height, loaded)

        problem.particles = new meshes.PointVisualization(settings)
        problem.particles.createMesh(loaded, segments, algorithms)
        problem.particles.zoom(camera.zoom)




				//
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

        console.log(data)
        // Transform data into [ [], [], ... ] structure
        //var dataset = []
        //data.forEach(vector => {
        //  dataset.push([ vector.x, vector.y ])
        //})
        //var dbscan = new clustering.OPTICS();
        // parameters: 5 - neighborhood radius, 2 - number of points in neighborhood to form a cluster
        //var clusters = dbscan.run(dataset, 0.5, 20);
        //console.log(clusters, dbscan.noise);

        //clusters.forEach(cluster => {
        //  if (cluster.length > 4) {
        //    var vertices = []
        //    cluster.forEach(index => {
        //      vertices.push(new THREE.Vector3(data[index].x, data[index].y, -10))
        //    })

        //    var m = new meshes.ConvexHull(vertices)
        //    problem.scene.add(m.createMesh())
        //  }

        //})



				container.addEventListener( 'mousemove', onDocumentMouseMove, false );
        container.addEventListener('mousedown', onDocumentMouseDown, false);
        container.addEventListener('mouseup', onDocumentMouseUp, false);
        container.addEventListener( 'wheel', onDocumentMouseWheel, false );
			}

      function dist(x1, y1, x2, y2) {
        var a = x1 - x2;
        var b = y1 - y2;

        var c = Math.sqrt( a*a + b*b );
        return c
      }

      function choose(position) {
        var best = 30 / (camera.zoom * 2.0)
        var res = -1

        for (var index = 0; index < loaded.length; index++) {
          var value = loaded[index]

          // Skip points matching some criteria
          if ((!settings.showIntPoints && value.cp == 0) || value.visible == false) {
            continue
          }

          var d = dist(position.x, position.y, value.x, value.y)

          if (d < best) {
            best = d
            res = index
          }
        }
        return res
      }

      function onDocumentMouseWheel(event) {
        event.preventDefault()
        camera.zoom = camera.zoom + event.deltaY * 0.02;
        if (camera.zoom < 1) {
          camera.zoom = 1;
        }

        problem.particles.zoom(camera.zoom);

        camera.updateProjectionMatrix();
      }

      function normaliseMouse(event) {
        var vec = {}
        vec.x = (event.clientX / window.innerWidth) * 2 - 1;
        vec.y = - (event.clientY / window.innerHeight) * 2 + 1;
        return vec
      }


			function onWindowResize() {
        var container = document.getElementById( 'container' );

        var width = container.offsetWidth;
        var height = container.offsetHeight;

				problem.renderer.setSize(width, height);

        camera.left = width / - 2
        camera.right = width / 2
        camera.top = height / 2
        camera.bottom = height / - 2

        camera.updateProjectionMatrix();
			}

			function animate() {


				requestAnimationFrame( animate );
        render();
			}

			function render() {
        if (problem == null) return;

        if (problem != null && "renderer" in problem) {
          problem.renderer.render(problem.scene, camera);
        }
			}



  var url = new URL(window.location);
  var set = url.searchParams.get("set");


  if (set != null) {
    if (set == "neural") {
      document.getElementById("setselect").value = "neural_learning_confmat.csv"
    } else if (set == "rubik") {
      document.getElementById("setselect").value = "rubik_cube10x2_different_origins.csv"
    } else if (set == "chess") {
      document.getElementById("setselect").value = "chess_chess16k.csv"
    }
  }


  window.selectDataset(document.getElementById("setselect").value)
  animate();
