import { createAction, createReducer } from '@reduxjs/toolkit';

const setDetailVisibility = createAction<boolean>('detailview/setvisibielity');
const setDetailView = createAction<number>('detailview/setview');

const initialState = {
  open: false,
  active: 0,
};

export const detailView = createReducer(initialState, (builder) => {
  builder
    .addCase(setDetailVisibility, (state, action) => {
      state.open = action.payload;
    })
    .addCase(setDetailView, (state, action) => {
      state.active = action.payload;
    });
});

export const DetailViewActions = {
  setDetailVisibility,
  setDetailView,
};
