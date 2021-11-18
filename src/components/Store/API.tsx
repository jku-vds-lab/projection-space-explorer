import { applyMiddleware, createStore, Reducer, Store } from "redux";
import { addClusterToStory } from "../Ducks/StoriesDuck";
import { rootReducer, RootState } from "../Store/Store";
import thunk from 'redux-thunk';
import { v4 as uuidv4 } from 'uuid';
import { getStoreDiff } from "./PluginScript";
import { RootActions } from "./RootActions";



/**
 * Main api class for PSE.
 */
export class API<T> {
    store: Store<T>;
    onStateChanged: any;
    id: string;



    /**
     * Creates a PSE API (store).
     * 
     * @param json the json string which contains parts of store state
     * @param reducer the root reducer of the store, MUST be created with PSE´s inbuilt createRootReducer method.
     */
    constructor(json: string | undefined, reducer: Reducer) {
        this.id = uuidv4();

        if (json) {
            const preloadedState = JSON.parse(json);

            this.store = createStore(reducer ? reducer : rootReducer, preloadedState, applyMiddleware(this.differenceMiddleware, thunk));
        }
        else {
            this.store = createStore(reducer ? reducer : rootReducer, applyMiddleware(this.differenceMiddleware, thunk));
        }
    }



    /**
     * Performs a partial store change.
     * This operation can have side effects depending on which parts you change that can break the app
     * (for example changing the dataset when there are still clusters)
     */
    partialHydrate(json: string) {
        const dump = JSON.parse(json)
        
        this.store.dispatch(RootActions.hydrate(dump))
    }


    reset() {
        this.store.dispatch(RootActions.reset())
    }


    serialize() {
        return JSON.stringify(this.store.getState());
    }

    /**
     * Creates a partial dump which excludes a list of columns.
     */
    partialDump(excluded: string[]) {
        const set = new Set(excluded)
        const state = this.store.getState()

        const partial = {}

        // Copy all included keys to partial object
        Object.keys(state).filter(key => !set.has(key))
            .forEach(key => { partial[key] = state[key] })

        return JSON.stringify(partial)
    }


    differenceMiddleware = store => next => action => {
        const oldState = store.getState();

        let newState = next(action);

        const diff = getStoreDiff(oldState, store.getState());

        if (this.onStateChanged) {
            this.onStateChanged(newState, diff);
        }

        return newState;
    };


    createCluster(cluster) {
        this.store.dispatch(addClusterToStory(cluster));
    }
}