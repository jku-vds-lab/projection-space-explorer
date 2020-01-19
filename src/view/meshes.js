/**
 * Generates a line mesh
 */
var convex = require('three/examples/jsm/geometries/ConvexGeometry')

var fragmentShaders = require('./fragmentshaders')
var vertexShaders = require('./vertexshaders')
var Meshy = require('three.meshline');

import { SequentialColorScheme, DefaultVectorColorScheme, DivergingColorScheme } from '../util/colors'


var Shapes = {
  CIRCLE: "circle",
  STAR: "star",
  SQUARE: "square",
  CROSS: "cross",

  fromInt: function (value) {
    if (value == 0) {
      return Shapes.CROSS
    }
    if (value == 1) {
      return Shapes.SQUARE
    }
    if (value == 2) {
      return Shapes.CIRCLE
    }
    if (value == 3) {
      return Shapes.STAR
    }
  },

  toInt: function (value) {
    const mapping = {
      "cross": 0,
      "square": 1,
      "circle": 2,
      "star": 3
    }

    return mapping[value]
  }
}

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





export class LineVisualization {
  constructor(segments, lineColorScheme) {
    this.segments = segments
    this.highlightIndices = null
    this.lineColorScheme = lineColorScheme
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
        color: this.lineColorScheme.map(segment.vectors[0].algo).hex,
        transparent: true,

        // Calculate opacity
        opacity: opacity
        // 1 - 1     100 - 0.1    200 - 0.05      50 - 0.2     25 - 0.4
      });
      var da = []
      segment.vectors.forEach(function (vector, vi) {
        vector.lineIndex = index
        da.push(new THREE.Vector2(vector.x, vector.y))
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



export class PointVisualization {
  constructor(vectorColorScheme) {
    this.highlightIndex = null
    this.particleSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    this.vectorColorScheme = vectorColorScheme
    this.showSymbols = { 'cross': true, 'square': true, 'circle': true, 'star': true }
  }

  createMesh(data, segments) {
    this.segments = segments
    this.vectors = data

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

        color.setHex(this.vectorColorScheme.map(data[i].algo).hex);

        // Set the globalIndex which belongs to a specific vertex
        vector.globalIndex = i

        colors[i * 4] = color.r;
        colors[i * 4 + 1] = color.g;
        colors[i * 4 + 2] = color.b;
        colors[i * 4 + 3] = 1.0;

        show[i] = 1.0

        //color.toArray( colors, i * 4 );
        vector.baseSize = this.particleSize

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
        vector.shapeType = Shapes.fromInt(types[i])
        vector.highlighted = false

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
          } else {
            // Intermediate
            shape = 2
          }

          vector.shapeType = Shapes.fromInt(shape)
          type[vector.globalIndex] = shape
        })
      })
    } else {
      if (category.type == 'categorical') {
        this.vectors.forEach((vector, index) => {
          var select = category.values.filter(value => value.from == vector[category.key])[0]
          type[index] = Shapes.toInt(select.to)
          vector.shapeType = select.to
        })
      }
    }

    // mark types array to receive an update
    this.mesh.geometry.attributes.type.needsUpdate = true
  }

  colorCat(category) {
    this.colorAttribute = category

    if (category == null) {
      this.vectorColorScheme = new DefaultVectorColorScheme().createMapping([... new Set(this.vectors.map(vector => vector.algo))])
    } else {
      if (category.type == 'categorical') {
        this.vectorColorScheme = new DefaultVectorColorScheme().createMapping(category.values)
      }
      if (category.type == 'sequential') {
        this.vectorColorScheme = new SequentialColorScheme().createMapping(category.range)
      }
      if (category.type == 'diverging') {
        this.vectorColorScheme = new DivergingColorScheme().createMapping(category.range)
      }
    }

    this.updateColor()
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
      this.vectors.forEach(vector => {
        vector.baseSize = this.particleSize
      })
    } else {
      if (category.type == 'quantitative') {
        this.segments.forEach(segment => {
          var filtered = segment.vectors.map(vector => vector[category.key])
          var max = Math.max(...filtered)
          var min = Math.min(...filtered)
  
          segment.vectors.forEach(vector => {
            vector.baseSize = this.particleSize * (category.values.range[0] + (category.values.range[1] - category.values.range[0]) * ((vector[category.key] - min) / (max - min)))
          })
        })
      }
      if (category.type == 'categorical') {
        this.vectors.forEach(vector => {
          vector.baseSize = this.particleSize * category.values.filter(v => v.from == vector[category.key])[0].to
        })
      }
    }

    this.mesh.geometry.attributes.size.needsUpdate = true

    this.updateSize()
  }

  updateSize() {
    var size = this.mesh.geometry.attributes.size.array

    this.vectors.forEach(vector => {
      size[vector.globalIndex] = vector.baseSize * (vector.highlighted ? 2.0 : 1.0)
    })

    this.mesh.geometry.attributes.size.needsUpdate = true
  }

  updateColor() {
    if (this.vectorColorScheme == null) {
      return null
    }

    var color = this.mesh.geometry.attributes.customColor.array

    this.vectors.forEach(vector => {
      var i = vector.globalIndex
      var rgb = null
      if (this.colorAttribute != null) {
        rgb = this.vectorColorScheme.map(vector[this.colorAttribute.key]).rgb
      } else {
        rgb = this.vectorColorScheme.map(vector.algo).rgb
      }
      
      

      color[i * 4 + 0] = rgb.r / 255.0;
      color[i * 4 + 1] = rgb.g / 255.0;
      color[i * 4 + 2] = rgb.b / 255.0;
      color[i * 4 + 3] = 1.0;
    })

    this.mesh.geometry.attributes.customColor.needsUpdate = true
  }

  update() {
    var i = 0
    var show = this.mesh.geometry.attributes.show.array

    this.segments.forEach(segment => {
      segment.vectors.forEach(vector => {
        if (vector.visible
          && this.showSymbols[vector.shapeType]) {
          //colors[i * 4 + 3] = 0.3 + (vector.age / segment.vectors.length) * 0.7;
          show[vector.globalIndex] = 1.0
        } else {
          //colors[i * 4 + 3] = 0.0
          show[vector.globalIndex] = 0.0
        }

        i++
      })
    })

    this.updateColor()
    this.updateSize()

    this.mesh.geometry.attributes.show.needsUpdate = true;
  }

  /**
   * Highlights a specific point index.
   */
  highlight(index) {
    if (this.highlightIndex != null && this.highlightIndex >= 0) {
      this.vectors[this.highlightIndex].highlighted = false
      //this.sizeAttribute.array[this.highlightIndex] = this.particleSize
    }

    this.highlightIndex = index

    if (this.highlightIndex != null && this.highlightIndex >= 0) {
      this.vectors[this.highlightIndex].highlighted = true
      //this.sizeAttribute.array[this.highlightIndex] = this.particleSize * 2
      //this.sizeAttribute.needsUpdate = true
    }

    this.updateSize()
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
    this.vectors = null

    this.mesh.material.uniforms.pointTexture.value.forEach(tex => tex.dispose())

    this.mesh.geometry.dispose()
    this.mesh.material.dispose()

    this.mesh = null
  }
}










export class ConvexHull {
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
