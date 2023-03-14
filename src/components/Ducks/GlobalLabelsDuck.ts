import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface GlobalLabelsState {
  itemLabel: string;
  itemLabelPlural: string;
  storyLabel: string;
  storyLabelPlural: string;
  storyBookLabel: string;
  storyBookLabelPlural: string;
  storyTellingLabel: string;
}

const initialState = {
  itemLabel: 'item',
  itemLabelPlural: 'items',
  storyLabel: 'story',
  storyLabelPlural: 'stories',
  storyBookLabel: 'storybook',
  storyBookLabelPlural: 'storybooks',
  storyTellingLabel: 'storytelling',
} as GlobalLabelsState;

const globalLabelsSlice = createSlice({
  name: 'globalLabels',
  initialState,
  reducers: {
    setItemLabel(state, action: PayloadAction<{ label: string; labelPlural?: string }>) {
      state.itemLabel = action.payload.label;
      state.itemLabelPlural = action.payload.labelPlural == null ? action.payload.label : action.payload.labelPlural;
    },
    setStoryLabel(state, action: PayloadAction<{ label: string; labelPlural?: string }>) {
      state.storyLabel = action.payload.label;
      state.storyLabelPlural = action.payload.labelPlural == null ? action.payload.label : action.payload.labelPlural;
    },
    setStoryBookLabel(state, action: PayloadAction<{ label: string; labelPlural?: string }>) {
      state.storyBookLabel = action.payload.label;
      state.storyBookLabelPlural = action.payload.labelPlural == null ? action.payload.label : action.payload.labelPlural;
    },
    setStoryTellingLabel(state, action: PayloadAction<{ label: string }>) {
      state.storyTellingLabel = action.payload.label;
    },
  },
});

export const { setItemLabel, setStoryLabel, setStoryBookLabel, setStoryTellingLabel } = globalLabelsSlice.actions;
export const globalLabels = globalLabelsSlice.reducer;
