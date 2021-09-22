import { applyMiddleware, createStore, Store } from "redux";
import { addClusterToStory } from "../Ducks/StoriesDuck";
import { rootReducer, RootState } from "../Store/Store";
import thunk from 'redux-thunk';


function getStoreDiff(storeA, storeB) {
    const diff = {}

    for (const key in storeA) {
        const valA = storeA[key]
        const valB = storeB[key]

        if (valA != valB) {
            diff[key] = valB
        }
    }

    return diff
}





function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


/**
 * Main api class for PSE.
 */
export class API {
    store: Store<RootState>
    onStateChanged: any;
    id: string;

    constructor(json?: string) {
        this.id = uuidv4()

        if (json) {
            const preloadedState = JSON.parse(json)
            this.store = createStore(rootReducer, preloadedState, applyMiddleware(this.differenceMiddleware, thunk))
        } else {
            this.store = createStore(rootReducer, applyMiddleware(this.differenceMiddleware, thunk))
        }
    }


    serialize() {
        return JSON.stringify(this.store.getState())
    }

    differenceMiddleware = store => next => action => {
        const oldState = store.getState()

        let newState = next(action)

        const diff = getStoreDiff(oldState, store.getState())

        if (this.onStateChanged) {
            this.onStateChanged(newState, diff)
        }
        

        return newState
    }


    createCluster(cluster) {
        this.store.dispatch(addClusterToStory(cluster))
    }

    getClusters() {
        return this.store.getState().stories.active.clusters
    }
}