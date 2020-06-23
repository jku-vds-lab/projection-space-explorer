import { valueInRange } from './utilfunctions'
import { ContinuousMapping } from '../util/colors'
import * as THREE from 'three'

/**
 * Generates a line mesh
 */
var convex = require('three/examples/jsm/geometries/ConvexGeometry')

var fragmentShader = require('../../shaders/fragment.glsl')
var vertexShader = require('../../shaders/vertex.glsl')


var override = require('./meshline')

export enum Shapes {
  Circle= 'circle',
  Star='star',
  Square='square',
  Cross='cross'
}


export function imageFromShape(value) {
  switch (value) {
    case Shapes.Cross:
      return "./textures/sprites/cross.png"
    case Shapes.Square:
      return "./textures/sprites/square.png"
    case Shapes.Circle:
      return "./textures/sprites/circle.png"
    case Shapes.Star:
      return "./textures/sprites/star.png"
  }
}

function shapeFromInt(value) {
  if (value == 0) {
    return Shapes.Cross
  }
  if (value == 1) {
    return Shapes.Square
  }
  if (value == 2) {
    return Shapes.Circle
  }
  if (value == 3) {
    return Shapes.Star
  }
}

function shapeToInt(value) {
  switch (value) {
    case Shapes.Cross:
      return 0
    case Shapes.Square:
      return 1
    case Shapes.Circle:
      return 2
    case Shapes.Star:
      return 3
  }
}

function shapeToString(value) {
  switch (value) {
    case Shapes.Cross:
      return 'cross'
    case Shapes.Square:
      return 'square'
    case Shapes.Circle:
      return 'circle'
    case Shapes.Star:
      return 'star'
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

  groupHighlight(indices) {
    if (indices != null && indices.length > 0) {
      this.segments.forEach(segment => {
        segment.view.grayed = true
      })



      indices.forEach(index => {
        this.segments[index].view.grayed = false
      })
    } else {
      this.segments.forEach(segment => {
        segment.view.grayed = false
      })
    }

    this.update()
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
        this.segments[index].view.highlighted = false
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
      this.segments[index].view.highlighted = true

      var geometry = new THREE.Geometry();
      this.meshes[index].line.geometry.vertices.forEach((vertex, i) => {
        geometry.vertices.push(vertex)
      })


      var line = new override.MeshLine();
      line.setGeometry(geometry, function (p) { return 1; });
      var material = new override.MeshLineMaterial({
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

    this.update()
  }


  createMesh() {
    var opacity = getLineOpacity(this.segments.length)
    var lines = []

    this.segments.forEach((segment, index) => {

      segment.view.intrinsicColor = this.lineColorScheme.map(segment.vectors[0].algo)

      var geometry = new THREE.Geometry();
      var material = new THREE.LineBasicMaterial({
        color: segment.view.intrinsicColor.hex,
        transparent: true,

        // Calculate opacity
        opacity: opacity
        // 1 - 1     100 - 0.1    200 - 0.05      50 - 0.2     25 - 0.4
      });



      var da = []
      segment.vectors.forEach(function (vector, vi) {
        da.push(new THREE.Vector2(vector.x, vector.y))
      })

      var curve = new THREE.SplineCurve(da)

      curve.getPoints(700).forEach(function (p, i) {
        geometry.vertices.push(new THREE.Vector3(p.x, p.y, -1.0))
      })
      var line = new THREE.Line(geometry, material);

      // Store line data in segment...
      segment.line = line

      lines.push(new LineVis(line))

      segment.vectors.forEach(vector => {
        vector.view.lineIndex = index
      })
    })

    this.meshes = lines
    return lines
  }


  updatePosition() {
    this.segments.forEach((segment, index) => {
      var da = []

      segment.vectors.forEach(function (vector, vi) {
        da.push(new THREE.Vector2(vector.x, vector.y))
      })

      var geometry = new THREE.Geometry();
      var curve = new THREE.SplineCurve(da)


      curve.getPoints(700).forEach(function (p, i) {
        geometry.vertices.push(new THREE.Vector3(p.x, p.y, -1.0))
      })

      segment.line.geometry.dispose()
      segment.line.geometry = geometry
      segment.line.geometry.verticesNeedUpdate = true
    })
  }


  /**
   * Updates visibility based on settings in the lines
   */
  update() {


    this.segments.forEach(segment => {

      segment.line.material.color.setStyle(segment.view.grayed ? '#C0C0C0' : segment.view.intrinsicColor.hex)

      segment.line.visible = segment.view.detailVisible
        && segment.view.globalVisible
        && !segment.view.highlighted
        && valueInRange(segment.vectors.length, segment.view.pathLengthRange)
    })
  }
}



export class PointVisualization {
  constructor(vectorColorScheme, dataset) {
    this.highlightIndex = null
    this.particleSize = parseFloat(getComputedStyle(document.documentElement).fontSize)
    this.vectorColorScheme = vectorColorScheme
    this.dataset = dataset
    
    this.showSymbols = { 'cross': true, 'square': true, 'circle': true, 'star': true }
    this.colorsChecked = [true, true, true, true, true, true, true, true, true]
  }

  createMesh(data, segments) {
    this.segments = segments
    this.vectors = data



    var positions = new Float32Array(data.length * 3);
    var colors = new Float32Array(data.length * 4);
    var sizes = new Float32Array(data.length);
    var types = new Float32Array(data.length);
    var show = new Float32Array(data.length)
    var selected = new Float32Array(data.length);
    var vertex;
    var color = new THREE.Color();
    var i = 0

    segments.forEach(segment => {
      segment.vectors.forEach((vector, idx) => {
        new THREE.Vector3(vector.x, vector.y, 0.0).toArray(positions, i * 3);

        color.setHex('#000000');

        // Set the globalIndex which belongs to a specific vertex
        vector.view.meshIndex = i

        // Set segment information
        vector.view.segment = segment

        colors[i * 4] = color.r;
        colors[i * 4 + 1] = color.g;
        colors[i * 4 + 2] = color.b;
        colors[i * 4 + 3] = 1.0;

        selected[i] = 0.0;

        show[i] = 1.0

        //color.toArray( colors, i * 4 );
        vector.view.baseSize = this.particleSize

        if (vector.age == 0) {
          // Starting point
          types[i] = 0
        } else if (idx == segment.vectors.length - 1) {
          // Ending point
          types[i] = 3
        } else {
          // Intermediate
          types[i] = 2
        }
        vector.view.shapeType = shapeFromInt(types[i])
        vector.view.highlighted = false

        i++
      })
    })



    var pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointGeometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 4));
    pointGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    pointGeometry.setAttribute('type', new THREE.BufferAttribute(types, 1));
    pointGeometry.setAttribute('show', new THREE.BufferAttribute(show, 1))
    pointGeometry.setAttribute('selected', new THREE.BufferAttribute(selected, 1))

    //
    var pointMaterial = new THREE.ShaderMaterial({
      uniforms: {
        zoom: { value: 1.0 },
        color: { value: new THREE.Color(0xffffff) },
        scale: { value: 1.0 },
        atlas: {
          value: new THREE.TextureLoader().load("textures/sprites/atlas.png")
        }
      },
      transparent: true,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
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
        segment.vectors.forEach((vector, index) => {
          var shape = 2
          if (vector.age == 0) {
            // Starting point
            shape = 0
          } else if (index == segment.vectors.length - 1) {
            // Ending point
            shape = 3
          } else {
            // Intermediate
            shape = 2
          }

          vector.view.shapeType = shapeFromInt(shape)
          type[vector.view.meshIndex] = shape
        })
      })
    } else {
      if (category.type == 'categorical') {
        this.vectors.forEach((vector, index) => {
          var select = category.values.filter(value => value.from == vector[category.key])[0]
          type[index] = shapeToInt(select.to)
          vector.view.shapeType = select.to
        })
      }
    }

    // mark types array to receive an update
    this.mesh.geometry.attributes.type.needsUpdate = true
  }

  colorCat(category, scale) {
    this.colorAttribute = category

    if (category == null) {
      this.vectorColorScheme = null
      //this.vectorColorScheme = new DefaultVectorColorScheme().createMapping([... new Set(this.vectors.map(vector => vector.algo))])
    } else {
      if (category.type == 'categorical') {
        this.vectorColorScheme = scale
        //this.vectorColorScheme = new DiscreteMapping(scale, [... new Set(this.vectors.map(vector => vector[category.key]))])
      } else {
        var min = null, max = null
        if (category.key in this.dataset.ranges) {
          min = this.dataset.ranges[category.key].min
          max = this.dataset.ranges[category.key].max
        } else {
          var filtered = this.vectors.map(vector => vector[category.key])
          max = Math.max(...filtered)
          min = Math.min(...filtered)
        }

        if (category.type != 'categorical') {

          this.vectorColorScheme = scale
          //this.vectorColorScheme = new ContinuousMapping(scale, { min: min, max: max })
        }
      }
    }

    this.updateColor()
  }

  colorFilter(colorsChecked) {
    this.colorsChecked = colorsChecked

    this.update()
  }

  getMapping() {
    return this.vectorColorScheme
  }

  setColorScale(colorScale) {
    if (this.vectorColorScheme != null) {
      this.vectorColorScheme.scale = colorScale
    }
  }

  transparencyCat(category) {
    var color = this.mesh.geometry.attributes.customColor.array

    if (category == null) {
      // default transparency
      this.segments.forEach(segment => {
        segment.vectors.forEach(vector => {
          color[vector.view.meshIndex * 4 + 3] = 1.0;
        })
      })
    } else {
      if (category.type == 'sequential') {
        this.segments.forEach(segment => {
          var min = null, max = null
          if (category.key in this.dataset.ranges) {
            min = this.dataset.ranges[category.key].min
            max = this.dataset.ranges[category.key].max
          } else {
            var filtered = segment.vectors.map(vector => vector[category.key])
            max = Math.max(...filtered)
            min = Math.min(...filtered)
          }

          segment.vectors.forEach(vector => {
            color[vector.view.meshIndex * 4 + 3] = category.values.range[0] + (category.values.range[1] - category.values.range[0]) * ((vector[category.key] - min) / (max - min))
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
        vector.view.baseSize = this.particleSize
      })
    } else {
      if (category.type == 'sequential') {
        this.segments.forEach(segment => {
          var min = null, max = null
          if (category.key in this.dataset.ranges) {
            min = this.dataset.ranges[category.key].min
            max = this.dataset.ranges[category.key].max
          } else {
            var filtered = segment.vectors.map(vector => vector[category.key])
            max = Math.max(...filtered)
            min = Math.min(...filtered)
          }



          segment.vectors.forEach(vector => {
            if (min == max) {
              vector.view.baseSize = this.particleSize * category.values.range[0]
            } else {
              vector.view.baseSize = this.particleSize * (category.values.range[0] + (category.values.range[1] - category.values.range[0]) * ((vector[category.key] - min) / (max - min)))
            }
          })
        })
      }
      if (category.type == 'categorical') {
        this.vectors.forEach(vector => {
          vector.view.baseSize = this.particleSize * category.values.filter(v => v.from == vector[category.key])[0].to
        })
      }
    }

    this.mesh.geometry.attributes.size.needsUpdate = true

    this.updateSize()
  }

  updateSize() {
    var size = this.mesh.geometry.attributes.size.array

    this.vectors.forEach(vector => {
      size[vector.view.meshIndex] = vector.view.baseSize * (vector.view.highlighted ? 2.0 : 1.0) * (vector.view.selected ? 1.2 : 1.0)
    })

    this.mesh.geometry.attributes.size.needsUpdate = true
  }

  updateColor() {
    var color = this.mesh.geometry.attributes.customColor.array

    this.vectors.forEach(vector => {
      var i = vector.view.meshIndex
      var rgb = null

      if (vector.view.segment.view.grayed) {
        rgb = {
          r: 192.0,
          g: 192.0,
          b: 192.0
        }
      } else {
        if (this.colorAttribute != null) {
          var m = this.vectorColorScheme.map(vector[this.colorAttribute.key])
          rgb = m.rgb
          //vector.view.intrinsicColor = this.vectorColorScheme.scale.stops.indexOf(m)

          if (this.vectorColorScheme instanceof ContinuousMapping) {
            vector.view.intrinsicColor = null
          } else {
            vector.view.intrinsicColor = this.vectorColorScheme.index(vector[this.colorAttribute.key])
          }

        } else {
          var col = this.segments[vector.view.lineIndex].line.material.color
          rgb = {
            r: col.r * 255.0,
            g: col.g * 255.0,
            b: col.b * 255.0
          }
          vector.view.intrinsicColor = null
        }
      }





      color[i * 4 + 0] = rgb.r / 255.0
      color[i * 4 + 1] = rgb.g / 255.0
      color[i * 4 + 2] = rgb.b / 255.0
    })

    this.mesh.geometry.attributes.customColor.needsUpdate = true
  }

  isPointVisible(vector) {
    return this.segments[vector.view.lineIndex].view.detailVisible
      && this.segments[vector.view.lineIndex].view.globalVisible
      && vector.view.visible
      && this.showSymbols[vector.view.shapeType]
      && (vector.view.intrinsicColor != null && this.colorsChecked != null ? this.colorsChecked[vector.view.intrinsicColor] : true)
      && valueInRange(this.segments[vector.view.lineIndex].vectors.length, this.segments[vector.view.lineIndex].view.pathLengthRange)
  }


  updatePosition() {
    var position = this.mesh.geometry.attributes.position.array

    this.vectors.forEach(vector => {
      new THREE.Vector3(vector.x, vector.y, 0.0).toArray(position, vector.view.meshIndex * 3);
    })

    this.mesh.geometry.attributes.position.needsUpdate = true
  }


  update() {
    var show = this.mesh.geometry.attributes.show.array
    var selected = this.mesh.geometry.attributes.selected.array

    this.segments.forEach(segment => {
      segment.vectors.forEach(vector => {
        if (this.isPointVisible(vector)) {
          show[vector.view.meshIndex] = 1.0
        } else {
          show[vector.view.meshIndex] = 0.0
        }
        selected[vector.view.meshIndex] = vector.view.selected ? 1.0 : 0.0
      })
    })

    this.updateColor()
    this.updateSize()

    this.mesh.geometry.attributes.show.needsUpdate = true;
    this.mesh.geometry.attributes.selected.needsUpdate = true
  }

  /**
   * Highlights a specific point index.
   */
  highlight(index) {
    if (this.highlightIndex != null && this.highlightIndex >= 0) {
      this.vectors[this.highlightIndex].view.highlighted = false
    }

    this.highlightIndex = index

    if (this.highlightIndex != null && this.highlightIndex >= 0) {
      this.vectors[this.highlightIndex].view.highlighted = true
    }

    this.updateSize()
  }



  /**
   * Updates the zoom level.
   */
  zoom(zoom) {
    this.mesh.material.uniforms.zoom.value = zoom * this.dataset.bounds.scaleFactor
  }



  /**
   * Cleans this object.
   */
  dispose() {
    this.segments = null
    this.vectors = null

    this.mesh.material.uniforms.atlas.value.dispose()

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










/**
 * Class that stores mesh information about clusters.
 */
export class ClusterVisualization {
  /**
   * Construct new ClusterVisualization by passing a list of meshes.
   */
  constructor(clusterMeshes, lineMeshes) {
    this.clusterMeshes = clusterMeshes
    this.lineMeshes = lineMeshes
  }

  /**
   * Disposes this object, freeing all resources
   */
  dispose(scene) {
    if (this.clusterMeshes != null) {
      this.clusterMeshes.forEach(mesh => {
        mesh.geometry.dispose()
        mesh.material.dispose()
        scene.remove(mesh)
      })
    }
    if (this.lineMeshes != null) {
      this.lineMeshes.forEach(mesh => {
        mesh.geometry.dispose()
        mesh.material.dispose()
        scene.remove(mesh)
      })
    }
  }
}