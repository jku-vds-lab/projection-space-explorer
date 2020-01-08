/**
 * Generates a line mesh
 */
var convex = require('three/examples/jsm/geometries/ConvexGeometry')

var fragmentShaders = require('./fragmentshaders')
var vertexShaders = require('./vertexshaders')
var Meshy = require('three.meshline');

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

  return 0.3 + 0.7 / count
}

function renderLines2(segments, algorithms) {
  var opacity = getLineOpacity(segments.length)
  var lines = []

  Object.keys(algorithms).forEach(key => {
    var geometry = new THREE.Geometry();

    var material = new THREE.LineBasicMaterial({
      color: algorithms[key].color,
      transparent: true,

      // Calculate opacity
      opacity: opacity
      // 1 - 1     100 - 0.1    200 - 0.05      50 - 0.2     25 - 0.4
    });

    var line = new THREE.LineSegments(geometry, material);

    segments.filter(e => e.algo == key || e.algo == undefined).forEach(function (segment, index) {

      var da = []
      segment.vectors.forEach(function (vector, vi) {
        da.push(new THREE.Vector2(vector.x, vector.y))
      })

      var curve = new THREE.SplineCurve(da)
      var n = 700

      curve.getPoints(n).forEach(function (p, i) {
        if (i != 0 && i != n - 1) {
          geometry.vertices.push(new THREE.Vector3(p.x, p.y, -1.0))
        }
        geometry.vertices.push(new THREE.Vector3(p.x, p.y, -1.0))
      })


      // Store line data in segment...
      segment.line = line


    })
    lines.push(new LineVis(line))
  })


  return lines
}




class LineVis {
  constructor(line) {
    this.line = line
    this.color = this.line.material.color
  }

  dispose() {
    this.line.material.dispose()
    this.line.geometry.dispose()

    this.line = null
  }
}





class LineVisualization {
  constructor(segments, algorithms) {
    this.segments = segments
    this.algorithms = algorithms
    this.highlightIndices = null
  }

  dispose(scene) {
    this.meshes.forEach(mesh => {
      scene.remove(mesh.line)
      mesh.dispose()
    })
  }

  setZoom(zoom) {
    this.zoom = zoom

    if (this.highlightMeshes != null) {
      this.highlightMeshes.forEach(mesh => {
        mesh.material.lineWidth = 0.002 + 0.0001 * this.zoom
      })
    }
  }

  /**
   * Highlights the given lines that correspond to the indices
   *
   * @param {*} indices
   * @param {*} width
   * @param {*} height
   * @param {*} scene
   */
  highlight(indices, width, height, scene) {

    // Undo previous highlight
    if (this.highlightIndices != null) {
      this.highlightIndices.forEach(index => {
        this.meshes[index].line.visible = true
      })
      this.highlightMeshes.forEach(mesh => {
        mesh.material.dispose()
        mesh.geometry.dispose()
        scene.remove(mesh)
      })
    }

    this.highlightIndices = indices
    this.highlightMeshes = []
    this.highlightIndices.forEach(index => {
      this.meshes[index].line.visible = false

      var geometry = new THREE.Geometry();
      this.meshes[index].line.geometry.vertices.forEach((vertex, i) => {
        geometry.vertices.push(vertex)
      })


      var line = new Meshy.MeshLine();
      line.setGeometry(geometry, function (p) { return 1; });
      var material = new Meshy.MeshLineMaterial({
        color: new THREE.Color(this.meshes[index].color),
        resolution: new THREE.Vector2(width, height),
        lineWidth: 0.002 + 0.0001 * this.zoom,
        sizeAttenuation: true,
        transparent: true,
        opacity: 0.5,
        depthTest: false
      });

      var m = new THREE.Mesh(line.geometry, material)
      this.highlightMeshes.push(m);
      scene.add(m);
    })
  }


  createMesh() {
    var opacity = getLineOpacity(this.segments.length)
    var lines = []

    this.segments.forEach((segment, index) => {

      var geometry = new THREE.Geometry();
      var material = new THREE.LineBasicMaterial({
        color: this.algorithms[segment.vectors[0].algo].color,
        transparent: true,

        // Calculate opacity
        opacity: opacity
        // 1 - 1     100 - 0.1    200 - 0.05      50 - 0.2     25 - 0.4
      });
      var da = []
      segment.vectors.forEach(function (vector, vi) {
        vector.lineIndex = index
        da.push(new THREE.Vector2(vector.x, vector.y))
        //geometry.vertices.push(new THREE.Vector3(vector.x, vector.y, -1.0));
      })

      var curve = new THREE.SplineCurve(da)

      curve.getPoints(1000).forEach(function (p, i) {
        geometry.vertices.push(new THREE.Vector3(p.x, p.y, -1.0))
      })
      var line = new THREE.Line(geometry, material);

      // Store line data in segment...
      segment.line = line

      lines.push(new LineVis(line))
    })

    this.meshes = lines
    return lines
  }
}



class PointVisualization {
  constructor(settings) {
    this.settings = settings
    this.highlightIndex = null
    this.particleSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
  }

  createMesh(data, segments, algorithms) {
    this.segments = segments
    this.loaded = data

    var vertices = new THREE.Geometry().vertices;
    var positions = new Float32Array(data.length * 3);
    var colors = new Float32Array(data.length * 4);
    var sizes = new Float32Array(data.length);
    var types = new Float32Array(data.length);
    var show = new Float32Array(data.length)
    var vertex;
    var color = new THREE.Color();
    var i = 0

    segments.forEach(segment => {
      segment.vectors.forEach(vector => {
        vertices.push(new THREE.Vector3(vector.x, vector.y, 0.0))

        vertex = vertices[i];
        vertex.toArray(positions, i * 3);

        color.setHex(algorithms[data[i].algo].color);

        // Set the globalIndex which belongs to a specific vertex
        vector.globalIndex = i

        colors[i * 4] = color.r;
        colors[i * 4 + 1] = color.g;
        colors[i * 4 + 2] = color.b;
        colors[i * 4 + 3] = 1.0;

        show[i] = 1.0

        //color.toArray( colors, i * 4 );
        sizes[i] = this.particleSize;

        if (vector.age == 0) {
          // Starting point
          types[i] = 0
        } else if (vector.age == segment.vectors.length - 1) {
          // Ending point
          types[i] = 3
        } else {
          // Intermediate
          types[i] = 2
        }

        i++
      })
    })



    var pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 4));
    pointGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    pointGeometry.setAttribute('type', new THREE.BufferAttribute(types, 1));
    pointGeometry.setAttribute('show', new THREE.BufferAttribute(show, 1))

    //
    var pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        zoom: { value: 1.0 },
        color: { value: new THREE.Color(0xffffff) },
        scale: { value: 1.0 },
        pointTexture: {
          value: [
            new THREE.TextureLoader().load("textures/sprites/cross_texture.png"),
            new THREE.TextureLoader().load("textures/sprites/square_texture.png"),
            new THREE.TextureLoader().load("textures/sprites/circle_texture.png"),
            new THREE.TextureLoader().load("textures/sprites/star_texture.png")
          ]
        }
      },
      transparent: true,
      vertexShader: vertexShaders.pointSprite,
      fragmentShader: fragmentShaders.pointSprite,
      alphaTest: 0.05
    })

    this.mesh = new THREE.Points(pointGeometry, pointMaterial);

    this.sizeAttribute = this.mesh.geometry.attributes.size
  }

  setPointScaling(pointScaling) {
    this.mesh.material.uniforms.scale.value = pointScaling
  }


  /**
   * @param {*} category a feature to select the shape for
   */
  shapeCat(category) {
    var type = this.mesh.geometry.attributes.type.array

    // default shapes used
    if (category == null) {
      this.segments.forEach(segment => {
        segment.vectors.forEach(vector => {
          var shape = 2
          if (vector.age == 0) {
            // Starting point
            shape = 0
          } else if (vector.age == segment.vectors.length - 1) {
            // Ending point
            shape = 3
          } else if (vector.cp == 1) {
            // Checkpoint
            shape = 1
          } else {
            // Intermediate
            shape = 2
          }

          type[vector.globalIndex] = shape
        })
      })
    } else {
      var shapeDict = {
        circle: 2,
        star: 3,
        cross: 0,
        square: 1
      }

      if (category.type == 'categorical') {
        this.loaded.forEach((vector, index) => {
          var select = category.values.filter(value => value.value == vector[category.key])[0]
          type[index] = shapeDict[select.shapeType]
        })
      }
    }

    // mark types array to receive an update
    this.mesh.geometry.attributes.type.needsUpdate = true
  }

  colorCat(category) {


    if (category.type == 'categorical') {
      this.loaded.forEach((vector, index) => {
        var select = category.values.filter(value => value.value == vector[category.vectorKey])[0]
        var threeColor = new THREE.Color()
        threeColor.setHex(select.color);

        color[index * 4 + 0] = threeColor.r
        color[index * 4 + 1] = threeColor.g
        color[index * 4 + 2] = threeColor.b
        color[index * 4 + 3] = 1.0
      })
    }

    this.mesh.geometry.attributes.customColor.needsUpdate = true
  }

  transparencyCat(category) {
    var color = this.mesh.geometry.attributes.customColor.array

    if (category == null) {
      // default transparency
      this.segments.forEach(segment => {
        segment.vectors.forEach(vector => {
          color[vector.globalIndex * 4 + 3] = 1.0;
        })
      })
    } else {
      if (category.type == 'quantitative') {
        this.segments.forEach(segment => {
          var filtered = segment.vectors.map(vector => vector[category.key])
          var max = Math.max(...filtered)
          var min = Math.min(...filtered)
  
          segment.vectors.forEach(vector => {
            color[vector.globalIndex * 4 + 3] = category.values.range[0] + (category.values.range[1] - category.values.range[0]) * ((vector[category.key] - min) / (max - min))
          })
        })
      }
    }

    this.mesh.geometry.attributes.customColor.needsUpdate = true
  }

  sizeCat(category) {
    var size = this.mesh.geometry.attributes.size.array

    if (category == null) {
      this.loaded.forEach(vector => {
        size[vector.globalIndex] = this.particleSize
      })
    } else {
      this.segments.forEach(segment => {
        var filtered = segment.vectors.map(vector => vector[category.key])
        var max = Math.max(...filtered)
        var min = Math.min(...filtered)

        segment.vectors.forEach(vector => {
          size[vector.globalIndex] = this.particleSize * (category.values.range[0] + (category.values.range[1] - category.values.range[0]) * ((vector[category.key] - min) / (max - min)))
        })
      })
    }

    this.mesh.geometry.attributes.size.needsUpdate = true
  }

  update() {
    var i = 0
    var show = this.mesh.geometry.attributes.show.array

    this.segments.forEach(segment => {
      segment.vectors.forEach(vector => {
        if ((this.settings.showIntPoints || this.loaded[i].cp == 1 || vector.age == 0 || vector.age == segment.vectors.length - 1) && vector.visible) {
          //colors[i * 4 + 3] = 0.3 + (vector.age / segment.vectors.length) * 0.7;
          show[vector.globalIndex] = 1.0
        } else {
          //colors[i * 4 + 3] = 0.0
          show[vector.globalIndex] = 0.0
        }

        i++
      })
    })

    this.mesh.geometry.attributes.show.needsUpdate = true;
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



  /**
   * Cleans this object.
   */
  dispose() {
    this.segments = null
    this.loaded = null

    this.mesh.material.uniforms.pointTexture.value.forEach(tex => tex.dispose())

    this.mesh.geometry.dispose()
    this.mesh.material.dispose()

    this.mesh = null
  }
}










class ConvexHull {
  constructor(vectors) {
    this.vectors = vectors
  }

  createMesh() {
    this.geometry = new convex.ConvexBufferGeometry(this.vectors)
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    return this.mesh
  }
}




module.exports = {
  renderLines2: renderLines2,
  PointVisualization: PointVisualization,
  LineVisualization: LineVisualization,
  ConvexHull: ConvexHull
}
