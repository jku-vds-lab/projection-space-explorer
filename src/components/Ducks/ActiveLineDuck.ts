import { createAction, createReducer } from '@reduxjs/toolkit';

export const setActiveLine = createAction<string>('ducks/activeLine/SET');

export const activeLine = createReducer<string>(null, (builder) => {
  builder.addCase(setActiveLine, (_, action) => {
    return action.payload;
  });
});
