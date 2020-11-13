
/**
 * Utility object that can convert screen coordinates to world coordinates and vice-versa.
 */
export class ViewTransform {

    /**
     * Converts world coordinates to screen coordinates
     * @param {*} vec a vector containing x and y
     */
    static worldToScreen(vec, transform) {
        let camera = transform.camera as any
        return {
            x: (vec.x - transform.camera.position.x) * camera.zoom + transform.width / 2,
            y: (-vec.y + transform.camera.position.y) * camera.zoom + transform.height / 2
        }
    }

    /**
     * Converts world coordinates to screen coordinates ignoring the camera position
     * @param screen 
     */
    static worldToScreenWithoutOffset(vec, transform) {
        let camera = transform.camera as any
        return {
            x: (vec.x) * camera.zoom + transform.width / 2,
            y: (-vec.y) * camera.zoom + transform.height / 2
        }
    }

    /**
     * Converts world coordinates to screen coordinates, but only the camera position
     * @param screen 
     */
    static cameraOffsetToScreen(transform) {
        let camera = transform.camera as any
        return {
            x: (-camera.position.x) * camera.zoom,
            y: (camera.position.y) * camera.zoom
        }
    }

    /**
     * Converts screen coordinates in the range 0 - width, 0 - height to world coordinates taking into account
     * the position of the camera.
     */
    static screenToWorld(screen, transform) {
        let camera = transform.camera as any
        return {
            x: (screen.x - transform.width / 2) / camera.zoom + transform.camera.position.x,
            y: -(screen.y - transform.height / 2) / camera.zoom + transform.camera.position.y
        }
    }
}