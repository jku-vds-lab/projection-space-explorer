const SET = 'lineBrightness/SET';

const lineBrightness = (state = 30, action) => {
  switch (action.type) {
    case SET:
      return action.lineBrightness;
    default:
      return state;
  }
};

export const setLineBrightness = (lineBrightness) => ({
  type: SET,
  lineBrightness,
});

export default lineBrightness;
