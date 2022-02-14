import { ANormalized, NormalizedDictionary } from '../Utility/NormalizedState';
import type { RootState } from '../Store';
import { BaseColorScale } from '../../model/Palette';

enum ActionTypes {
  PICK_SCALE = 'ducks/colorScales/PICK',
}

type PickAction = {
  type: ActionTypes.PICK_SCALE;
  handle: string;
};

export const ColorScalesActions = {
  pickScale: (handle: string) => ({
    type: ActionTypes.PICK_SCALE,
    handle,
  }),
  initScaleByType: (type: string) => {
    return (dispatch, getState) => {
      const state: RootState = getState();

      const handle = ANormalized.entries<BaseColorScale>(state.colorScales.scales).find(([key, value]) => {
        return value.type === type;
      })[0];

      return dispatch({
        type: ActionTypes.PICK_SCALE,
        handle,
      });
    };
  },
};

type Action = PickAction;

/**
 * Type for embedding state slice
 */
type StateType = {
  scales: NormalizedDictionary<BaseColorScale>;
  active: string;
};

/**
 * Initial state
 */
const initialState: StateType = (function () {
  const state = {
    scales: ANormalized.create<BaseColorScale>(),
    active: null,
  };

  ANormalized.add(state.scales, {
    palette: 'dark2',
    type: 'categorical',
    dataClasses: 8,
  });

  ANormalized.add(state.scales, {
    palette: 'accent',
    type: 'categorical',
  });

  ANormalized.add(state.scales, {
    palette: 'paired',
    type: 'categorical',
  });

  ANormalized.add(state.scales, {
    palette: 'YlOrRd',
    type: 'sequential',
  });

  ANormalized.add(state.scales, {
    palette: 'Greys',
    type: 'sequential',
  });

  ANormalized.add(state.scales, {
    palette: 'Viridis',
    type: 'sequential',
  });

  ANormalized.add(state.scales, {
    palette: 'BrBG',
    type: 'diverging',
  });

  ANormalized.add(state.scales, {
    palette: 'PRGn',
    type: 'diverging',
  });

  ANormalized.add(state.scales, {
    palette: 'SHAP',
    type: 'diverging',
  });

  return state;
})();

export default function colorScales(state = initialState, action?: Action): StateType {
  switch (action?.type) {
    case ActionTypes.PICK_SCALE: {
      return { ...state, active: action.handle };
    }
    default:
      return state;
  }
}
