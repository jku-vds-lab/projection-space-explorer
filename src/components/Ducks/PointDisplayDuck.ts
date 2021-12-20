import { createSlice, PayloadAction } from '@reduxjs/toolkit'

type ICheckedMarks = { 'star': boolean, 'cross': boolean, 'circle': boolean, 'square': boolean }

type IPointDisplay = {
    checkedShapes: ICheckedMarks
}

const initialState: IPointDisplay = {
    checkedShapes: { 'star': true, 'cross': true, 'circle': true, 'square': true }
}

const pointDisplaySlice = createSlice({
    name: 'pointDisplay',
    initialState,
    reducers: {
        setCheckedShapes(state, action: PayloadAction<ICheckedMarks>) {
            state.checkedShapes = { ...action.payload }
        },
        toggleShape(state, action: PayloadAction<{ key: string, value: boolean }>) {
            state.checkedShapes[action.payload.key] = action.payload.value
        }
    }
})

export const PointDisplayActions = pointDisplaySlice.actions
export const PointDisplayReducer = pointDisplaySlice.reducer