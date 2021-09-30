import { applyMiddleware, createStore, Store } from "redux";
import { addClusterToStory } from "../Ducks/StoriesDuck";
import { rootReducer, RootState } from "../Store/Store";
import thunk from 'redux-thunk';
import { IVector } from "../../model/Vector";
import React = require("react");
import { connect } from "react-redux";
import { DatasetType } from "../../model/DatasetType";
import { RubikFingerprint } from "../legends/RubikFingerprint/RubikFingerprint";
import { ChessFingerprint } from "../legends/ChessFingerprint/ChessFingerprint";
import { CoralLegend } from "../legends/CoralDetail/CoralDetail";
import { ChemLegendParent } from "../legends/ChemDetail/ChemDetail";


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
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
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







abstract class PSEPlugin {
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






class RubikPlugin extends PSEPlugin {
    type = DatasetType.Rubik;

    hasFileLayout(header: string[]) {
        const requiredRubikColumns = [
            "up00", "up01", "up02", "up10", "up11", "up12", "up20", "up21", "up22",
            "front00", "front01", "front02", "front10", "front11", "front12", "front20", "front21", "front22",
            "right00", "right01", "right02", "right10", "right11", "right12", "right20", "right21", "right22",
            "left00", "left01", "left02", "left10", "left11", "left12", "left20", "left21", "left22",
            "down00", "down01", "down02", "down10", "down11", "down12", "down20", "down21", "down22",
            "back00", "back01", "back02", "back10", "back11", "back12", "back20", "back21", "back22"]


        return this.hasLayout(header, requiredRubikColumns)
    }

    createFingerprint(vectors: IVector[], scale: number = 1, aggregate: boolean): JSX.Element {
        return <RubikFingerprint vectors={vectors} width={81 * scale} height={108 * scale}></RubikFingerprint>
    }
}


class ChessPlugin extends PSEPlugin {
    type = DatasetType.Chess;

    hasFileLayout(header: string[]) {
        const requiredChessColumns = [];

        ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].forEach(c => {
            [1, 2, 3, 4, 5, 6, 7, 8].forEach(n => {
                requiredChessColumns.push(`${c}${n}`)
            })
        })

        return this.hasLayout(header, requiredChessColumns)
    }

    createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element {
        return <ChessFingerprint vectors={vectors} width={144 * scale} height={144 * scale}></ChessFingerprint>
    }
}

class CoralPlugin extends PSEPlugin {
    type = DatasetType.Cohort_Analysis;

    createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element {
        return <CoralLegend selection={vectors} aggregate={aggregate}></CoralLegend>
    }
}
class ChemPlugin extends PSEPlugin {
    type = DatasetType.Chem;

    createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element {
        return <ChemLegendParent selection={vectors} aggregate={aggregate}></ChemLegendParent>
    }
}




PluginRegistry.getInstance().registerPlugin(new RubikPlugin())
PluginRegistry.getInstance().registerPlugin(new ChessPlugin())
PluginRegistry.getInstance().registerPlugin(new CoralPlugin())
PluginRegistry.getInstance().registerPlugin(new ChemPlugin())