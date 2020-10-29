import Cluster from "../util/Cluster"

const SET = "ducks/activeTrace/SET"

const initialState = {
    mainPath: [],
    mainEdges: []
}

type ActiveTraceState = typeof initialState

export default function activeTrace (state = initialState, action): ActiveTraceState {
    switch (action.type) {
        case SET:
            return action.activeTrace
        default:
            return state
    }
}

export const setActiveTrace = activeTrace => ({
    type: SET,
    activeTrace: activeTrace
})