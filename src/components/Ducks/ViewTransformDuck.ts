const SET = 'ducks/viewTransform/SET';
const INVALIDATE = 'ducks/viewTransform/INVALIDATE';

export const setViewTransform = (camera, width, height, multipleId) => ({
  type: SET,
  camera,
  width,
  height,
  multipleId
});

export const invalidateTransform = () => ({
  type: INVALIDATE,
});

/**
 * Type specifying the camera transformation that all components should use.
 * From this an orthographic projection can be constructed.
 */
export type ViewTransformType = {
  // Width (px) of the viewport -> width for orthographic projections
  width: number;

  // Height (px) of the viewport -> height for orthographic projections
  height: number;

  // Center x coordinate of the camera
  centerX: number;

  // Center y coordinate of the camera
  centerY: number;

  // Zoom level of the camera
  zoom: number;
};

const initialState: ViewTransformType = {
  zoom: 0,
  width: 0,
  height: 0,
  centerX: 0,
  centerY: 0,
};

export const viewTransform = (state = initialState, action): ViewTransformType => {
  switch (action.type) {
    case SET:
      return {
        centerX: action.camera.position.x,
        centerY: action.camera.position.y,
        width: action.width,
        height: action.height,
        zoom: action.camera.zoom,
      };
    case INVALIDATE:
      return { ...state };
    default:
      return state;
  }
};
