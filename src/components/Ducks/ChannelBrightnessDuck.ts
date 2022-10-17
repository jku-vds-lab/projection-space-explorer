import { createAction, createReducer } from '@reduxjs/toolkit';
import { CategoryOption } from '../WebGLView/CategoryOptions';

export const setChannelBrightnessAction = createAction<CategoryOption>('ducks/channelBrightness/SET_SELECTION');

export const channelBrightness = createReducer<CategoryOption>(null, (builder) => {
  builder.addCase(setChannelBrightnessAction, (_, action) => {
    return action.payload;
  });
});