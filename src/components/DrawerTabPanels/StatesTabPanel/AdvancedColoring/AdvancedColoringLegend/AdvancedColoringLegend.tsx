import { connect } from 'react-redux'
import { DiscreteMapping } from "../../../../util/Colors/DiscreteMapping"
import React = require('react')
import { FormControlLabel, Checkbox, Typography, Grid } from '@material-ui/core'
import { setAdvancedColoringSelectionAction } from "../../../../Ducks/AdvancedColoringSelectionDuck"

const mapStateToProps = state => ({
    advancedColoringSelection: state.advancedColoringSelection,
    mapping: state.pointColorMapping
})


const mapDispatchToProps = dispatch => ({
    setAdvancedColoringSelection: advancedColoringSelection => dispatch(setAdvancedColoringSelectionAction(advancedColoringSelection))
})

type ShowColorLegendProps = {
    mapping: any
    advancedColoringSelection: boolean[]
    setAdvancedColoringSelection: Function
}


export var AdvancedColoringLegendFull = ({ mapping, advancedColoringSelection, setAdvancedColoringSelection }: ShowColorLegendProps) => {
    if (mapping == undefined || mapping == null) {
        return <div></div>
    }

    if (mapping instanceof DiscreteMapping) {
        return <Grid container direction="column" style={{ padding: '12px 0px', minWidth: 300 }}>
            {mapping.values.map((value, index) => {
                var color = mapping.map(value)
                return <FormControlLabel key={index} style={{ margin: '0 8px' }}
                    control={<Checkbox style={{ padding: '3px 9px' }} disableRipple
                        color="primary" size='small' checked={advancedColoringSelection[index]} onChange={(event) => {
                            var values = advancedColoringSelection.splice(0)
                            values[event.target.value] = event.target.checked
                            setAdvancedColoringSelection(values)
                        }} value={index}></Checkbox>}
                    label={<Typography style={{ color: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})` }}>{value}</Typography>}
                ></FormControlLabel>
            })}</Grid>
    }

    return <div></div>
}

export const AdvancedColoringLegend = connect(mapStateToProps, mapDispatchToProps)(AdvancedColoringLegendFull)