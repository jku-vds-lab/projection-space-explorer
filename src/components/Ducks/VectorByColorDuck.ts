const SET = "ducks/vectorByColor/SET"

const vectorByColor = (state = null, action) => {
    switch (action.type) {
        case SET:
            return action.vectorByColor;
        default:
            return state;
    }
};


export default vectorByColor