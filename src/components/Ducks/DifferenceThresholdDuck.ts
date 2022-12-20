const SET = 'differenceThreshold/SET';

export const differenceThreshold = (state = 0.25, action) => {
  switch (action.type) {
    case SET:
      return action.differenceThreshold;
    default:
      return state;
  }
};

export const setDifferenceThreshold = (differenceThreshold) => ({
  type: SET,
  differenceThreshold,
});

export default differenceThreshold;
