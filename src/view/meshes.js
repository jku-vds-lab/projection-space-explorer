/**
 * Generates a line mesh
 */
var THREE = require('three')
var convex = require('three/examples/jsm/geometries/ConvexGeometry')


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

     curve.getPoints(10000).forEach(function(p, i) {
       geometry.vertices.push(new THREE.Vector3(p.x, p.y, -1.0))
     })
     var line = new THREE.Line( geometry, material );

     // Store line data in segment...
     segment.line = line

     lines.push(new LineVis(line))
   })

   return lines
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

     var line = new THREE.LineSegments( geometry, material );

     segments.filter(e => e.algo == key || e.algo == undefined).forEach(function(segment, index) {

       var da = []
       segment.vectors.forEach(function(vector, vi) {
         da.push(new THREE.Vector2(vector.x, vector.y))
       })

       var curve = new THREE.SplineCurve(da)
       var n = 700

       curve.getPoints(n).forEach(function(p, i) {
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
   }

   dispose() {
     this.line.material.dispose()
     this.line.geometry.dispose()

     this.line = null
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
     pointGeometry.setAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
     pointGeometry.setAttribute( 'customColor', new THREE.BufferAttribute( colors, 4 ) );
     pointGeometry.setAttribute( 'size', new THREE.BufferAttribute( sizes, 1 ) );
     pointGeometry.setAttribute( 'type', new THREE.BufferAttribute( types, 1 ) );

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

     this.segments.forEach(segment => {
       segment.vectors.forEach(vector => {
         if ((this.settings.showIntPoints || this.loaded[i].cp == 1 || vector.age == 0 || vector.age == segment.vectors.length - 1) && vector.visible) {
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
    console.log(convex)
    this.geometry = new convex.ConvexBufferGeometry(this.vectors)
    this.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    this.mesh = new THREE.Mesh(this.geometry, this.material)

    return this.mesh
  }
}








module.exports = {
  renderLines2: renderLines2,
  PointVisualization: PointVisualization,
  ConvexHull: ConvexHull
}
