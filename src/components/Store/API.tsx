import { applyMiddleware, createStore, Reducer, Store, PreloadedState } from "redux";
import { addCluster } from "../Ducks/StoriesDuck";
import { rootReducer, RootState } from "../Store/Store";
import thunk from 'redux-thunk';
import { v4 as uuidv4 } from 'uuid';
import { getStoreDiff } from "./PluginScript";
import { RootActions } from "./RootActions";
import { SchemeColor } from "../Utility";
import { IBaseProjection } from "../..";

var catRomSpline = require('cat-rom-spline');
import dataset from "../Ducks/DatasetDuck";




const blobToBase64 = (blob) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    return new Promise<string>(resolve => {
        reader.onloadend = () => {
            var b64 = reader.result as string

            b64 = b64.replace(/^data:.+;base64,/, '');

            resolve(b64);
        };
    });
};






/**
 * Main api class for PSE.
 */
export class API<T extends RootState> {
    store: Store<T>;
    onStateChanged: (newState: T, difference: Partial<T>, action: any) => void;
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
            this.onStateChanged(newState, diff, action);
        }

        return newState;
    };



    generateImage(width: number, height: number, padding: number, options: any, ctx?: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D): Promise<string> {
        const provided = ctx !== null && ctx !== undefined

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

       
        


        function solve(data, k) {

            if (k == null) k = 1;

            var size = data.length;
            var last = size - 4;

            var path = "M" + [data[0], data[1]];

            for (var i = 0; i < size - 2; i += 2) {

                var x0 = i ? data[i - 2] : data[0];
                var y0 = i ? data[i - 1] : data[1];

                var x1 = data[i + 0];
                var y1 = data[i + 1];

                var x2 = data[i + 2];
                var y2 = data[i + 3];

                var x3 = i !== last ? data[i + 4] : x2;
                var y3 = i !== last ? data[i + 5] : y2;

                var cp1x = x1 + (x2 - x0) / 6 * k;
                var cp1y = y1 + (y2 - y0) / 6 * k;

                var cp2x = x2 - (x3 - x1) / 6 * k;
                var cp2y = y2 - (y3 - y1) / 6 * k;

                path += "C" + [cp1x, cp1y, cp2x, cp2y, x2, y2];
            }

            return path;
        }


        if (!ctx) {
            var canvas = new OffscreenCanvas(width, height)
            ctx = canvas.getContext("2d")
        }


        //This line is actually not even needed...
        ctx.beginPath()
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = options?.backgroundColor ?? '#fff';
        ctx.rect(0, 0, width, height);
        ctx.fill();
        ctx.closePath()
        ctx.beginPath()

        const state = this.store.getState()

        const mapping = state.pointColorMapping

        const bounds = calcBounds(state.projections.workspace)

        const offsetX = -(bounds.left)
        const offsetY = -(bounds.top)


        const sx = (x: number) => {
            return padding + (offsetX + x) * ((width - 2 * padding) / bounds.width)
        }

        const sy = (y: number) => {
            return height - (padding + (offsetY + y) * ((height - 2 * padding) / bounds.height))
        }

        if (state.dataset.isSequential) {
            ctx.globalAlpha = 0.5;
            ctx.lineWidth = options?.lineWidth ?? 2;

            state.dataset.segments.forEach((segment) => {
                const points = segment.vectors.map((vector) => [sx(vector.x), sy(vector.y)]).flat()

                const path = new Path2D(solve(points, 1))

                ctx.strokeStyle = segment.__meta__.intrinsicColor.hex
                ctx.stroke(path)

                //creatpath)ePath(ctx, points, 10, false)
            })
        }

        ctx.lineWidth = 1;
        ctx.globalAlpha = 1;

        state.projections.workspace.forEach((value, index) => {
            const { x, y } = value

            const color = mapping.map(state.dataset.vectors[index][state.channelColor.key]) as SchemeColor
            ctx.beginPath()

            ctx.fillStyle = color.hex
            ctx.strokeStyle = color.hex
            ctx.globalAlpha = options?.pointBrightness ?? 0.5
            ctx.moveTo(sx(x), sy(y))
            ctx.arc(sx(x), sy(y), options?.pointSize ?? 4, 0, 2 * Math.PI)
            ctx.fill()
            ctx.stroke();

        })

        ctx.globalAlpha = 1;


        return new Promise<string>((resolve, reject) => {
            if (!provided) {

                canvas.convertToBlob({
                    type: "image/jpeg",
                    quality: 1
                }).then((result) => {
                    blobToBase64(result).then((result) => {
                        resolve(result)
                    })
                })
            } else {
                resolve('')
            }
        })
    }
}