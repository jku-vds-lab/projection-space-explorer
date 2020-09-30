const projectionColumns = (state = null, action) => {
    let copy = null
    switch (action.type) {
        case 'SET_PROJECTION_COLUMNS':
            return action.projectionColumns
        case 'SET_PROJECTION_COLUMNS_ENTRY':
            copy = [...state]
            
            if ("checked" in action.value)
                copy[action.index].checked = action.value.checked
            if ("normalized" in action.value)
                copy[action.index].normalized = action.value.normalized
            return copy

        case 'SET_PROJECTION_COLUMNS_SHIFT':
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

export default projectionColumns