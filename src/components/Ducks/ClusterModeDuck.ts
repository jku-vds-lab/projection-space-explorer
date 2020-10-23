const SET = "ducks/clusterMode/SET"

export enum ClusterMode {
    Univariate,
    Multivariate
}

export const setClusterModeAction = clusterMode => ({
    type: SET,
    clusterMode: clusterMode
});

export default function clusterMode (state = ClusterMode.Univariate, action): ClusterMode {
    switch (action.type) {
        case SET:
            return action.clusterMode
        default:
            return state
    }
}