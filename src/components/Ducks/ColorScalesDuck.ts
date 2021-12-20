import { ANormalized, NormalizedDictionary } from "../Utility/NormalizedState";
import { SchemeColor } from "../Utility";
import { RootState } from "../Store";





const palettes = {
    dark2: [
        new SchemeColor("#1b9e77"),
        new SchemeColor("#d95f02"),
        new SchemeColor("#e7298a"),
        new SchemeColor("#7570b3"),
        new SchemeColor("#66a61e"),
        new SchemeColor("#e6ab02"),
        new SchemeColor("#a6761d"),
        new SchemeColor("#666666")
    ],
    accent: [
        new SchemeColor("#7fc97f"),
        new SchemeColor("#beaed4"),
        new SchemeColor("#fdc086"),
        new SchemeColor("#ffff99"),
        new SchemeColor("#386cb0"),
        new SchemeColor("#f0027f"),
        new SchemeColor("#bf5b17"),
        new SchemeColor("#666666")
    ],
    paired: [
        new SchemeColor("#a6cee3"),
        new SchemeColor("#1f78b4"),
        new SchemeColor("#b2df8a"),
        new SchemeColor("#33a02c"),
        new SchemeColor("#fb9a99"),
        new SchemeColor("#e31a1c"),
        new SchemeColor("#fdbf6f"),
        new SchemeColor("#ff7f00"),
        new SchemeColor("#cab2d6"),
        new SchemeColor("#6a3d9a"),
        new SchemeColor("#ffff99"),
        new SchemeColor("#b15928")
    ]
}




export const APalette = {
    getByName: (palette: string) => {
        return palettes[palette] as SchemeColor[]
    }
}




enum ActionTypes {
    PICK_SCALE = "ducks/colorScales/PICK"
}


type PickAction = {
    type: ActionTypes.PICK_SCALE
    handle: string
}

export const ColorScalesActions = {
    pickScale: (handle: string) => ({
        type: ActionTypes.PICK_SCALE,
        handle
    }),
    initScaleByType: (type: string) =>{
        return (dispatch, getState) => {
            const state: RootState = getState()

            const handle = ANormalized.entries<BaseColorScale>(state.colorScales.scales).find(([key, value]) => {
                return value.type === type
            })[0]

            return dispatch({
                type: ActionTypes.PICK_SCALE,
                handle
            })
        }
    }
}



type Action = PickAction

type Palette = 'dark2' | 'accent' | 'paired' | SchemeColor[]

/**
 * Type for embedding state slice
 */
type StateType = {
    scales: NormalizedDictionary<BaseColorScale>
    active: string
}


export type BaseColorScale = {
    palette: Palette
    type: 'sequential' | 'diverging' | 'categorical'
    dataClasses?: number
}

/**
 * Initial state
 */
const initialState: StateType = function () {
    const state = {
        scales: ANormalized.create<BaseColorScale>(),
        active: null
    }

    ANormalized.add(state.scales, {
        palette: 'dark2',
        type: 'categorical',
        dataClasses: 8
    })

    ANormalized.add(state.scales, {
        palette: 'dark2',
        type: 'sequential'
    })

    ANormalized.add(state.scales, {
        palette: 'accent',
        type: 'categorical'
    })

    ANormalized.add(state.scales, {
        palette: 'paired',
        type: 'categorical'
    })

    return state
}()





export default function colorScales(state = initialState, action?: Action): StateType {
    switch (action?.type) {
        case ActionTypes.PICK_SCALE: {
            return { ...state, active: action.handle }
        }
        default:
            return state
    }
}