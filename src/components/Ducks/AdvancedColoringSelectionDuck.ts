const SET = 'ducks/advancedColoringSelection/SET';

const advancedColoringSelection = (state = new Array(100).fill(true), action) => {
  switch (action.type) {
    case SET:
      return action.advancedColoringSelection;
    default:
      return state;
  }
};

export default advancedColoringSelection;

export const setAdvancedColoringSelectionAction = (advancedColoringSelection) => ({
  type: SET,
  advancedColoringSelection,
});
