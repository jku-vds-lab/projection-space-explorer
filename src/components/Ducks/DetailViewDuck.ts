import { createAction, createReducer } from '@reduxjs/toolkit';

export const setVisibility = createAction<boolean>('detailView/setvisibility');
export const setActive = createAction<string>('detailView/setActive');

export const detailView = createReducer(
  {
    open: false,
    active: '',
  },
  (builder) => {
    builder
      .addCase(setVisibility, (state, action) => {
        state.open = action.payload;
      })
      .addCase(setActive, (state, action) => {
        state.active = action.payload;
      });
  },
);
