const SET = 'ducks/activeLine/SET';

const activeLine = (state = null, action): string => {
  switch (action.type) {
    case SET:
      return action.activeLine;
    default:
      return state;
  }
};

export const setActiveLine = (activeLine) => ({
  type: SET,
  activeLine,
});

export default activeLine;
