import { EntityId } from '@reduxjs/toolkit';
import { ANormalized } from '../Utility/NormalizedState';
import type { RootState } from '../Store';
import { BaseColorScale } from '../../model/Palette';

enum ActionTypes {
  PICK_SCALE = 'ducks/colorScales/PICK',
}

type PickAction = {
  type: ActionTypes.PICK_SCALE;
  handle: string;
};

export const PointColorScaleActions = {
  pickScale: (handle: string) => ({
    type: ActionTypes.PICK_SCALE,
    handle,
  }),
  initScaleByType: (type: string) => {
    return (dispatch, getState) => {
      const state: RootState = getState();

      const handle = ANormalized.entries<BaseColorScale>(state.colorScales.scales).find(([, value]) => {
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
export type ColorScalesType = EntityId;

/**
 * Initial state
 */
const initialState: ColorScalesType = (function () {
  return null;
})();

export default function colorScales(state = initialState, action?: Action): ColorScalesType {
  switch (action?.type) {
    case ActionTypes.PICK_SCALE: {
      return action.handle;
    }
    default:
      return state;
  }
}
