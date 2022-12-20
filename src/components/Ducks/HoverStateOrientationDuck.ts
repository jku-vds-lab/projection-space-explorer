const SET = 'hoverStateOrientation/SET';

export enum HoverStateOrientation {
  SouthWest,
  NorthEast,
}

const hoverStateOrientation = (state = HoverStateOrientation.NorthEast, action) => {
  switch (action.type) {
    case SET:
      return action.hoverStateOrientation;
    default:
      return state;
  }
};

export const setHoverStateOrientation = (hoverStateOrientation) => ({
  type: SET,
  hoverStateOrientation,
});

export default hoverStateOrientation;
