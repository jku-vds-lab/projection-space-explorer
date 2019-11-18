/**
 * This script contains generic purpose functions that are used by the visualization, like the normalization of data points
 * and searching for the nearest neibour etc...
 */









/**
 * Returns the line opacity for a given line count.
 */
function getLineOpacity(count) {
  if (count >= 0 && count <= 9) {
    return 1.0
  }
  if (count >= 10 && count <= 30) {
    return 0.5
  }
  if (count >= 30 && count <= 70) {
    return 0.3
  }
  if (count >= 70 && count <= 130) {
    return 0.25
  }
  if (count >= 130) {
    return 0.17
  }

  return 0.3 + 0.7 / segments.length
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
 * Generates a line mesh
 */

 function renderLines(segments, algorithms) {
   var opacity = getLineOpacity(segments.length)
   var lines = []

   segments.forEach(function(segment, index) {
     var geometry = new THREE.Geometry();

     var material = new THREE.LineBasicMaterial({
         color: algorithms[segment.vectors[0].algo].color,
         transparent: true,

         // Calculate opacity
         opacity: opacity
         // 1 - 1     100 - 0.1    200 - 0.05      50 - 0.2     25 - 0.4
     });
     var da = []
     segment.vectors.forEach(function(vector, vi) {
       da.push(new THREE.Vector2(vector.x, vector.y))
       //geometry.vertices.push(new THREE.Vector3(vector.x, vector.y, -1.0));
     })

     var curve = new THREE.SplineCurve(da)

     curve.getPoints(1000).forEach(function(p, i) {
       geometry.vertices.push(new THREE.Vector3(p.x, p.y, -1.0))
     })
     var line = new THREE.Line( geometry, material );

     // Store line data in segment...
     segment.line = line

     lines.push(line)
   })

   return lines
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






class PointVisualization {
  constructor(settings) {
    this.settings = settings
    this.highlightIndex = null
    this.particleSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
  }

  createMesh(data, segments) {
    this.segments = segments
    this.loaded = data

    var vertices = new THREE.Geometry().vertices;
    var positions = new Float32Array( data.length * 3 );
    var colors = new Float32Array( data.length * 4 );
    var sizes = new Float32Array( data.length );
    var types = new Float32Array(data.length);
    var vertex;
    var color = new THREE.Color();
    var i = 0

    segments.forEach(segment => {
      segment.vectors.forEach(vector => {
        vertices.push(new THREE.Vector3(vector.x, vector.y, -0.5))

        vertex = vertices[ i ];
        vertex.toArray( positions, i * 3 );

        color.setHex(algorithms[data[i].algo].color);

        // Set the globalIndex which belongs to a specific vertex
        vector.globalIndex = i

        colors[i * 4] = color.r;
        colors[i * 4 + 1] = color.g;
        colors[i * 4 + 2] = color.b;
        colors[i * 4 + 3] = 0.0;

        //color.toArray( colors, i * 4 );
        sizes[ i ] = this.particleSize;

        if (vector.age == 0) {
          // Starting point
          types[i] = 0
        } else if (vector.age == segment.vectors.length - 1) {
          // Ending point
          types[i] = 3
        } else if (vector.cp == 1) {
          // Checkpoint
          types[i] = 1
        } else {
          // Intermediate
          types[i] = 2
        }

        i++
      })
    })



    var pointGeometry = new THREE.BufferGeometry();
    pointGeometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
    pointGeometry.addAttribute( 'customColor', new THREE.BufferAttribute( colors, 4 ) );
    pointGeometry.addAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
    pointGeometry.addAttribute( 'type', new THREE.BufferAttribute( types, 1 ) );

    //
    var pointMaterial = new THREE.ShaderMaterial( {
      uniforms: {
        zoom: { value: 1.0 },
        color: { value: new THREE.Color( 0xffffff ) },
        pointTexture: { value: [
          new THREE.TextureLoader().load( "textures/sprites/cross_texture.png" ),
          new THREE.TextureLoader().load( "textures/sprites/square_texture.png" ),
          new THREE.TextureLoader().load( "textures/sprites/circle_texture.png" ),
          new THREE.TextureLoader().load( "textures/sprites/star_texture.png" )
        ]
         }
      },
      transparent: true,
      vertexShader: document.getElementById( 'vertexshader' ).textContent,
      fragmentShader: document.getElementById( 'fragmentshader' ).textContent,
      alphaTest: 0.05
    })

    this.mesh = new THREE.Points(pointGeometry, pointMaterial);

    this.sizeAttribute = this.mesh.geometry.attributes.size
  }



  update() {
    var i = 0
    var colors = this.mesh.geometry.attributes.customColor.array

    segments.forEach(function(segment, si) {
      segment.vectors.forEach(function(vector, t) {
        if ((settings.showIntPoints || this.loaded[i].cp == 1 || vector.age == 0 || vector.age == segment.vectors.length - 1) && vector.visible) {
          colors[i * 4 + 3] = 0.3 + (vector.age / segment.vectors.length) * 0.7;
        } else {
          colors[i * 4 + 3] = 0.0
        }

        i++
      })
    })

    this.mesh.geometry.attributes.customColor.needsUpdate = true;
  }

  /**
   * Highlights a specific point index.
   */
  highlight(index) {
    if (this.highlightIndex != null) {
      this.sizeAttribute.array[this.highlightIndex] = this.particleSize
    }

    this.highlightIndex = index

    if (this.highlightIndex != null) {
      this.sizeAttribute.array[this.highlightIndex] = this.particleSize * 2
      this.sizeAttribute.needsUpdate = true
    }
  }



  /**
   * Updates the zoom level.
   */
  zoom(zoom) {
    this.mesh.material.uniforms.zoom.value = zoom
  }
}




























/**
 * Rectangle selection tool.
 */
class RectangleSelection {
  constructor(vectors, settings, problem) {
    this.vectors = vectors
    this.settings = settings
    this.problem = problem
  }

  mouseDown(x, y) {
    this.geometry = new THREE.PlaneGeometry(1, 1, 32);
    this.material = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5
    });
    this.plane = new THREE.Mesh(this.geometry, this.material);
    this.plane.position.x = x
    this.plane.position.y = y
    this.plane.scale.x = 0
    this.plane.scale.y = 0

    this.startX = x
    this.startY = y

    problem.scene.add(this.plane);
  }

  mouseMove(x, y) {
    var w = x - this.startX
    var h = y - this.startY
    this.plane.scale.x = w
    this.plane.scale.y = h
    this.plane.position.x = x - w / 2
    this.plane.position.y = y - h / 2
  }

  mouseUp() {
    this.problem.scene.remove(this.plane)

    var width = Math.abs(this.plane.scale.x)
    var height = Math.abs(this.plane.scale.y)
    var vectors = this.select({ x: this.plane.position.x - width / 2, y: this.plane.position.y - height / 2, w: width, h: height })

    // Create aggregation
    this.problem.aggregate(vectors)



    this.geometry.dispose()
    this.material.dispose()
  }

  dispose() {
    this.problem.scene.remove(this.plane)

    this.geometry.dispose()
    this.material.dispose()
  }

  select(rect) {
    var set = []

    this.vectors.forEach((vector, index) => {
      if (this.settings.showIntPoints || vector.cp == 1) {
        if (vector.x > rect.x && vector.y > rect.y && vector.x < rect.x + rect.w && vector.y < rect.y + rect.h) {
          set.push(vector)
        }
      }
    })

    return set
  }
}
