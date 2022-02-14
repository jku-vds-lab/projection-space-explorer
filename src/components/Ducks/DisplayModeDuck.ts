const SET = 'reducers/DISPLAY_MODE';

export enum DisplayMode {
  None,
  OnlyStates,
  OnlyClusters,
  StatesAndClusters,
}

export function displayModeSupportsStates(displayMode: DisplayMode) {
  return displayMode === DisplayMode.OnlyStates || displayMode === DisplayMode.StatesAndClusters;
}

export function displayModeSuportsClusters(displayMode: DisplayMode) {
  return displayMode === DisplayMode.OnlyClusters || displayMode === DisplayMode.StatesAndClusters;
}

export default function displayMode(state = DisplayMode.StatesAndClusters, action): DisplayMode {
  // TODO: hide clusters by default for CHEM; frontend_utils.CHEM_PROJECT ? DisplayMode.OnlyStates: DisplayMode.StatesAndClusters
  switch (action.type) {
    case SET:
      return action.displayMode;
    default:
      return state;
  }
}

export const setDisplayMode = (displayMode) => {
  return {
    type: SET,
    displayMode,
  };
};
