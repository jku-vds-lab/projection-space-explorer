import { Dataset } from "../Utility/Data/Dataset";

const SET = "ducks/database/SET"
const SET_VECT = "ducks/database/SET_VECT"

interface SetDatasetAction {
    type: typeof SET
    dataset: Dataset
}


type DatasetActionTypes = SetDatasetAction

export function setDatasetAction(dataset: Dataset): DatasetActionTypes {
    return {
        type: SET,
        dataset: dataset
    }
}

export const setDatasetVectAction = input => ({
    type: SET_VECT,
    input: input
});



const initialState: Dataset = null

export default function dataset(state = initialState, action): Dataset {
    switch (action.type) {
        case SET:
            return action.dataset
        default:
            return state
    }
}