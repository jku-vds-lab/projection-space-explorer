const SET = 'ducks/groupVisualizationMode/SET';

export const setGroupVisualizationMode = (groupVisualizationMode) => ({
  type: SET,
  groupVisualizationMode,
});

export enum GroupVisualizationMode {
  None,
  StarVisualization,
  ConvexHull,
}

const groupVisualizationMode = (state = GroupVisualizationMode.None, action) => {
  switch (action.type) {
    case SET:
      return action.groupVisualizationMode;
    default:
      return state;
  }
};

export default groupVisualizationMode;
