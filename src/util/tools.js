
/**
 * Rectangle selection tool.
 */
class RectangleSelection {
    constructor(vectors, scene) {
        this.vectors = vectors
        this.scene = scene

        this.create = false

        this.geometry = new THREE.PlaneGeometry(1, 1, 32);
        this.material = new THREE.MeshBasicMaterial({
            color: 0x000000,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.5
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
            this.plane.scale.x = 0
            this.plane.scale.y = 0

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
            if (selector(vector.globalIndex)) {
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
function getDefaultZoom(vectors, width, height) {
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
function getDefaultCamera(width, height, vectors) {
    var camera = new THREE.OrthographicCamera(width / - 2, width / 2, height / 2, height / - 2, 1, 1000);
    camera.zoom = getDefaultZoom(vectors, width, height);
    camera.position.z = 1;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();
    return camera
}



module.exports = {
    Selection: RectangleSelection,
    getDefaultCamera: getDefaultCamera
}