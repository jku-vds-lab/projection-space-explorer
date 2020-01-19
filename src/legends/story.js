export var StoryLegend = ({ selectionState }) => {
    console.log(selectionState)
    if (selectionState == null) {
        return <div></div>
    }

    return <div>{selectionState.legend}</div>
}