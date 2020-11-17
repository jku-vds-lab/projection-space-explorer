import { Vect } from "../Utility/Data/Vect"
import * as libtess from 'libtess'
import * as THREE from 'three'

export class LassoSelection {
    drawing: boolean
    start: { x, y }
    points: { x, y }[]

    constructor() {
        this.drawing = false
        this.start = { x: 0, y: 0 }
        this.points = []
    }

    mouseDown(alt, x, y) {
        if (!this.drawing && alt) {
            this.drawing = true

            this.start = { x: x, y: y }
            this.points = [this.start]

        }
    }

    mouseMove(x, y) {
        if (this.drawing) {
            this.points.push({ x: x, y: y })

        }
    }

    mouseUp(x, y) {
        if (this.drawing) {
            this.points.push({
                x: x,
                y: y
            })

            this.points.push(this.start)

            this.drawing = false
        }
    }

    selection(vectors, visible) {
        var indices = []
        vectors.forEach((vector, index) => {
            if (visible(vector) && this.intersects(vector)) {
                indices.push(index)
            }
        })
        return indices
    }

    intersects(seat) {
        if (this.points.length <= 1) {
            return false;
        }

        var selected = false

        var intercessionCount = 0;
        for (var index = 1; index < this.points.length; index++) {
            var start = this.points[index - 1];
            var end = this.points[index];
            var line = { start: start, end: end };

            //Testes

            //*************************************************
            //* Adicionar teste bounding box intersection aqui *
            //*************************************************

            var ray = { Start: { x: seat.x, y: seat.y }, End: { x: 99999, y: 0 } };
            var segment = { Start: start, End: end };
            var rayDistance = {
                x: ray.End.x - ray.Start.x,
                y: ray.End.y - ray.Start.y
            };
            var segDistance = {
                x: segment.End.x - segment.Start.x,
                y: segment.End.y - segment.Start.y
            };

            var rayLength = Math.sqrt(Math.pow(rayDistance.x, 2) + Math.pow(rayDistance.y, 2));
            var segLength = Math.sqrt(Math.pow(segDistance.x, 2) + Math.pow(segDistance.y, 2));

            if ((rayDistance.x / rayLength == segDistance.x / segLength) &&
                (rayDistance.y / rayLength == segDistance.y / segLength)) {
                continue;
            }

            var T2 = (rayDistance.x * (segment.Start.y - ray.Start.y) + rayDistance.y * (ray.Start.x - segment.Start.x)) / (segDistance.x * rayDistance.y - segDistance.y * rayDistance.x);
            var T1 = (segment.Start.x + segDistance.x * T2 - ray.Start.x) / rayDistance.x;

            //Parametric check.
            if (T1 < 0) {
                continue;
            }
            if (T2 < 0 || T2 > 1) {
                continue
            };
            if (isNaN(T1)) {
                continue
            }; //rayDistance.X = 0

            intercessionCount++;
        }

        if (intercessionCount == 0) {
            selected = false;
            return selected;
        }
        if (intercessionCount & 1) {
            selected = true;
        } else {
            selected = false;
        }


        return selected
    }
}





/**
 * Rectangle selection tool.
 */
export class RectangleSelection {
    vectors: Vect[]
    scene: any
    create: boolean
    geometry: any
    material: any
    plane: any
    startX: any
    startY: any

    constructor(vectors, scene) {
        this.vectors = vectors
        this.scene = scene

    
        this.create = false

        this.geometry = new THREE.PlaneGeometry(1, 1, 32);
        this.material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.2
        });
        this.plane = new THREE.Mesh(this.geometry, this.material);
        this.plane.position.x = 0
        this.plane.position.y = 0
        this.plane.position.z = -0.5

        this.plane.scale.x = 0
        this.plane.scale.y = 0
    }

    mouseDown(x, y) {
        // dispose old selection
        this.scene.remove(this.plane)

        if (this.create == false) {
            this.startX = x
            this.startY = y

            this.plane.position.x = this.startX
            this.plane.position.y = this.startY
            this.plane.scale.x = 0.1
            this.plane.scale.y = 0.1

            this.scene.add(this.plane);

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

    mouseUp(selector) {
        if (this.create) {
            //this.problem.scene.remove(this.plane)
            var width = Math.abs(this.plane.scale.x)
            var height = Math.abs(this.plane.scale.y)
            var vectors = this.select(selector, { x: this.plane.position.x - width / 2, y: this.plane.position.y - height / 2, w: width, h: height })

            this.create = false

            // Create aggregation
            return vectors
        }
        return null
    }

    dispose() {
        if (this.plane != null) {
            this.scene.remove(this.plane)
        }

        this.geometry.dispose()
        this.material.dispose()
    }

    select(selector, rect) {
        var set = []

        this.vectors.forEach(vector => {
            if (selector(vector)) {
                if (vector.x > rect.x && vector.y > rect.y && vector.x < rect.x + rect.w && vector.y < rect.y + rect.h) {
                    set.push(vector)
                }
            }
        })

        return set
    }
}





/**
 * Calculates the default zoom factor by examining the bounds of the data set
 * and then dividing it by the height of the viewport.
 */
export function getDefaultZoom(vectors, width, height) {
    var zoom = 10

    // Get rectangle that fits around data set
    var minX = 1000, maxX = -1000, minY = 1000, maxY = -1000;
    vectors.forEach(vector => {
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
export function getDefaultCamera(width, height, vectors) {
    var camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
    camera.zoom = getDefaultZoom(vectors, width, height);
    camera.position.z = 1;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();
    return camera
}





export function annotateVectors(vectors: Vect[], clusterId) {
    vectors?.forEach(vector => {
        vector.clusterLabel = clusterId
        vector.clusterProbability = 1.0
    })
}







/*global libtess */
/* exported triangulate */

var tessy = (function initTesselator() {
    // function called for each vertex of tesselator output
    function vertexCallback(data, polyVertArray) {
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

export function triangulate(contours) {
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