import { ANormalized, NormalizedDictionary } from "../Utility/NormalizedState";
import { SchemeColor } from "../Utility";
import { RootState } from "../Store";





const palettes = {
    // categorical
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
    ],

    // sequential
    Greys: [
        new SchemeColor("#ffffff"),
        new SchemeColor("#000000"),
    ],
    YlOrRd: [
        new SchemeColor("#ffffcc"),
        new SchemeColor("#fd8d3c"),
        new SchemeColor("#800026"),
    ],
    Viridis: [
        new SchemeColor("#440154"),
        new SchemeColor("#482475"),
        new SchemeColor("#414487"),
        new SchemeColor("#355f8d"),
        new SchemeColor("#2a788e"),
        new SchemeColor("#21908d"),
        new SchemeColor("#22a884"),
        new SchemeColor("#42be71"),
        new SchemeColor("#7ad151"),
        new SchemeColor("#bddf26"),
        new SchemeColor("#bddf26")
    ],

    // diverging
    BrBG: [
        new SchemeColor("#543005"),
        new SchemeColor("#f5f5f5"),
        new SchemeColor("#003c30"),
    ],
    PRGn: [
        new SchemeColor("#40004b"),
        new SchemeColor("#f7f7f7"),
        new SchemeColor("#00441b"),
    ],
    SHAP: [
        new SchemeColor("#1e88e5"),
        new SchemeColor("#ffffff"),
        new SchemeColor("#ff0d57"),
    ],

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

type Palette = 'dark2' | 'accent' | 'paired' | 'YlOrRd' | 'Greys' | 'Viridis' | 'BrBG' | 'PRGn' | 'SHAP' | SchemeColor[]

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
        palette: 'accent',
        type: 'categorical'
    })

    ANormalized.add(state.scales, {
        palette: 'paired',
        type: 'categorical'
    })

    ANormalized.add(state.scales, {
        palette: 'YlOrRd',
        type: 'sequential'
    })
    
    ANormalized.add(state.scales, {
        palette: 'Greys',
        type: 'sequential'
    })
    
    ANormalized.add(state.scales, {
        palette: 'Viridis',
        type: 'sequential'
    })

    ANormalized.add(state.scales, {
        palette: 'BrBG',
        type: 'diverging'
    })
    
    ANormalized.add(state.scales, {
        palette: 'PRGn',
        type: 'diverging'
    })
    
    ANormalized.add(state.scales, {
        palette: 'SHAP',
        type: 'diverging'
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