import { applyMiddleware, createStore, Store } from "redux";
import { addClusterToStory } from "../Ducks/StoriesDuck";
import { rootReducer, RootState } from "../Store/Store";
import thunk from 'redux-thunk';
import { IVector } from "../../model/Vector";
import { connect } from "react-redux";

import { v4 as uuidv4 } from 'uuid';

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
}







export class PluginRegistry {
    private static instance: PluginRegistry;

    private plugins: PSEPlugin[] = []

    private constructor() { }

    public static getInstance(): PluginRegistry {
        if (!PluginRegistry.instance) {
            PluginRegistry.instance = new PluginRegistry();
        }

        return PluginRegistry.instance;
    }

    public getPlugin(type: string) {
        for (const plugin of this.plugins) {
            if (plugin.type === type) {
                return plugin
            }
        }

        return null
    }


    public registerPlugin(plugin: PSEPlugin) {
        this.plugins.push(plugin)
    }
}







export abstract class PSEPlugin {
    type: string;

    hasFileLayout(header: string[]) {
        return false
    }

    abstract createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element;

    // Checks if the header has all the required columns
    hasLayout(header: string[], columns: string[]) {
        for (let key in columns) {
            let val = columns[key];

            if (!header.includes(val)) {
                return false;
            }
        }

        return true;
    };
}



