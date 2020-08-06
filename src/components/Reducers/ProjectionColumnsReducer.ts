const projectionColumns = (state = null, action) => {
    let copy = null
    switch (action.type) {
        case 'SET_PROJECTION_COLUMNS':
            return action.projectionColumns
        case 'SET_PROJECTION_COLUMNS_ENTRY':
            copy = [...state]
            copy[action.index].checked = action.value
            return copy

        case 'SET_PROJECTION_COLUMNS_SHIFT':
            copy = [...state]
            if (action.last <= action.index) {
                for (let i = action.last; i <= action.index; i++) {
                    copy[i].checked = true
                }
            } else {
                for (let i = action.index; i <= action.last; i++) {
                    copy[i].checked = true
                }
            }
            
            return copy

        default:
            return state
    }
}

export default projectionColumns