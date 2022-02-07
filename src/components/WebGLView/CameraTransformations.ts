import type { ViewTransformType } from '../Ducks';

/**
 * Utility object that can convert screen coordinates to world coordinates and vice-versa.
 */
export class CameraTransformations {
  /**
   * Converts world coordinates to screen coordinates
   * @param {*} vec a vector containing x and y
   */
  static worldToScreen(vec, transform: ViewTransformType) {
    return {
      x: (vec.x - transform.centerX) * transform.zoom + transform.width / 2,
      y: (-vec.y + transform.centerY) * transform.zoom + transform.height / 2,
    };
  }

  /**
   * Converts world coordinates to screen coordinates ignoring the camera position
   * @param screen
   */
  static worldToScreenWithoutOffset(vec, transform: ViewTransformType) {
    return {
      x: vec.x * transform.zoom + transform.width / 2,
      y: -vec.y * transform.zoom + transform.height / 2,
    };
  }

  /**
   * Converts world coordinates to screen coordinates, but only the camera position
   * @param screen
   */
  static cameraOffsetToScreen(transform: ViewTransformType) {
    return {
      x: -transform.centerX * transform.zoom,
      y: transform.centerY * transform.zoom,
    };
  }

  /**
   * Converts screen coordinates in the range 0 - width, 0 - height to world coordinates taking into account
   * the position of the camera.
   */
  static screenToWorld(screen: { x: number; y: number }, transform: ViewTransformType) {
    return {
      x: (screen.x - transform.width / 2) / transform.zoom + transform.centerX,
      y: -(screen.y - transform.height / 2) / transform.zoom + transform.centerY,
    };
  }

  static pixelToWorldCoordinates(pixel: number, transform: ViewTransformType) {
    const v1 = CameraTransformations.screenToWorld({ x: 0, y: 0 }, transform);
    const v2 = CameraTransformations.screenToWorld({ x: transform.width, y: 0 }, transform);

    return ((v2.x - v1.x) / transform.width) * pixel;
  }
}
