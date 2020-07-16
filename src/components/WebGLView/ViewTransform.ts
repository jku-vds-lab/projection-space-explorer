
/**
 * Utility object that can convert screen coordinates to world coordinates and vice-versa.
 */
export class ViewTransform {
    camera: THREE.Camera
    width: number
    height: number

    constructor(camera, width, height) {
        this.camera = camera
        this.width = width
        this.height = height
    }

    /**
     * Converts world coordinates to screen coordinates
     * @param {*} vec a vector containing x and y
     */
    worldToScreen(vec) {
        let camera = this.camera as any
        return {
            x: (vec.x - this.camera.position.x) * camera.zoom + this.width / 2,
            y: (-vec.y + this.camera.position.y) * camera.zoom + this.height / 2
        }
    }

    /**
     * Converts screen coordinates in the range 0 - width, 0 - height to world coordinates taking into account
     * the position of the camera.
     */
    screenToWorld(screen) {
        let camera = this.camera as any
        return {
            x: (screen.x - this.width / 2) / camera.zoom + this.camera.position.x,
            y: -(screen.y - this.height / 2) / camera.zoom + this.camera.position.y
        }
    }
}