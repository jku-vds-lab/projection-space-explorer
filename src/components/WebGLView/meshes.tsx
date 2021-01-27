import { valueInRange } from './UtilityFunctions'
import { ContinuousMapping } from "../Utility/Colors/ContinuousMapping"
import * as THREE from 'three'
import { DataLine } from "../Utility/Data/DataLine"
import { Vect } from "../Utility/Data/Vect"
import { Dataset } from "../Utility/Data/Dataset"
import { LayeringSystem } from './LayeringSystem/LayeringSystem'
import { StoriesType } from '../Ducks/StoriesDuck'

/**
 * Generates a line mesh
 */
var convex = require('three/examples/jsm/geometries/ConvexGeometry')

var fragmentShader = require('../../shaders/fragment.glsl')
var vertexShader = require('../../shaders/vertex.glsl')


var override = require('./meshline')

export enum Shapes {
  Circle = 'circle',
  Star = 'star',
  Square = 'square',
  Cross = 'cross'
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


class LineVis {
  line: any
  color: any

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
  segments: DataLine[]
  highlightIndices: any
  lineColorScheme: any
  meshes: any
  zoom: any
  highlightMeshes

  grayedLayerSystem: LayeringSystem

  constructor(segments, lineColorScheme) {
    this.segments = segments
    this.highlightIndices = null
    this.lineColorScheme = lineColorScheme

    this.grayedLayerSystem = new LayeringSystem(this.segments.length)

    // selection layer
    this.grayedLayerSystem.registerLayer(5, true)
    this.grayedLayerSystem.setLayerActive(5, false)

    // trace layer
    this.grayedLayerSystem.registerLayer(4, true)

    // storybook layer
    this.grayedLayerSystem.registerLayer(3, true)
  }

  setBrightness(brightness: number) {
    this.segments.forEach(segment => {
      segment.view.lineMesh.material.opacity = brightness / 100
    })
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
        mesh.material.lineWidth = 0.005
      })
    }
  }

  groupHighlight(indices) {
    if (indices != null && indices.length > 0) {
      this.grayedLayerSystem.setLayerActive(5, true)
      this.grayedLayerSystem.clearLayer(5, true)
      
      indices.forEach(index => {
        this.grayedLayerSystem.setValue(this.segments.findIndex(e => e.lineKey == index), 5, false)
      })
    } else {
      this.grayedLayerSystem.clearLayer(5, false)
      this.grayedLayerSystem.setLayerActive(5, false)
    }

    this.update()
  }




  storyTelling(stories: StoriesType) {
    if (stories && stories.active) {
      this.grayedLayerSystem.clearLayer(3, true)

      let lineIndices = new Set<number>()
      stories.active.clusters.forEach(cluster => {
        cluster.vectors.forEach(sample => {
          lineIndices.add(sample.view.lineIndex)
        })
      })
  
      lineIndices.forEach(lineIndex => {
        this.grayedLayerSystem.setValue(lineIndex, 3, false)
      })

      this.grayedLayerSystem.setLayerActive(3, true)
    } else {
      this.grayedLayerSystem.clearLayer(3, false)
      this.grayedLayerSystem.setLayerActive(3, false)
    }

    if (stories && stories.trace) {
      this.grayedLayerSystem.clearLayer(4, true)
      this.grayedLayerSystem.setLayerActive(4, true)

      let lineIndices = new Set<number>()
      stories.trace.mainPath.forEach(cluster => {
        cluster.vectors.forEach(sample => {
          lineIndices.add(sample.view.lineIndex)
        })
      })
  
      lineIndices.forEach(lineIndex => {
        this.grayedLayerSystem.setValue(lineIndex, 4, false)
      })
    } else {
      this.grayedLayerSystem.clearLayer(4, false)
      this.grayedLayerSystem.setLayerActive(4, false)
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
  highlight(indices, width, height, scene, grayout = false) {

    // Gray other lines if needed
    if (grayout) {
      this.groupHighlight(indices)
    }

    // Undo previous highlight
    if (this.highlightIndices != null) {
      this.highlightIndices.forEach(index => {
        this.segments.find(e => e.lineKey == index).view.highlighted = false
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
      var findSeg = this.segments.find(e => e.lineKey == index)
      findSeg.view.highlighted = true

      var geometry = new THREE.Geometry();
      findSeg.view.lineMesh.geometry.vertices.forEach((vertex, i) => {
        geometry.vertices.push(vertex)
      })


      var line = new override.MeshLine();
      line.setGeometry(geometry, function (p) { return 1; });
      var material = new override.MeshLineMaterial({
        color: new THREE.Color(findSeg.view.lineMesh.material.color),
        resolution: new THREE.Vector2(width, height),
        lineWidth: 0.005,
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


  createMesh(lineBrightness: number) {
    var lines = []

    this.segments.forEach((segment, index) => {

      segment.view.intrinsicColor = this.lineColorScheme.map(segment.vectors[0].algo)

      var geometry = new THREE.Geometry();
      var material = new THREE.LineBasicMaterial({
        color: segment.view.intrinsicColor.hex,
        transparent: true,

        // Calculate opacity
        opacity: lineBrightness / 100
        // 1 - 1     100 - 0.1    200 - 0.05      50 - 0.2     25 - 0.4
      });



      var da = []
      segment.vectors.forEach(function (vector, vi) {
        da.push(new THREE.Vector2(vector.x, vector.y))
        vector.view.lineIndex = index
      })

      var curve = new THREE.SplineCurve(da)

      curve.getPoints(700).forEach(function (p, i) {
        geometry.vertices.push(new THREE.Vector3(p.x, p.y, -1.0))
      })
      var line = new THREE.Line(geometry, material);

      // Store line data in segment...
      segment.view.lineMesh = line
      

      lines.push(new LineVis(line))
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

      segment.view.lineMesh.geometry.dispose()
      segment.view.lineMesh.geometry = geometry
      segment.view.lineMesh.geometry.verticesNeedUpdate = true
    })
  }


  /**
   * Updates visibility based on settings in the lines
   */
  update() {
    this.segments.forEach((segment, si) => {
      segment.view.lineMesh.material.color.setStyle(this.grayedLayerSystem.getValue(si) ? '#C0C0C0' : segment.view.intrinsicColor.hex)

      segment.view.lineMesh.visible = segment.view.detailVisible
        && segment.view.globalVisible
        && !segment.view.highlighted
        && valueInRange(segment.vectors.length, segment.view.pathLengthRange)
    })
  }
}



export class PointVisualization {
  highlightIndex: any
  particleSize: any
  vectorColorScheme: any
  dataset: Dataset
  showSymbols: any
  colorsChecked: any
  segments: DataLine[]
  vectors: Vect[]
  mesh: any
  sizeAttribute: any
  colorAttribute

  grayedLayerSystem: LayeringSystem
  lineLayerSystem: LayeringSystem

  constructor(vectorColorScheme, dataset, size, lineLayerSystem: LayeringSystem) {
    this.highlightIndex = null
    this.particleSize = size
    this.vectorColorScheme = vectorColorScheme
    this.dataset = dataset

    this.showSymbols = { 'cross': true, 'square': true, 'circle': true, 'star': true }
    this.colorsChecked = [true, true, true, true, true, true, true, true, true]

    this.grayedLayerSystem = new LayeringSystem(dataset.vectors.length)

    // selection layer
    this.grayedLayerSystem.registerLayer(5, true)
    this.grayedLayerSystem.setLayerActive(5, false)

    // trace layer
    this.grayedLayerSystem.registerLayer(4, true)

    // story layer
    this.grayedLayerSystem.registerLayer(3, true)
    

    this.lineLayerSystem = lineLayerSystem
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
    var i = 0

    if (this.dataset.isSequential) {
      segments.forEach(segment => {
        segment.vectors.forEach((vector, idx) => {
          new THREE.Vector3(vector.x, vector.y, 0.0).toArray(positions, i * 3);

          // Set the globalIndex which belongs to a specific vertex
          vector.view.meshIndex = i

          // Set segment information
          vector.view.segment = segment

          colors[i * 4] = 0;
          colors[i * 4 + 1] = 0;
          colors[i * 4 + 2] = 0;
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
    } else {
      this.vectors.forEach((vector, i) => {
        new THREE.Vector3(vector.x, vector.y, 0.0).toArray(positions, i * 3)

        vector.view.meshIndex = i
        colors[i * 4] = 0;
        colors[i * 4 + 1] = 0;
        colors[i * 4 + 2] = 0;
        colors[i * 4 + 3] = 1.0;

        selected[i] = 0.0;

        show[i] = 1.0
        vector.view.baseSize = this.particleSize
        types[i] = 2
        vector.view.shapeType = shapeFromInt(types[i])
        vector.view.highlighted = false
      })
    }




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



  hide() {

  }



  /**
   * Applies the gray-out effect on the particles based on the given story model
   * 
   * @param stories The story model
   */
  storyTelling(stories: StoriesType) {
    if (stories && stories.active) {
      this.grayedLayerSystem.setLayerActive(3, true)

      let vecIndices = new Set<number>()
      stories.active.clusters.forEach(cluster => {
        cluster.vectors.forEach(sample => {
          vecIndices.add(sample.view.meshIndex)
        })
      })

      vecIndices.forEach(value => {
        this.grayedLayerSystem.setValue(value, 3, false)
      })
    } else {
      this.grayedLayerSystem.setLayerActive(3, false)
    }


    if (stories && stories.trace) {
      this.grayedLayerSystem.clearLayer(4, true)
      this.grayedLayerSystem.setLayerActive(4, true)

      let vecIndices = new Set<number>()
      stories.trace.mainPath.forEach(cluster => {
        cluster.vectors.forEach(sample => {
          vecIndices.add(sample.view.meshIndex)
        })
      })

      vecIndices.forEach(value => {
        this.grayedLayerSystem.setValue(value, 4, false)
      })
    } else {
      this.grayedLayerSystem.clearLayer(4, false)
      this.grayedLayerSystem.setLayerActive(4, false)
    }
  }



  groupHighlight(samples: Vect[]) {
    if (samples && samples.length > 0) {
      this.grayedLayerSystem.clearLayer(5, true)
      this.grayedLayerSystem.setLayerActive(5, true)

      samples?.forEach(sample => {
        this.grayedLayerSystem.setValue(sample.view.meshIndex, 5, null)
      })
    } else {
      this.grayedLayerSystem.clearLayer(5, null)
      this.grayedLayerSystem.setLayerActive(5, false)
    }
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
      if (this.dataset.isSequential) {
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
        this.vectors.forEach(vector => {
          vector.view.shapeType = Shapes.Circle
          type[vector.view.meshIndex] = shapeToInt(vector.view.shapeType)
        })
      }

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
    //var color = this.mesh.geometry.attributes.customColor.array

    if (category == null) {
      // default transparency
      //this.vectors.forEach(vector => color[vector.view.meshIndex * 4 + 3] = 1.0)
      this.vectors.forEach(sample => sample.view.brightness = 1.0)
    } else {
      if (category.type == 'sequential') {

        if (this.dataset.isSequential) {
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
              vector.view.brightness = category.values.range[0] + (category.values.range[1] - category.values.range[0]) * ((vector[category.key] - min) / (max - min))
              //color[vector.view.meshIndex * 4 + 3] = category.values.range[0] + (category.values.range[1] - category.values.range[0]) * ((vector[category.key] - min) / (max - min))
            })
          })
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

          this.vectors.forEach(vector => {
            //color[vector.view.meshIndex * 4 + 3] = category.values.range[0] + (category.values.range[1] - category.values.range[0]) * ((vector[category.key] - min) / (max - min))
            vector.view.brightness = category.values.range[0] + (category.values.range[1] - category.values.range[0]) * ((vector[category.key] - min) / (max - min))
          })
        }
      }
    }

    this.updateColor()
  }

  sizeCat(category, range) {
    if (category == null) {
      this.vectors.forEach(vector => {
        vector.view.baseSize = this.particleSize * range[0]
      })
    } else {
      if (category.type == 'sequential') {
        if (this.dataset.isSequential) {
          // dataset with lines, we have segments
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
                vector.view.baseSize = this.particleSize * range[0]
              } else {
                vector.view.baseSize = this.particleSize * (range[0] + (range[1] - range[0]) * ((vector[category.key] - min) / (max - min)))
              }
            })
          })
        } else {
          // for state based data, min and max is based on whole dataset
          var min = null, max = null
          if (category.key in this.dataset.ranges) {
            min = this.dataset.ranges[category.key].min
            max = this.dataset.ranges[category.key].max
          } else {
            var filtered = this.vectors.map(vector => vector[category.key])
            max = Math.max(...filtered)
            min = Math.min(...filtered)
          }

          this.vectors.forEach(vector => {
            if (min == max) {
              vector.view.baseSize = this.particleSize * range[0]
            } else {
              vector.view.baseSize = this.particleSize * (range[0] + (range[1] - range[0]) * ((vector[category.key] - min) / (max - min)))
            }
          })
        }
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

      if (this.dataset.isSequential) {

        if (this.lineLayerSystem.getValue(vector.view.lineIndex)) {
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
            var col = vector.view.segment.view.lineMesh.material.color
            rgb = {
              r: col.r * 255.0,
              g: col.g * 255.0,
              b: col.b * 255.0
            }
            vector.view.intrinsicColor = null
          }
        }
      } else {
        if (this.grayedLayerSystem.getValue(vector.view.meshIndex)) {
          rgb = {
            r: 192.0,
            g: 192.0,
            b: 192.0
          }
        } else {
          if (this.colorAttribute != null) {
            var m = this.vectorColorScheme.map(vector[this.colorAttribute.key])
            rgb = m.rgb

            if (this.vectorColorScheme instanceof ContinuousMapping) {
              vector.view.intrinsicColor = null
            } else {
              vector.view.intrinsicColor = this.vectorColorScheme.index(vector[this.colorAttribute.key])
            }
          } else {
            rgb = { r: 0, g: 0, b: 0 }
          }
        }
      }

      color[i * 4 + 0] = rgb.r / 255.0
      color[i * 4 + 1] = rgb.g / 255.0
      color[i * 4 + 2] = rgb.b / 255.0

      if (this.dataset.isSequential) {
        if (this.lineLayerSystem.getValue(vector.view.lineIndex)) {
          color[i * 4 + 3] = vector.view.brightness * 0.4
        } else {
          color[i * 4 + 3] = vector.view.brightness
        }
      } else {
        if (this.grayedLayerSystem.getValue(vector.view.meshIndex)) {
          color[i * 4 + 3] = vector.view.brightness * 0.4
        } else {
          color[i * 4 + 3] = vector.view.brightness
        }
      }
    })

    this.mesh.geometry.attributes.customColor.needsUpdate = true
  }

  isPointVisible(vector: Vect) {
    return (vector.view.segment == null || vector.view.segment.view.detailVisible)
      && (vector.view.segment == null || vector.view.segment.view.globalVisible)
      && vector.view.visible
      && this.showSymbols[vector.view.shapeType]
      && (vector.view.intrinsicColor != null && this.colorsChecked != null ? this.colorsChecked[vector.view.intrinsicColor] : true)
      && (vector.view.segment == null || valueInRange(vector.view.segment.vectors.length, vector.view.segment.view.pathLengthRange))
      && !vector.view.lineUpFiltered
  }


  updatePosition() {
    var position = this.mesh.geometry.attributes.position.array

    this.vectors.forEach(vector => {
      let z = 0.0
      if ((!this.dataset.isSequential && this.grayedLayerSystem.getValue(vector.view.meshIndex)) || (this.dataset.isSequential && this.lineLayerSystem.getValue(vector.view.lineIndex))) {
        z = -0.1
      }
      new THREE.Vector3(vector.x, vector.y, z).toArray(position, vector.view.meshIndex * 3);
    })

    this.mesh.geometry.attributes.position.needsUpdate = true
  }


  update() {
    var show = this.mesh.geometry.attributes.show.array
    var selected = this.mesh.geometry.attributes.selected.array

    this.vectors.forEach(vector => {
      if (this.isPointVisible(vector)) {
        show[vector.view.meshIndex] = 1.0
      } else {
        show[vector.view.meshIndex] = 0.0
      }
      selected[vector.view.meshIndex] = vector.view.selected ? 1.0 : 0.0
    })

    //this.updateColor()
    this.updateSize()
    this.updatePosition()

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
  vectors: any
  geometry: any
  material: any
  mesh: any

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