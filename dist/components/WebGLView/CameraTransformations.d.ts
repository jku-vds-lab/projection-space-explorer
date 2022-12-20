import type { ViewTransformType } from '../Ducks';
/**
 * Utility object that can convert screen coordinates to world coordinates and vice-versa.
 */
export declare class CameraTransformations {
    /**
     * Converts world coordinates to screen coordinates
     * @param {*} vec a vector containing x and y
     */
    static worldToScreen(vec: any, transform: ViewTransformType): {
        x: number;
        y: number;
    };
    /**
     * Converts world coordinates to screen coordinates ignoring the camera position
     * @param screen
     */
    static worldToScreenWithoutOffset(vec: any, transform: ViewTransformType): {
        x: number;
        y: number;
    };
    /**
     * Converts world coordinates to screen coordinates, but only the camera position
     * @param screen
     */
    static cameraOffsetToScreen(transform: ViewTransformType): {
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
    }, transform: ViewTransformType): {
        x: number;
        y: number;
    };
    static pixelToWorldCoordinates(pixel: number, transform: ViewTransformType): number;
}
