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
import { setChannelBrightnessSelection } from '../../Ducks/ChannelBrightnessDuck'
import { setGlobalPointBrightness } from '../../Ducks/GlobalPointBrightnessDuck'
import { BrightnessSlider } from './BrightnessSlider/BrightnessSlider'
import { setChannelSize } from '../../Ducks/ChannelSize'
import { setGlobalPointSize } from '../../Ducks/GlobalPointSizeDuck'
import { SizeSlider } from './SizeSlider/SizeSlider'

const mapStateToProps = (state: RootState) => ({
    selectedVectorByShape: state.selectedVectorByShape,
    selectedLineBy: state.selectedLineBy,
    vectorByShape: state.vectorByShape,
    dataset: state.dataset,
    categoryOptions: state.categoryOptions,
    webGlView: state.webGLView,
    channelBrightness: state.channelBrightness,
    channelSize: state.channelSize
})

const mapDispatchToProps = dispatch => ({
    setSelectedVectorByShape: selectedVectorByShape => dispatch(setSelectedVectorByShapeAction(selectedVectorByShape)),
    setVectorByShape: vectorByShape => dispatch(setVectorByShapeAction(vectorByShape)),
    setCheckedShapes: checkedShapes => dispatch(setCheckedShapesAction(checkedShapes)),
    setSelectedLineBy: lineBy => dispatch(setSelectedLineBy(lineBy)),
    setChannelBrightness: value => dispatch(setChannelBrightnessSelection(value)),
    setGlobalPointBrightness: value => dispatch(setGlobalPointBrightness(value)),
    setChannelSize: value => dispatch(setChannelSize(value)),
    setGlobalPointSize: value => dispatch(setGlobalPointSize(value))
})




const connector = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux

/**
 

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

 */

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
    webGlView,
    channelBrightness,
    setChannelBrightness,
    setGlobalPointBrightness,
    channelSize,
    setChannelSize,
    setGlobalPointSize
}: Props) => {
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


        {
            categoryOptions != null && categoryOptions.hasCategory("transparency") ?
                <Grid
                    container
                    justify="center"
                    alignItems="stretch"
                    direction="column"
                    style={{ padding: '0 16px' }}>
                    <FormControl style={{ margin: '4px 0px' }}>
                        <InputLabel shrink id="vectorByTransparencySelectLabel">{"brightness by"}</InputLabel>
                        <Select labelId="vectorByTransparencySelectLabel"
                            id="vectorByTransparencySelect"
                            displayEmpty
                            value={channelBrightness ? channelBrightness.key : ''}
                            onChange={(event) => {
                                var attribute = categoryOptions.getCategory("transparency").attributes.filter(a => a.key == event.target.value)[0]

                                if (attribute == undefined) {
                                    attribute = null
                                }

                                let pointBrightness = attribute ? [0.25, 1] : [1]

                                setGlobalPointBrightness(pointBrightness)
                                setChannelBrightness(attribute)
                                webGlView.current.particles.transparencyCat(attribute, pointBrightness)
                                webGlView.current.requestRender()
                            }}
                        >
                            <MenuItem value="">None</MenuItem>
                            {categoryOptions.getCategory("transparency").attributes.map(attribute => {
                                return <MenuItem key={attribute.key} value={attribute.key}>{attribute.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                :
                <div></div>
        }

        <BrightnessSlider></BrightnessSlider>




        {
            categoryOptions != null && categoryOptions.hasCategory("size") ?
                <Grid
                    container
                    justify="center"
                    alignItems="stretch"
                    direction="column"
                    style={{ padding: '0 16px' }}>
                    <FormControl style={{ margin: '4px 0px' }}>
                        <InputLabel shrink id="vectorBySizeSelectLabel">{"size by"}</InputLabel>
                        <Select labelId="vectorBySizeSelectLabel"
                            id="vectorBySizeSelect"
                            displayEmpty
                            value={channelSize ? channelSize.key : ''}
                            onChange={(event) => {
                                var attribute = categoryOptions.getCategory("size").attributes.filter(a => a.key == event.target.value)[0]
                                if (attribute == undefined) {
                                    attribute = null
                                }

                                let pointSize = attribute ? [1, 2] : [1]

                                setGlobalPointSize(pointSize)

                                setChannelSize(attribute)

                                webGlView.current.particles.sizeCat(attribute, pointSize)
                            }}
                        >
                            <MenuItem value="">None</MenuItem>
                            {categoryOptions.getCategory("size").attributes.map(attribute => {
                                return <MenuItem key={attribute.key} value={attribute.key}>{attribute.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                :
                <div></div>
        }

        <SizeSlider></SizeSlider>

    </div>
}


export const StatesTabPanel = connector(StatesTabPanelFull)


/**
 *
         {
            categoryOptions != null && categoryOptions.hasCategory("size") ?
                <Grid
                    container
                    justify="center"
                    alignItems="stretch"
                    direction="column"
                    style={{ padding: '0 16px' }}>
                    <FormControl style={{ margin: '4px 0px' }}>
                        <InputLabel shrink id="vectorBySizeSelectLabel">{"size by"}</InputLabel>
                        <Select labelId="vectorBySizeSelectLabel"
                            id="vectorBySizeSelect"
                            displayEmpty
                            value={channelSize ? channelSize.key : ''}
                            onChange={(event) => {
                                var attribute = categoryOptions.getCategory("size").attributes.filter(a => a.key == event.target.value)[0]
                                if (attribute == undefined) {
                                    attribute = null
                                }

                                let pointSize = attribute ? [1, 2] : [1]

                                setGlobalPointSize(pointSize)

                                setChannelSize(attribute)

                                webGlView.current.particles.sizeCat(attribute, pointSize)
                            }}
                        >
                            <MenuItem value="">None</MenuItem>
                            {categoryOptions.getCategory("size").attributes.map(attribute => {
                                return <MenuItem key={attribute.key} value={attribute.key}>{attribute.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                :
                <div></div>
        }
 */