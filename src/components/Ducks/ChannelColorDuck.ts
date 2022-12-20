import { createAction, createReducer } from '@reduxjs/toolkit';
import { CategoryOption } from '../WebGLView/CategoryOptions';

export const setChannelColor = createAction<CategoryOption>('ducks/channelColor/SET');

export const channelColor = createReducer<CategoryOption>(null, (builder) => {
  builder.addCase(setChannelColor, (_, action) => {
    return action.payload;
  });
});
