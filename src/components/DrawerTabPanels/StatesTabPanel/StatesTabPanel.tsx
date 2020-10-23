import { connect } from 'react-redux'
import { FunctionComponent } from 'react'
import * as React from 'react'
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { ShapeLegend } from './ShapeLegend/ShapeLegend'
import { setSelectedVectorByShapeAction } from "../../Ducks/SelectedVectorByShapeDuck"
import { setVectorByShapeAction } from "../../Ducks/VectorByShapeDuck"
import { setCheckedShapesAction } from "../../Ducks/CheckedShapesDuck"

type StatesTabPanelProps = {
    categoryOptions: any
    dataset: any
    selectedVectorByShape: any
    vectorByShape: any
    setSelectedVectorByShape: any
    setCheckedShapes: any
    setVectorByShape: any
}

const mapStateToProps = state => ({
    selectedVectorByShape: state.selectedVectorByShape,
    vectorByShape: state.vectorByShape,
    dataset: state.dataset,
    categoryOptions: state.categoryOptions
})

const mapDispatchToProps = dispatch => ({
    setSelectedVectorByShape: selectedVectorByShape => dispatch(setSelectedVectorByShapeAction(selectedVectorByShape)),
    setVectorByShape: vectorByShape => dispatch(setVectorByShapeAction(vectorByShape)),
    setCheckedShapes: checkedShapes => dispatch(setCheckedShapesAction(checkedShapes))
})

export const StatesTabPanelFull: FunctionComponent<StatesTabPanelProps> = ({
    selectedVectorByShape,
    vectorByShape,
    dataset,
    setSelectedVectorByShape,
    setVectorByShape,
    setCheckedShapes,
    categoryOptions
}) => {
    return <div>
        {
            categoryOptions != null && categoryOptions.hasCategory("shape") ?
                <Grid
                    container
                    justify="center"
                    alignItems="stretch"
                    direction="column"
                    style={{ padding: '0 16px' }}>
                    <FormControl style={{ margin: '4px 0px' }}>
                        <InputLabel shrink id="vectorByShapeSelectLabel">{"shape by"}</InputLabel>
                        <Select labelId="vectorByShapeSelectLabel"
                            id="vectorByShapeSelect"
                            displayEmpty
                            value={selectedVectorByShape}
                            onChange={(event) => {
                                setSelectedVectorByShape(event.target.value)

                                if (event.target.value != null && event.target.value != "") {
                                    var attribute = categoryOptions.getCategory("shape").attributes.filter(a => a.key == event.target.value)[0]
                                    setVectorByShape(attribute)
                                } else {
                                    setVectorByShape(null)
                                }
                            }}
                        >
                            <MenuItem value="">None</MenuItem>
                            {categoryOptions.getCategory("shape").attributes.map(attribute => {
                                return <MenuItem key={attribute.key} value={attribute.key}>{attribute.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Grid>

                :
                <div></div>
        }

        <Grid item style={{ padding: '0 16px' }}>
            <ShapeLegend
                dataset={dataset}
                category={vectorByShape}
                onChange={(checkboxes) => {
                    setCheckedShapes(checkboxes)
                }}></ShapeLegend>
        </Grid>
    </div>
}


export const StatesTabPanel = connect(mapStateToProps, mapDispatchToProps)(StatesTabPanelFull)