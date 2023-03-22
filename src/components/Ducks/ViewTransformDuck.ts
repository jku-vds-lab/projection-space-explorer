import { createAction, createReducer } from "@reduxjs/toolkit";

export const setViewTransform = createAction<{ camera, width, height, multipleId }> ('viewTransform/set');
export const setD3Transform = createAction<{ x, y, k }> ('viewTransform/setD3Transform');

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

  // d3 zoom transformation matrix
  x: number;
  y: number;
  k: number;
};

const initialState: ViewTransformType = {
  zoom: 0,
  width: 0,
  height: 0,
  centerX: 0,
  centerY: 0,
  x: 0,
  y: 0,
  k: 1,
};

export const viewTransform = createReducer(initialState, (builder) => {
  builder.addCase(setViewTransform, (state, action) => {
    state.centerX = action.payload.camera.position.x;
    state.centerY = action.payload.camera.position.y;
    state.width = action.payload.width;
    state.height = action.payload.height;
    state.zoom = action.payload.camera.zoom;
  })
  .addCase(setD3Transform, (state, action) => {
    state.x = action.payload.x;
    state.y = action.payload.y;
    state.k = action.payload.k;
  });
});