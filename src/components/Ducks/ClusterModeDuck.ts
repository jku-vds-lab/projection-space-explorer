const SET = "ducks/clusterMode/SET"

export enum ClusterMode {
    Univariate,
    Multivariate
}

export const setClusterModeAction = clusterMode => ({
    type: SET,
    clusterMode: clusterMode
});

const clusterMode = (state = ClusterMode.Univariate, action) => {
    switch (action.type) {
        case SET:
            return action.clusterMode
        default:
            return state
    }
}

export default clusterMode