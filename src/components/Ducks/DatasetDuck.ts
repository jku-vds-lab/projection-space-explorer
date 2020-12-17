import { Dataset } from "../Utility/Data/Dataset";

const SET = "ducks/database/SET"

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



const initialState: Dataset = null

export default function dataset(state = initialState, action: DatasetActionTypes): Dataset {
    switch (action.type) {
        case SET:
            return action.dataset
        default:
            return state
    }
}