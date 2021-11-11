
import { v4 as uuidv4 } from 'uuid';
import { DatasetEntry } from '../../model/DatasetEntry';

const SET = "ducks/databaseentries/SET"


export function setDatasetEntriesAction(datasetEntries: Array<DatasetEntry>) {
    const byId = {}
    const allIds = []

    for (const entry of datasetEntries) {
        const handle = uuidv4()
        byId[handle] = entry
        allIds.push(handle)
    }
    
    return {
        type: SET,
        byId: byId,
        allIds: allIds
    }
}


type InitialType = {
    values: {
        byId: { [id: string]: DatasetEntry; },
        allIds: string[]
    }
}


const initialState: InitialType = {
    values: {
        byId: {},
        allIds: []
    }
}


export class DatasetEntriesAPI {
    static getTypes(state: InitialType) {
        return [...new Set(Object.values(state.values.byId).map(value => value.type))];
    }
    
    static getByPath(state: InitialType, path: string) {
        return Object.values(state.values.byId).find(e => e.path == path)
    }
}




export default function datasetEntries(state = initialState, action): InitialType {
    switch (action.type) {
        case SET:
            return { ...state, values: { byId: action.byId, allIds: action.allIds } }
        default:
            return state
    }
}