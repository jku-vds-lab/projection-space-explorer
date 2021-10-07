import { connect, ConnectedProps } from 'react-redux'
import * as React from 'react'
import { Grid, FormControl, InputLabel, Select, MenuItem, Typography, Divider, Box, Accordion, AccordionSummary, AccordionDetails, makeStyles } from '@material-ui/core'
import { ShapeLegend } from './ShapeLegend'
import { setSelectedVectorByShapeAction } from "../../Ducks/SelectedVectorByShapeDuck"
import { setVectorByShapeAction } from "../../Ducks/VectorByShapeDuck"
import { setCheckedShapesAction } from "../../Ducks/CheckedShapesDuck"
import { RootState } from '../../Store/Store'
import { setSelectedLineBy } from '../../Ducks/SelectedLineByDuck'
import { setChannelBrightnessSelection } from '../../Ducks/ChannelBrightnessDuck'
import { setGlobalPointBrightness } from '../../Ducks/GlobalPointBrightnessDuck'
import { BrightnessSlider } from './BrightnessSlider'
import { setChannelSize } from '../../Ducks/ChannelSize'
import { setGlobalPointSize } from '../../Ducks/GlobalPointSizeDuck'
import { SizeSlider } from './SizeSlider'
import { ColorScaleSelect } from './ColorScaleSelect'
import { AdvancedColoringPopover } from './AdvancedColoringPopover'
import { setChannelColor } from '../../Ducks/ChannelColorDuck'
import { setAdvancedColoringSelectionAction } from '../../Ducks/AdvancedColoringSelectionDuck'
import { PathLengthFilter } from './PathLengthFilter'
import { LineTreePopover } from './LineTreePopover'
import { PathBrightnessSlider } from './PathBrightnessSlider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CategoryOptionsAPI } from '../../WebGLView/CategoryOptions'

const mapStateToProps = (state: RootState) => ({
    selectedVectorByShape: state.selectedVectorByShape,
    selectedLineBy: state.selectedLineBy,
    vectorByShape: state.vectorByShape,
    dataset: state.dataset,
    categoryOptions: state.categoryOptions,
    channelBrightness: state.channelBrightness,
    channelSize: state.channelSize,
    channelColor: state.channelColor
})

const mapDispatchToProps = dispatch => ({
    setSelectedVectorByShape: selectedVectorByShape => dispatch(setSelectedVectorByShapeAction(selectedVectorByShape)),
    setVectorByShape: vectorByShape => dispatch(setVectorByShapeAction(vectorByShape)),
    setCheckedShapes: checkedShapes => dispatch(setCheckedShapesAction(checkedShapes)),
    setSelectedLineBy: lineBy => dispatch(setSelectedLineBy(lineBy)),
    setChannelBrightness: value => dispatch(setChannelBrightnessSelection(value)),
    setGlobalPointBrightness: value => dispatch(setGlobalPointBrightness(value)),
    setChannelSize: value => dispatch(setChannelSize(value)),
    setGlobalPointSize: value => dispatch(setGlobalPointSize(value)),
    setChannelColor: value => dispatch(setChannelColor(value)),
    setAdvancedColoringSelection: value => dispatch(setAdvancedColoringSelectionAction(value))
})




const connector = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    webGLView: any
}

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

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0,
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
    details: {
        padding: '0px',
        display: 'flex',
        flexDirection: 'column'
    }
}));


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
    webGLView,
    channelBrightness,
    setChannelBrightness,
    setGlobalPointBrightness,
    channelSize,
    setChannelSize,
    setGlobalPointSize,
    channelColor,
    setChannelColor,
    setAdvancedColoringSelection
}: Props) => {
    if (dataset == null) {
        return null;
    }

    const classes = useStyles();

    const [expanded, setExpanded] = React.useState<boolean | string>(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const points_box = <Box>
        {
            categoryOptions != null && CategoryOptionsAPI.hasCategory(categoryOptions, "shape") ?
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
                                    var attribute = CategoryOptionsAPI.getCategory(categoryOptions, "shape").attributes.filter(a => a.key == event.target.value)[0]
                                    setVectorByShape(attribute)
                                } else {
                                    setVectorByShape(null)
                                }
                            }}
                        >
                            <MenuItem value="">None</MenuItem>
                            {CategoryOptionsAPI.getCategory(categoryOptions, "shape").attributes.map(attribute => {
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
            categoryOptions != null && CategoryOptionsAPI.hasCategory(categoryOptions, "transparency") ?
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
                                var attribute = CategoryOptionsAPI.getCategory(categoryOptions, "transparency").attributes.filter(a => a.key == event.target.value)[0]

                                if (attribute == undefined) {
                                    attribute = null
                                }

                                let pointBrightness = attribute ? [0.25, 1] : [1]

                                setGlobalPointBrightness(pointBrightness)
                                setChannelBrightness(attribute)
                                webGLView.current.particles.transparencyCat(attribute, pointBrightness)
                                webGLView.current.requestRender()
                            }}
                        >
                            <MenuItem value="">None</MenuItem>
                            {CategoryOptionsAPI.getCategory(categoryOptions, "transparency").attributes.map(attribute => {
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
            categoryOptions != null && CategoryOptionsAPI.hasCategory(categoryOptions, "size") ?
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
                                var attribute = CategoryOptionsAPI.getCategory(categoryOptions, "size").attributes.filter(a => a.key == event.target.value)[0]
                                if (attribute == undefined) {
                                    attribute = null
                                }

                                let pointSize = attribute ? [1, 2] : [1]

                                setGlobalPointSize(pointSize)

                                setChannelSize(attribute)

                                webGLView.current.particles.sizeCat(attribute, pointSize)
                            }}
                        >
                            <MenuItem value="">None</MenuItem>
                            {CategoryOptionsAPI.getCategory(categoryOptions, "size").attributes.map(attribute => {
                                return <MenuItem key={attribute.key} value={attribute.key}>{attribute.name}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Grid>
                :
                <div></div>
        }

        <SizeSlider></SizeSlider>


        {
            categoryOptions != null && CategoryOptionsAPI.hasCategory(categoryOptions, "color") ?
                <Grid
                    container
                    item
                    alignItems="stretch"
                    direction="column"
                    style={{ padding: '0 16px' }}
                >

                    <Grid container item alignItems="stretch" direction="column">
                        <FormControl style={{ margin: '4px 0px' }}>
                            <InputLabel shrink id="vectorByColorSelectLabel">{"color by"}</InputLabel>
                            <Select labelId="vectorByColorSelectLabel"
                                id="vectorByColorSelect"
                                displayEmpty
                                value={channelColor ? channelColor.key : ""}
                                onChange={(event) => {
                                    var attribute = null
                                    if (event.target.value != "") {
                                        attribute = CategoryOptionsAPI.getCategory(categoryOptions, "color").attributes.filter(a => a.key == event.target.value)[0]
                                    }

                                    setAdvancedColoringSelection(new Array(10000).fill(true))
                                    setChannelColor(attribute)
                                }}
                            >
                                <MenuItem value="">None</MenuItem>
                                {CategoryOptionsAPI.getCategory(categoryOptions, "color").attributes.map(attribute => {
                                    return <MenuItem key={attribute.key} value={attribute.key}>{attribute.name}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                :
                <div></div>
        }

        <Grid item>

            <ColorScaleSelect></ColorScaleSelect>
        </Grid>


        <Grid item style={{ padding: '16px 0px' }}>
            {
                channelColor != null && channelColor.type == 'categorical' ?

                    <AdvancedColoringPopover></AdvancedColoringPopover>
                    :
                    <div></div>
            }


        </Grid>
    </Box>

    const accordion = <div style={{
    }}>
        <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Typography className={classes.heading}>Lines</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
                {dataset && dataset.isSequential && <div>
                    <Grid
                        container
                        justify="center"
                        alignItems="stretch"
                        direction="column"
                        style={{ padding: '0 16px' }}>
                        {//<Legend
                            //   ref={this.legend}
                            //   onLineSelect={this.onLineSelect}></Legend>

                        }


                        <Box p={1}></Box>

                        {/**<LineTreePopover
                            webGlView={webGLView}
                            dataset={dataset}
                        colorScale={lineColorScheme} />**/}
                    </Grid>


                    <div style={{ margin: '8px 0px' }}></div>

                    <PathLengthFilter></PathLengthFilter>
                    <PathBrightnessSlider></PathBrightnessSlider>
                </div>
                }
            </AccordionDetails>
        </Accordion>


        <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
            >
                <Typography className={classes.heading}>Points</Typography>
            </AccordionSummary>
            <AccordionDetails className={classes.details}>
                {points_box}
            </AccordionDetails>
        </Accordion>
    </div>;

    return <div>{dataset && dataset.isSequential ? accordion : points_box}</div>
}


export const StatesTabPanel = connector(StatesTabPanelFull)