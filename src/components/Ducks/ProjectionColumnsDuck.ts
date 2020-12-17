const SET_ENTRY = "ducks/projectionColumns/SET_ENTRY"
const SET_SHIFT = "ducks/projectionColumns/SET_SHIFT"
const SET = "ducks/projectionColumns/SET"

const projectionColumns = (state = [], action) => {
    let copy = null
    
    switch (action.type) {
        case SET:
            return action.projectionColumns
        case SET_ENTRY:
            copy = [...state]
            
            if ("checked" in action.value)
                copy[action.index].checked = action.value.checked
            if ("normalized" in action.value)
                copy[action.index].normalized = action.value.normalized
            return copy

        case SET_SHIFT:
            copy = [...state]
            if (action.last <= action.index) {
                for (let i = action.last + 1; i <= action.index; i++) {
                    copy[i].checked = !copy[i].checked
                }
            } else {
                for (let i = action.index; i <= action.last - 1; i++) {
                    copy[i].checked = !copy[i].checked
                }
            }
            
            return copy

        default:
            return state
    }
}

export const setProjectionColumns = projectionColumns => ({
    type: SET,
    projectionColumns: projectionColumns
})


export const setProjectionColumnsEntry = (index, value) => ({
    type: SET_ENTRY,
    index: index,
    value: value
})

export const setProjectionColumnsShift = (last, index) => ({
    type: SET_SHIFT,
    last: last,
    index: index
})

export default projectionColumns