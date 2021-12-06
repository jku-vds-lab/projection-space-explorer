import { IProjection, IBaseProjection } from "../../model/Projection"
import { v4 as uuidv4 } from 'uuid';
import { ANormalized } from "../Utility/NormalizedState";

enum ActionTypes {
    ADD = "ducks/embedding/ADD",
    DELETE = "ducks/embedding/DELETE",
    UPDATE_ACTIVE = 'ducks/embedding/UPDATE'
}


type AddAction = {
    type: ActionTypes.ADD
    projection: IProjection
}

type DeleteAction = {
    type: ActionTypes.DELETE,
    handle: string
}

type UpdateAction = {
    type: ActionTypes.UPDATE_ACTIVE,
    workspace: IBaseProjection
}


export const addProjectionAction = (projection: IProjection) => ({
    type: ActionTypes.ADD,
    projection
})

export const deleteProjectionAction = (handle: string) => ({
    type: ActionTypes.DELETE,
    handle
})

export const updateWorkspaceAction = (workspace: IBaseProjection) => ({
    type: ActionTypes.UPDATE_ACTIVE,
    workspace
})



type Action = AddAction | DeleteAction | UpdateAction


/**
 * Type for embedding state slice
 */
type StateType = {
    // embeddings by id (state normalization)
    byId: { [id: string]: IProjection; }

    // all ids of embeddings (contains order)
    allIds: string[]

    // current projection that is in the scatterplot
    workspace: IBaseProjection
}

/**
 * Initial state
 */
const initialState: StateType = {
    byId: {},
    allIds: [],
    workspace: undefined
}

export default function embeddings(state = initialState, action: Action): StateType {
    switch (action.type) {
        case ActionTypes.ADD: {
            const newState = { byId: { ...state.byId }, allIds: [...state.allIds], workspace: state.workspace }

            ANormalized.add(newState, action.projection)

            return newState
        }
        case ActionTypes.UPDATE_ACTIVE: {
            const newState = { ...state }

            newState.workspace = action.workspace

            return newState
        }
        case ActionTypes.DELETE: {
            const newState = { byId: { ...state.byId }, allIds: [...state.allIds], workspace: state.workspace }

            ANormalized.delete(newState, action.handle)

            return newState
        }
        default:
            return state
    }
}