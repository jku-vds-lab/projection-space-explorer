"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redux_1 = require("redux");
const StoriesDuck_1 = require("../Ducks/StoriesDuck");
const Store_1 = require("../Store/Store");
const redux_thunk_1 = require("redux-thunk");
const uuid_1 = require("uuid");
function getStoreDiff(storeA, storeB) {
    const diff = {};
    for (const key in storeA) {
        const valA = storeA[key];
        const valB = storeB[key];
        if (valA != valB) {
            diff[key] = valB;
        }
    }
    return diff;
}
/**
 * Main api class for PSE.
 */
class API {
    constructor(json, reducer) {
        this.differenceMiddleware = store => next => action => {
            const oldState = store.getState();
            let newState = next(action);
            const diff = getStoreDiff(oldState, store.getState());
            if (this.onStateChanged) {
                this.onStateChanged(newState, diff);
            }
            return newState;
        };
        this.id = uuid_1.v4();
        if (json) {
            const preloadedState = JSON.parse(json);
            this.store = redux_1.createStore(reducer ? reducer : Store_1.rootReducer, preloadedState, redux_1.applyMiddleware(this.differenceMiddleware, redux_thunk_1.default));
        }
        else {
            this.store = redux_1.createStore(reducer ? reducer : Store_1.rootReducer, redux_1.applyMiddleware(this.differenceMiddleware, redux_thunk_1.default));
        }
    }
    serialize() {
        return JSON.stringify(this.store.getState());
    }
    createCluster(cluster) {
        this.store.dispatch(StoriesDuck_1.addClusterToStory(cluster));
    }
}
exports.API = API;
class PluginRegistry {
    constructor() {
        this.plugins = [];
        this.reducers = [];
    }
    static getInstance() {
        if (!PluginRegistry.instance) {
            PluginRegistry.instance = new PluginRegistry();
        }
        return PluginRegistry.instance;
    }
    getPlugin(type) {
        for (const plugin of this.plugins) {
            if (plugin.type === type) {
                return plugin;
            }
        }
        return null;
    }
    registerPlugin(plugin) {
        this.plugins.push(plugin);
    }
    registerReducer(reducer) {
        this.reducers.push(reducer);
    }
}
exports.PluginRegistry = PluginRegistry;
class PSEPlugin {
    hasFileLayout(header) {
        return false;
    }
    // Checks if the header has all the required columns
    hasLayout(header, columns) {
        for (let key in columns) {
            let val = columns[key];
            if (!header.includes(val)) {
                return false;
            }
        }
        return true;
    }
    ;
}
exports.PSEPlugin = PSEPlugin;
