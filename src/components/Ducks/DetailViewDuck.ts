const SET_VISIBILITY = 'setvisibility';

export function setDetailVisibility(open: boolean) {
  return {
    type: SET_VISIBILITY,
    open,
  };
}

const initialState = {
  open: false,
  active: '',
};

export default function detailView(state = initialState, action): typeof initialState {
  switch (action.type) {
    case SET_VISIBILITY:
      return { ...state, open: action.open };
    default:
      return state;
  }
}
