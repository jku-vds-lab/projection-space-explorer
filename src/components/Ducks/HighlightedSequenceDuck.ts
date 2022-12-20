const SET = 'ducks/highlightedSequence/SET';

export const setHighlightedSequenceAction = (highlightedSequence) => ({
  type: SET,
  highlightedSequence,
});

const highlightedSequence = (state = null, action) => {
  switch (action.type) {
    case SET:
      return action.highlightedSequence;
    default:
      return state;
  }
};

export default highlightedSequence;
