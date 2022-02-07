const SET = 'ducks/projectionWorker/SET';

export const setProjectionWorkerAction = (projectionWorker) => ({
  type: SET,
  projectionWorker,
});

const initialState: Worker = null;

export default function projectionWorker(state = initialState, action): Worker {
  switch (action.type) {
    case SET:
      return action.projectionWorker;
    default:
      return state;
  }
}
