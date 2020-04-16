import concaveman from 'concaveman'
import libtess from 'libtess'
import { isPointInConvaveHull } from '../util/geometry';



/*global libtess */
/* exported triangulate */

var tessy = (function initTesselator() {
    // function called for each vertex of tesselator output
    function vertexCallback(data, polyVertArray) {
        // console.log(data[0], data[1]);
        polyVertArray[polyVertArray.length] = data[0];
        polyVertArray[polyVertArray.length] = data[1];
    }
    function begincallback(type) {
        if (type !== libtess.primitiveType.GL_TRIANGLES) {
            console.log('expected TRIANGLES but got type: ' + type);
        }
    }
    function errorcallback(errno) {
        console.log('error callback');
        console.log('error number: ' + errno);
    }
    // callback for when segments intersect and must be split
    function combinecallback(coords, data, weight) {
        // console.log('combine callback');
        return [coords[0], coords[1], coords[2]];
    }
    function edgeCallback(flag) {
        // don't really care about the flag, but need no-strip/no-fan behavior
        // console.log('edge flag: ' + flag);
    }

    var tessy = new libtess.GluTesselator();
    // tessy.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_POSITIVE);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);
    tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);

    return tessy;
})();

function triangulate(contours) {
    // libtess will take 3d verts and flatten to a plane for tesselation
    // since only doing 2d tesselation here, provide z=1 normal to skip
    // iterating over verts only to get the same answer.
    // comment out to test normal-generation code
    tessy.gluTessNormal(0, 0, 1);

    var triangleVerts = [];
    tessy.gluTessBeginPolygon(triangleVerts);

    for (var i = 0; i < contours.length; i++) {
        tessy.gluTessBeginContour();
        var contour = contours[i];
        for (var j = 0; j < contour.length; j += 2) {
            var coords = [contour[j], contour[j + 1], 0];
            tessy.gluTessVertex(coords, coords);
        }
        tessy.gluTessEndContour();
    }

    // finish polygon (and time triangulation process)
    var startTime = new Date().getTime();
    tessy.gluTessEndPolygon();
    var endTime = new Date().getTime();

    return triangleVerts;
}


export class Cluster {
    constructor(points, bounds, hull, triangulation) {
        this.points = points
        this.bounds = bounds
        this.hull = hull
        this.triangulation = triangulation
    }

    containsPoint(coords) {
        var x = coords.x
        var y = coords.y
        if (x > this.bounds.minX && x < this.bounds.maxX && y < this.bounds.maxY && y > this.bounds.minY) {
            return true
        }

        return false
    }

    getCenter() {
        var x = 0
        var y = 0

        this.points.forEach(p => {
            x = x + p.x
            y = y + p.y
        })

        return {
            x: x / this.points.length,
            y: y / this.points.length
        }
    }

    getProbability() {
        var avg = 0
        this.points.forEach(p => {
            avg = avg + p.probability
        })
        return avg / this.points.length
    }

    getSTD() {
        var center = this.getCenter()
        var std = 0

        this.points.forEach(p => {
            std = std + Math.sqrt(((p.x - center.x) * (p.x - center.x)) + ((p.y - center.y) * (p.y - center.y)))
        })

        return std / this.points.length
    }


    meanScore() {
        var avg = 0
        this.points.forEach(p => {
            avg = avg + p.score
        })
        console.log(this.points)
        return avg / this.points.length
    }



    metaGrade() {
        return this.points.length / 10 + this.getProbability() - this.getSTD()
    }
}


/**
 * Create cluster structures from raw data.
 */
function processClusters(raw, xy) {


    var clusters = {}
    raw.forEach((entry, index) => {
        var x = xy[index][0]
        var y = xy[index][1]

        const [label, probability, score] = entry
        if (!(label in clusters)) {
            clusters[label] = { points: [] }
        }

        clusters[label].points.push({
            label: label,
            probability: probability,
            meshIndex: index,
            x: x,
            y: y,
            score: score
        })
    })

    return clusters
}




/**
 * Clustering endpoint that
 */
self.addEventListener('message', function (e) {
    var xy = e.data

    fetch('http://localhost:8090/hdbscan', {
        method: 'POST',
        body: JSON.stringify(xy)
    }).then(response => {
        response.json().then(values => {
            // Get clusters
            var clusters = processClusters(values.result, xy)

            Object.keys(clusters).forEach(key => {
                if (key == -1) return;
                var cluster = clusters[key]

                var bounds = {
                    minX: 10000,
                    maxX: -10000,
                    minY: 10000,
                    maxY: -10000
                }

                cluster.bounds = bounds

                var pts = cluster.points.filter(e => e.probability > 0.7).map(e => {
                    var x = xy[e.meshIndex][0]
                    var y = xy[e.meshIndex][1]

                    if (x < bounds.minX) bounds.minX = x
                    if (x > bounds.maxX) bounds.maxX = x
                    if (y < bounds.minY) bounds.minY = y
                    if (y > bounds.maxY) bounds.maxY = y

                    return [x, y]
                })


                // Get hull of cluster
                var polygon = concaveman(pts);

                // Get triangulated hull for cluster
                var triangulated = triangulate([polygon.flat()])



                cluster.hull = polygon
                cluster.triangulation = triangulated
            })

            self.postMessage(clusters)
        })
    })
})















// OLD code that uses C++ and WebAssembly, only here for completeness
/**self.importScripts('test.js')


self.addEventListener('message', function (e) {

    var sab = e.data
    const vectorArray = new Float32Array(sab)

    var nVec = vectorArray.length / 2


    // Allocate some space in the heap for the data (making sure to use the appropriate memory size of the elements)
    var buffer = Module._malloc(vectorArray.length * vectorArray.BYTES_PER_ELEMENT)

    // Output buffer for labels
    var outLabel = Module._malloc(nVec * 4)

    // Output buffer for probabilities
    var outProbs = Module._malloc(nVec * 4)

    // Assign the data to the heap - Keep in mind bytes per element
    Module.HEAPF32.set(vectorArray, buffer >> 2)

    // Finally, call the function with "number" parameter type for the array (the pointer), and an extra length parameter
    var js_wrapped_fib = Module.cwrap("cluster", "number", ["number", "number", "number", "number", "number", "number"]);
    console.log("STARTING")
    js_wrapped_fib(buffer, vectorArray.length, outLabel, nVec, outProbs, nVec)

    var labels = Module.HEAP32.subarray(outLabel / 4, outLabel / 4 + nVec)
    var probabilities = Module.HEAPF32.subarray(outProbs / 4, outProbs / 4 + nVec)

    self.postMessage({
        labels: labels,
        probabilities: probabilities
    })
})**/
