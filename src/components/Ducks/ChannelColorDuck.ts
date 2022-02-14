const SET = 'ducks/channelColor/SET';

const channelColor = (state = null, action) => {
  switch (action.type) {
    case SET:
      return action.channelColor;
    default:
      return state;
  }
};

export const setChannelColor = (channelColor) => ({
  type: SET,
  channelColor,
});

export default channelColor;
