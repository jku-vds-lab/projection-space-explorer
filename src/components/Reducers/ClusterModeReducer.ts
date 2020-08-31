import { ActionTypeLiteral } from "../Actions/Actions"

export enum ClusterMode {
    Univariate,
    Multivariate
}

const clusterMode = (state = ClusterMode.Univariate, action) => {
    switch (action.type) {
        case ActionTypeLiteral.SetClusterMode:
            return action.clusterMode
        default:
            return state
    }
}

export default clusterMode