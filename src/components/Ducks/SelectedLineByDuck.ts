const SET = "ducks/selectedLineBy/SET"



const selectedLineBy = (state = "", action) => {
    switch (action.type) {
        case SET:
            return action.selectedLineBy;
        default:
            return state;
    }
};

export default selectedLineBy