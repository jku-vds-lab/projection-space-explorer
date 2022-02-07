const SET = 'ducks/projectionOpen/SET';

export const setProjectionOpenAction = (projectionOpen) => ({
  type: SET,
  projectionOpen,
});

const projectionOpen = (state = false, action) => {
  switch (action.type) {
    case SET:
      return action.projectionOpen;
    default:
      return state;
  }
};

export default projectionOpen;
