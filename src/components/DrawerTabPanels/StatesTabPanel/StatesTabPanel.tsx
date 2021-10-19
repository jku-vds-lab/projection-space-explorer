import { connect, ConnectedProps } from 'react-redux'
import { FunctionComponent } from 'react'
import * as React from 'react'
import { Grid, FormControl, InputLabel, Select, MenuItem, Typography, Divider, Box, Accordion, AccordionSummary, AccordionDetails, makeStyles, TextField } from '@material-ui/core'
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
import { ColorScaleSelect } from './ColorScaleSelect/ColorScaleSelect'
import { AdvancedColoringPopover } from './AdvancedColoring/AdvancedColoringPopover/AdvancedColoringPopover'
import { setChannelColor } from '../../Ducks/ChannelColorDuck'
import { setAdvancedColoringSelectionAction } from '../../Ducks/AdvancedColoringSelectionDuck'
import { PathLengthFilter } from './PathLengthFilter/PathLengthFilter'
import { Legend } from './LineSelection/LineSelection'
import { LineSelectionTree_GenAlgos, LineSelectionTree_GetChecks, LineTreePopover } from './LineTreePopover/LineTreePopover'
import { PathBrightnessSlider } from './PathTransparencySlider/PathBrightnessSlider'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Autocomplete, createFilterOptions } from '@material-ui/lab'

const mapStateToProps = (state: RootState) => ({
    selectedVectorByShape: state.selectedVectorByShape,
    selectedLineBy: state.selectedLineBy,
    vectorByShape: state.vectorByShape,
    dataset: state.dataset,
    categoryOptions: state.categoryOptions,
    webGlView: state.webGLView,
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
    lineColorScheme
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

const SelectFeatureComponent = ({label, default_val, categoryOptions, onChange}:any) => {
    
    let autocomplete_options = [{value:"None", inputValue:"None"}];
    let autocomplete_filterOptions = null;
    if(categoryOptions != null){
        autocomplete_options = autocomplete_options.concat(categoryOptions.attributes.map((attribute) => {
            return {value: attribute.key, inputValue: attribute.name}
        }));
        autocomplete_filterOptions = createFilterOptions({
            stringify: (option:any) => { return option.value; },
        });

    }
    
    return <><Autocomplete
        id={"vectorBySelect_"+label}
        filterOptions={autocomplete_filterOptions}
        onChange={(event, newValue) => {
            if(newValue)
                onChange(newValue.value)
        }}
        options={autocomplete_options.sort((a, b) => {
            if(a.value === "None")
                return -1
            if(b.value === "None")
                return 1
            return -b.inputValue.localeCompare(a.inputValue)}
            )}
        groupBy={(option:any) => option.group}
        getOptionLabel={(option:any) => option.inputValue}
        getOptionSelected={(option:any, value) => {return option.value == value.value;}}
        // defaultValue={channelColor ? autocomplete_color_options.filter((option:any) => option.value == channelColor.key)[0] : {value:"", inputValue:""}}
        value = {default_val ? autocomplete_options.filter((option:any) => option.value == default_val.key)[0] : autocomplete_options[0]}
        renderInput={(params) => <TextField {...params} label={label + " by"}  />}
    /></>
    // return <><InputLabel shrink id={"vectorBySelectLabel_"+label}>{label} by</InputLabel>
    //     <Select labelId={"vectorBySelectLabel_"+label}
    //         id={"vectorBySelect_"+label}
    //         displayEmpty
    //         value={default_val ? default_val.key : ""}
    //         onChange={(event)=>{
    //             onChange(event.target.value)
    //         }}
    //     >
    //         <MenuItem value="">None</MenuItem>
    //         {categoryOptions.attributes.map(attribute => {
    //             return <MenuItem key={attribute.key} value={attribute.key}>{attribute.name}</MenuItem>
    //         })}
    //     </Select></>
}

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
    webGlView,
    channelBrightness,
    setChannelBrightness,
    setGlobalPointBrightness,
    channelSize,
    setChannelSize,
    setGlobalPointSize,
    channelColor,
    setChannelColor,
    setAdvancedColoringSelection,
    lineColorScheme
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
            categoryOptions != null && categoryOptions.hasCategory("shape") ?
                <Grid
                    container
                    justify="center"
                    alignItems="stretch"
                    direction="column"
                    style={{ padding: '0 16px' }}>
                    <FormControl style={{ margin: '4px 0px' }}>

                        <SelectFeatureComponent label={"shape"} default_val={selectedVectorByShape ? {key: selectedVectorByShape} : null} categoryOptions={categoryOptions.getCategory("shape")} onChange={(newValue) => {
                                
                                setSelectedVectorByShape(newValue)
                                var attribute = categoryOptions.getCategory("shape").attributes.filter(a => a.key == newValue)[0]

                                if (attribute == undefined) {
                                    attribute = null
                                }
                                setVectorByShape(attribute)

                            }}></SelectFeatureComponent>
                        
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
                        
                        <SelectFeatureComponent label={"brightness"} default_val={channelBrightness} categoryOptions={categoryOptions.getCategory("transparency")} onChange={(newValue) => {
                                var attribute = categoryOptions.getCategory("transparency").attributes.filter(a => a.key == newValue)[0]

                                if (attribute == undefined) {
                                    attribute = null
                                }

                                let pointBrightness = attribute ? [0.25, 1] : [1]

                                setGlobalPointBrightness(pointBrightness)
                                setChannelBrightness(attribute)
                                webGlView.current.particles.transparencyCat(attribute, pointBrightness)
                                webGlView.current.requestRender()
                            }}></SelectFeatureComponent>
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
                        
                        <SelectFeatureComponent label={"size"} default_val={channelSize} categoryOptions={categoryOptions.getCategory("size")} onChange={(newValue) => {
                                var attribute = categoryOptions.getCategory("size").attributes.filter(a => a.key == newValue)[0]
                                if (attribute == undefined) {
                                    attribute = null
                                }

                                let pointSize = attribute ? [1, 2] : [1]

                                setGlobalPointSize(pointSize)

                                setChannelSize(attribute)

                                webGlView.current.particles.sizeCat(attribute, pointSize)
                            }}></SelectFeatureComponent>
                    </FormControl>
                </Grid>
                :
                <div></div>
        }

        <SizeSlider></SizeSlider>


        {
            categoryOptions != null && categoryOptions.hasCategory("color") ?
                <Grid
                    container
                    item
                    alignItems="stretch"
                    direction="column"
                    style={{ padding: '0 16px' }}
                >

                    <Grid container item alignItems="stretch" direction="column">
                        <FormControl style={{ margin: '4px 0px' }}>
                            <SelectFeatureComponent label={"color"} default_val={channelColor} categoryOptions={categoryOptions.getCategory("color")} onChange={(newValue) => {
                                    var attribute = null
                                    if (newValue && newValue != "") {
                                        attribute = categoryOptions.getCategory("color").attributes.filter(a => a.key == newValue)[0]
                                    }

                                    setAdvancedColoringSelection(new Array(10000).fill(true))
                                    setChannelColor(attribute)
                                }}></SelectFeatureComponent>

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

                        <LineTreePopover
                            webGlView={webGlView}
                            dataset={dataset}
                            colorScale={lineColorScheme} />
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