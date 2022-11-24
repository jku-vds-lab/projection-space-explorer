import { createAction, createReducer } from '@reduxjs/toolkit';
import { CategoryOption } from '../WebGLView/CategoryOptions';

export const setChannelSize = createAction<CategoryOption>('ducks/channelSize/SET');

export const channelSize = createReducer<CategoryOption>(null, (builder) => {
  builder.addCase(setChannelSize, (_, action) => {
    return action.payload;
  });
});
