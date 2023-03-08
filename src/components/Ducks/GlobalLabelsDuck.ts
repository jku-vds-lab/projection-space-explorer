import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GlobalLabelsState {
  itemLabel: string;
  itemLabelPlural: string;
  storyLabel: string;
  storyLabelPlural: string;
  storyBookLabel: string;
  storyBookLabelPlural: string;
}

const initialState = {
  itemLabel: 'item',
  itemLabelPlural: 'items',
  storyLabel: 'story',
  storyLabelPlural: 'stories',
  storyBookLabel: 'storybook',
  storyBookLabelPlural: 'storybooks',
} as GlobalLabelsState;

const globalLabelsSlice = createSlice({
  name: 'globalLabels',
  initialState,
  reducers: {
    setItemLabel(state, action: PayloadAction<{ label: string; label_plural?: string }>) {
      state.itemLabel = action.payload.label;
      state.itemLabelPlural = action.payload.label_plural == null ? action.payload.label : action.payload.label_plural;
    },
  },
});

export const { setItemLabel } = globalLabelsSlice.actions;
export const globalLabels = globalLabelsSlice.reducer;
