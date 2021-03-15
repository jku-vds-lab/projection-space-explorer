import { connect, ConnectedProps } from 'react-redux'
import { FunctionComponent } from 'react'
import * as React from 'react'
import { Grid, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { ShapeLegend } from './ShapeLegend/ShapeLegend'
import { setSelectedVectorByShapeAction } from "../../Ducks/SelectedVectorByShapeDuck"
import { setVectorByShapeAction } from "../../Ducks/VectorByShapeDuck"
import { setCheckedShapesAction } from "../../Ducks/CheckedShapesDuck"
import { RootState } from '../../Store/Store'
import { setSelectedLineBy } from '../../Ducks/SelectedLineByDuck'

const mapStateToProps = (state: RootState) => ({
    selectedVectorByShape: state.selectedVectorByShape,
    selectedLineBy: state.selectedLineBy,
    vectorByShape: state.vectorByShape,
    dataset: state.dataset,
    categoryOptions: state.categoryOptions,
    webGlView: state.webGLView
})

const mapDispatchToProps = dispatch => ({
    setSelectedVectorByShape: selectedVectorByShape => dispatch(setSelectedVectorByShapeAction(selectedVectorByShape)),
    setVectorByShape: vectorByShape => dispatch(setVectorByShapeAction(vectorByShape)),
    setCheckedShapes: checkedShapes => dispatch(setCheckedShapesAction(checkedShapes)),
    setSelectedLineBy: lineBy => dispatch(setSelectedLineBy(lineBy))
})




const connector = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux



export const StatesTabPanelFull = ({
    selectedVectorByShape,
    vectorByShape,
    dataset,
    setSelectedVectorByShape,
    setVectorByShape,
    setCheckedShapes,
    categoryOptions,
    selectedLineBy,
    setSelectedLineBy,
    webGlView
}: Props) => {
    return <div>
        {
            <FormControl style={{ margin: '4px 0px' }}>
                <InputLabel shrink id="lineByLabel">{"line by"}</InputLabel>
                <Select labelId="lineByLabel"
                    id="lineBySelect"
                    displayEmpty
                    value={selectedLineBy.value}
                    onChange={(event) => {
                        setSelectedLineBy(event.target.value)

                        webGlView.current.recreateLines(event.target.value)
                        /**if (event.target.value != null && event.target.value != "") {
                            var attribute = categoryOptions.getCategory("shape").attributes.filter(a => a.key == event.target.value)[0]
                            setVectorByShape(attribute)
                        } else {
                            setVectorByShape(null)
                        }**/
                    }}
                >
                    <MenuItem value="">None</MenuItem>
                    {
                        selectedLineBy.options.map((option, i) => {
                            return <MenuItem key={option} value={option}>{option}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        }

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


export const StatesTabPanel = connector(StatesTabPanelFull)