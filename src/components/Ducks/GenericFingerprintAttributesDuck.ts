import { createAction, createReducer } from '@reduxjs/toolkit';

export interface GenericFingerprintAttribute {
  feature: string;
  show: boolean;
  group: string;
}

export const setGenericFingerprintAttributes = createAction<GenericFingerprintAttribute[]>('setgenericfingerprint');

export const genericFingerprintAttributes = createReducer([], (builder) => {
  builder.addCase(setGenericFingerprintAttributes, (state, action) => {
    return action.payload;
  });
});
