import { createAction, createReducer } from '@reduxjs/toolkit';

const setOpenTab = createAction<number>('setopentab');
const disableOthers = createAction<{ tabs: number[] }>('disableothers');

export const openTab = createReducer({ openTab: 0, focusedTab: [] } as { openTab: number; focusedTab: number[] }, (builder) => {
  builder.addCase(setOpenTab, (state, action) => {
    state.openTab = action.payload;
  });

  builder.addCase(disableOthers, (state, action) => {
    state.focusedTab = action.payload.tabs;

    if (state.focusedTab && state.focusedTab.length > 0 && !state.focusedTab.includes(state.openTab)) {
      state.openTab = state.focusedTab[0];
    }
  });
});

export const TabActions = {
  setOpenTab,
  disableOthers,
};
