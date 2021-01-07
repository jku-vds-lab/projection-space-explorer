import { Delete } from "@material-ui/icons"
import { Embedding } from "../Utility/Data/Embedding"

const ADD = "ducks/projections/ADD"
const DELETE = "ducks/projections/DELETE"

export const addProjectionAction = (projection: Embedding) => ({
    type: ADD,
    projection: projection
})

export const deleteProjectionAction = (projection: Embedding) => ({
    type: DELETE,
    projection: projection
})

const initialState: Embedding[] = []

export default function projections(state = initialState, action): Embedding[] {
    switch (action.type) {
        case ADD: {
            let copy = state.slice(0)
            copy.push(action.projection)
            return copy
        }
        case DELETE: {
            let copy = state.slice(0)
            copy.splice(copy.indexOf(action.projection), 1)
            return copy
        }
        default:
            return state
    }
}