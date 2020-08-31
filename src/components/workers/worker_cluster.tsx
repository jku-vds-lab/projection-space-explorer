import * as concaveman from 'concaveman'
import * as libtess from 'libtess'
import { isNumber } from 'util';

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










function validKey(key: string) {
    if (isNumber(key) && key < 0) {
        return false
    }

    return true
}

/**
 * Clustering endpoint that
 */
self.addEventListener('message', function (e) {

    if (e.data.type == 'point') {
        var xy = e.data.load

        fetch('http://localhost:8090/hdbscan', {
            method: 'POST',
            body: JSON.stringify(xy)
        }).then(response => {
            response.json().then(values => {
                // Get clusters
                var clusters = processClusters(values.result, xy)

                Object.keys(clusters).forEach(key => {
                    if (!validKey(key)) return;
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

                let context = self as any
                context.postMessage(clusters)
            })
        })
    } else if (e.data.type == 'segment') {
        var xy = e.data.load

        fetch('http://localhost:8090/segmentation', {
            method: 'POST',
            body: JSON.stringify(xy)
        }).then(response => {
            let context = self as any
            response.json().then(values => {
                context.postMessage(values)
            })
        })
    } else if (e.data.type == 'extract') {
        // From input data [ [label], [label]... ] generate the clusters with triangulation
        var clusters = {}

        e.data.message.forEach((vector, index) => {
            const [x, y, labels] = vector

            labels.forEach(label => {
                // If we have a new
                if (!(label in clusters)) {
                    clusters[label] = { points: [] }
                }

                clusters[label].points.push({
                    label: label,
                    probability: 1.0,
                    meshIndex: index,
                    x: x,
                    y: y
                })
            })
        })

        Object.keys(clusters).forEach(key => {
            if (!validKey(key)) return;
            var cluster = clusters[key]

            var bounds = {
                minX: 10000,
                maxX: -10000,
                minY: 10000,
                maxY: -10000
            }

            cluster.bounds = bounds

            var pts = cluster.points.map(point => {
                var x = point.x
                var y = point.y

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

        console.log(clusters)
        let context = self as any
        context.postMessage(clusters)
    }
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
