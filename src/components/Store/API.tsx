import { applyMiddleware, createStore, Reducer, Store, PreloadedState } from "redux";
import { addCluster } from "../Ducks/StoriesDuck";
import { rootReducer, RootState } from "../Store/Store";
import thunk from 'redux-thunk';
import { v4 as uuidv4 } from 'uuid';
import { getStoreDiff } from "./PluginScript";
import { RootActions } from "./RootActions";
import { SchemeColor } from "../Utility";
import { IBaseProjection } from "../..";



/**
 * Main api class for PSE.
 */
export class API<T extends RootState> {
    store: Store<T>;
    onStateChanged: (newState: T, difference: Partial<T>) => void;
    id: string;



    /**
     * Creates a PSE API (store).
     * 
     * @param dump the dump which contains parts of store state
     * @param reducer the root reducer of the store, MUST be created with PSE´s inbuilt createRootReducer method.
     */
    constructor(dump: any, reducer: Reducer) {
        this.id = uuidv4();

        if (dump) {
            this.store = createStore(reducer ? reducer : rootReducer, dump, applyMiddleware(this.differenceMiddleware, thunk));
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
    partialHydrate(dump: any) {
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
    partialDump(excluded: string[]): any {
        const set = new Set(excluded)
        const state = this.store.getState()

        const partial = {}

        // Copy all included keys to partial object
        Object.keys(state).filter(key => !set.has(key))
            .forEach(key => { partial[key] = state[key] })

        return partial
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



    generateImage() {
        function calcBounds(workspace: IBaseProjection) {
            // Get rectangle that fits around data set
            var minX = 1000, maxX = -1000, minY = 1000, maxY = -1000;
            workspace.forEach(sample => {
                minX = Math.min(minX, sample.x)
                maxX = Math.max(maxX, sample.x)
                minY = Math.min(minY, sample.y)
                maxY = Math.max(maxY, sample.y)
            })
    
            return {
                x: minX,
                y: minY,
                width: maxX - minX,
                height: maxY - minY,
                left: minX,
                top: minY,
                right: maxX,
                bottom: maxY
            }
        }




        var canvas = new OffscreenCanvas(256, 256)
        var ctx = canvas.getContext("2d")
        
        //This line is actually not even needed...
        ctx.beginPath()
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.closePath()
        ctx.beginPath()

        const state = this.store.getState()

        const mapping = state.pointColorMapping

        const bounds = calcBounds(state.projections.workspace)

        const offsetX = -(bounds.left)
        const offsetY = -(bounds.top)

        const padding = 16

        state.projections.workspace.forEach((value, index) => {
            const {x, y} = value
            
            const color = mapping.map(state.dataset.vectors[index][state.channelColor.key]) as SchemeColor
            ctx.fillStyle = color.hex
            ctx.moveTo(x, y)
            ctx.arc(padding + (offsetX + x) * ((256 - 2 * padding) / bounds.width), (padding + (offsetY + y) * ((256 - 2 * padding) / bounds.height)), 4, 0, 2 * Math.PI)
            ctx.fill()
           
        })

        canvas.convertToBlob({
            type: "image/jpeg",
            quality: 1
        }).then((result) => {
            downloadBlob(result, "test.jpg")
        })

        function downloadBlob(blob, name = 'file.txt') {
            // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
            const blobUrl = URL.createObjectURL(blob);

            // Create a link element
            const link = document.createElement("a");

            // Set link's href to point to the Blob URL
            link.href = blobUrl;
            link.download = name;

            // Append link to the body
            document.body.appendChild(link);

            // Dispatch click event on the link
            // This is necessary as link.click() does not work on the latest firefox
            link.dispatchEvent(
                new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                })
            );

            // Remove link from body
            document.body.removeChild(link);
        }
    }
}