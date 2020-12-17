const SET = "ducks/selectedVectorByColor/SET"

const selectedVectorByColor = (state = "", action) => {
    switch (action.type) {
        case SET:
            return action.selectedVectorByColor;
        default:
            return state;
    }
};

export default selectedVectorByColor