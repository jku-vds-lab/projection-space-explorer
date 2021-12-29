import { Dataset } from "../../model/Dataset";
export function dataset(state?: Dataset): Dataset;

const SET = "ducks/dataset/SET"
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

export default function Dataset(state = initialState, action): Dataset {
    switch (action.type) {
        case SET:
            return action.dataset
        default:
            return state
    }
}