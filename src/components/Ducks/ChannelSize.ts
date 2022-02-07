const SET = 'ducks/channelSize/SET';

const channelSize = (state = null, action) => {
  switch (action.type) {
    case SET:
      return action.channelSize;
    default:
      return state;
  }
};

export const setChannelSize = (channelSize) => ({
  type: SET,
  channelSize,
});

export default channelSize;
