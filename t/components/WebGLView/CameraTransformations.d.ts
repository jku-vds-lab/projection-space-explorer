/**
 * Utility object that can convert screen coordinates to world coordinates and vice-versa.
 */
export declare class CameraTransformations {
    /**
     * Converts world coordinates to screen coordinates
     * @param {*} vec a vector containing x and y
     */
    static worldToScreen(vec: any, transform: any): {
        x: number;
        y: number;
    };
    /**
     * Converts world coordinates to screen coordinates ignoring the camera position
     * @param screen
     */
    static worldToScreenWithoutOffset(vec: any, transform: any): {
        x: number;
        y: number;
    };
    /**
     * Converts world coordinates to screen coordinates, but only the camera position
     * @param screen
     */
    static cameraOffsetToScreen(transform: any): {
        x: number;
        y: number;
    };
    /**
     * Converts screen coordinates in the range 0 - width, 0 - height to world coordinates taking into account
     * the position of the camera.
     */
    static screenToWorld(screen: {
        x: number;
        y: number;
    }, transform: any): {
        x: any;
        y: any;
    };
    static pixelToWorldCoordinates(pixel: number, transform: any): number;
}
