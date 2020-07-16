import { connect } from 'react-redux'
import { DiscreteMapping } from '../../../../util/colors'
import React = require('react')
import { FormControlLabel, Checkbox, Typography, Grid } from '@material-ui/core'
import { setAdvancedColoringSelectionAction } from '../../../../Actions/Actions'

const mapStateToProps = state => ({
    advancedColoringSelection: state.advancedColoringSelection
})


const mapDispatchToProps = dispatch => ({
    setAdvancedColoringSelection: advancedColoringSelection => dispatch(setAdvancedColoringSelectionAction(advancedColoringSelection))
})

type ShowColorLegendProps = {
    mapping: any
    advancedColoringSelection: boolean[]
    setAdvancedColoringSelection: Function
}

export var AdvancedColoringLegend = connect(mapStateToProps, mapDispatchToProps)(({ mapping, advancedColoringSelection, setAdvancedColoringSelection }: ShowColorLegendProps) => {
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
})