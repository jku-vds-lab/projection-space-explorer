import { ICluster } from '../../model/ICluster';
import { IVector } from '../../model/Vector';

const SET = 'ducks/hoverState/SET';

export const setHoverState = (hoverState, updater) => ({
  type: SET,
  input: { data: hoverState, updater },
});

const initialState: HoverStateType = {
  data: null,
  updater: '',
};

export type HoverStateType = {
  data: IVector | ICluster;
  updater: string;
};

const hoverState = (state = initialState, action): HoverStateType => {
  switch (action.type) {
    case SET:
      return { ...state, data: action.input?.data, updater: action.input?.updater };
    default:
      return state;
  }
};

export default hoverState;
