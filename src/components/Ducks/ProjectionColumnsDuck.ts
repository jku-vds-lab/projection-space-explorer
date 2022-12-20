import { createAction, createReducer } from '@reduxjs/toolkit';

export interface ProjectionColumn {
  name: string;
  checked: boolean;
  normalized: boolean;
  range: string;
  featureLabel: string;
}

const initialState = [] as ProjectionColumn[];

export const setProjectionColumnsAction = createAction<ProjectionColumn[]>('setprojectioncolumns');

export const projectionColumns = createReducer(initialState, (builder) => {
  builder.addCase(setProjectionColumnsAction, (state, action) => {
    return action.payload;
  });
});

export default projectionColumns;
