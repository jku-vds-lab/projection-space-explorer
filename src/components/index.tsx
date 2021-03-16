import "regenerator-runtime/runtime";

import Typography from '@material-ui/core/Typography';
import { WebGLView } from './WebGLView/WebGLView'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { NamedCategoricalScales } from "./Utility/Colors/NamedCategoricalScales";
import { ContinuousMapping } from "./Utility/Colors/ContinuousMapping";
import { DiscreteMapping } from "./Utility/Colors/DiscreteMapping";
import { ContinuosScale, DiscreteScale } from "./Utility/Colors/ContinuosScale";
import { AppBar, createMuiTheme, Divider, Drawer, MuiThemeProvider, Paper, SvgIcon, Toolbar, Tooltip } from "@material-ui/core";
import { DatasetDatabase } from "./Utility/Data/DatasetDatabase";
import { Dataset } from "./Utility/Data/Dataset";
import { LineTreePopover, LineSelectionTree_GenAlgos, LineSelectionTree_GetChecks } from './DrawerTabPanels/StatesTabPanel/LineTreePopover/LineTreePopover'
import Box from '@material-ui/core/Box';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import * as React from "react";
import { SelectionClusters } from "./Overlays/SelectionClusters/SelectionClusters";
import { ToolSelectionRedux } from "./Overlays/ToolSelection/ToolSelection";
import { PathLengthFilter } from "./DrawerTabPanels/StatesTabPanel/PathLengthFilter/PathLengthFilter";
import { SizeSlider } from "./DrawerTabPanels/StatesTabPanel/SizeSlider/SizeSlider";
import { ClusterOverview } from "./Overlays/ClusterOverview/ClusterOverview";
import { Legend } from "./DrawerTabPanels/StatesTabPanel/LineSelection/LineSelection";
import * as ReactDOM from 'react-dom';
import { ClusteringTabPanel } from "./DrawerTabPanels/ClusteringTabPanel/ClusteringTabPanel";
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import { StatesTabPanel } from "./DrawerTabPanels/StatesTabPanel/StatesTabPanel";
import { StateSequenceDrawerRedux } from "./Overlays/StateSequenceDrawer/StateSequenceDrawer";
import { setProjectionOpenAction } from "./Ducks/ProjectionOpenDuck";
import { setHighlightedSequenceAction } from "./Ducks/HighlightedSequenceDuck";
import { setDatasetAction } from "./Ducks/DatasetDuck";
import { setOpenTabAction } from "./Ducks/OpenTabDuck";
import { setWebGLView } from "./Ducks/WebGLViewDuck";
import { ClusterMode, setClusterModeAction } from "./Ducks/ClusterModeDuck";
import { setAdvancedColoringSelectionAction } from "./Ducks/AdvancedColoringSelectionDuck";
import { CategoryOptions } from "./WebGLView/CategoryOptions";
import { AdvancedColoringPopover } from "./DrawerTabPanels/StatesTabPanel/AdvancedColoring/AdvancedColoringPopover/AdvancedColoringPopover";
import { ColorScaleSelect } from "./DrawerTabPanels/StatesTabPanel/ColorScaleSelect/ColorScaleSelect";
import { setProjectionColumns } from "./Ducks/ProjectionColumnsDuck";
import { EmbeddingTabPanel } from "./DrawerTabPanels/EmbeddingTabPanel/EmbeddingTabPanel";
import { CSVLoader } from "./Utility/Loaders/CSVLoader";
import { StoryEditor } from "./Overlays/StoryEditor/StoryEditor";
import { PathBrightnessSlider } from "./DrawerTabPanels/StatesTabPanel/PathTransparencySlider/PathBrightnessSlider";
import { setActiveLine } from "./Ducks/ActiveLineDuck";
import { setPathLengthMaximum, setPathLengthRange } from "./Ducks/PathLengthRange";
import { setCategoryOptions } from "./Ducks/CategoryOptionsDuck";
import { setChannelSize } from "./Ducks/ChannelSize";
import { setGlobalPointSize } from "./Ducks/GlobalPointSizeDuck";
import { setSelectedClusters } from "./Ducks/SelectedClustersDuck";
import { setChannelColor } from "./Ducks/ChannelColorDuck";
import { rootReducer, RootState } from "./Store/Store";
import { DatasetTabPanel } from "./DrawerTabPanels/DatasetTabPanel/DatasetTabPanel";
import { LineUpContext } from "./LineUpContext/LineUpContext";
import { devToolsEnhancer } from 'redux-devtools-extension';
import { setLineUpInput_visibility } from './Ducks/LineUpInputDuck';
import { SDFLoader } from "./Utility/Loaders/SDFLoader";
import * as frontend_utils from "../utils/frontend-connect";
import { HoverTabPanel } from "./DrawerTabPanels/HoverTabPanel/HoverTabPanel";
import { addProjectionAction } from "./Ducks/ProjectionsDuck";
import { Embedding } from "./Utility/Data/Embedding";
import { setVectors } from "./Ducks/StoriesDuck";
// @ts-ignore
import PseDataset from './Icons/pse-icon-dataset-opt.svg'
// @ts-ignore
import PseClusters from './Icons/pse-icon-clusters-opt.svg'
// @ts-ignore
import PseDetails from './Icons/pse-icon-details-opt.svg'
// @ts-ignore
import PseEncoding from './Icons/pse-icon-encoding-opt.svg'
// @ts-ignore
import PseProject from './Icons/pse-icon-project-opt.svg'
import { ChemTabPanel } from "./DrawerTabPanels/ChemTabPanel/ChemTabPanel";
import Split from 'react-split'
import { setLineByOptions } from "./Ducks/SelectedLineByDuck";
import { LineUpTabPanel } from "./DrawerTabPanels/LineUpTabPanel/LineUpTabPanel";

/**
 * A TabPanel with automatic scrolling which should be used for fixed size content.
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {<Box style={{ overflow: 'auto' }}>{children}</Box>}
    </Typography>
  );
}


/**
 * A TabPanel with a fixed height of 100vh which is needed for content with a scrollbar to work.
 */
function FixedHeightTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {<Paper style={{ overflow: 'hidden', height: '100vh' }}>{children}</Paper>}
    </Typography>
  );
}



const mapStateToProps = (state: RootState) => ({
  openTab: state.openTab,
  dataset: state.dataset,
  categoryOptions: state.categoryOptions,
  channelSize: state.channelSize,
  channelColor: state.channelColor
})


const mapDispatchToProps = dispatch => ({
  setOpenTab: openTab => dispatch(setOpenTabAction(openTab)),
  setDataset: dataset => dispatch(setDatasetAction(dataset)),
  setAdvancedColoringSelection: value => dispatch(setAdvancedColoringSelectionAction(value)),
  setHighlightedSequence: value => dispatch(setHighlightedSequenceAction(value)),
  setActiveLine: value => dispatch(setActiveLine(value)),
  setProjectionColumns: projectionColumns => dispatch(setProjectionColumns(projectionColumns)),
  setProjectionOpen: projectionOpen => dispatch(setProjectionOpenAction(projectionOpen)),
  setWebGLView: webGLView => dispatch(setWebGLView(webGLView)),
  setClusterMode: clusterMode => dispatch(setClusterModeAction(clusterMode)),
  setPathLengthMaximum: maximum => dispatch(setPathLengthMaximum(maximum)),
  setPathLengthRange: range => dispatch(setPathLengthRange(range)),
  setCategoryOptions: categoryOptions => dispatch(setCategoryOptions(categoryOptions)),
  setChannelSize: channelSize => dispatch(setChannelSize(channelSize)),
  setGlobalPointSize: size => dispatch(setGlobalPointSize(size)),
  setSelectedClusters: value => dispatch(setSelectedClusters(value)),
  wipeState: () => dispatch({ type: 'RESET_APP' }),
  setChannelColor: channelColor => dispatch(setChannelColor(channelColor)),
  // setLineUpInput_data: input => dispatch(setLineUpInput_data(input)),
  // setLineUpInput_columns: input => dispatch(setLineUpInput_columns(input)),
  setLineUpInput_visibility: input => dispatch(setLineUpInput_visibility(input)),
  saveProjection: embedding => dispatch(addProjectionAction(embedding)),
  setVectors: vectors => dispatch(setVectors(vectors)),
  setLineByOptions: options => dispatch(setLineByOptions(options))
})








/**
 * Main application that contains all other components.
 */
var Application = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<any, any> {
  legend: React.RefObject<Legend>;
  dataset: Dataset;
  threeRef: any;


  constructor(props) {
    super(props)

    this.state = {
      fileDialogOpen: true,

      vectorByTransparency: null,
      selectedVectorByTransparency: "",

      selectedLines: {},

      backendRunning: false
    }

    var worker = new Worker(frontend_utils.BASE_PATH + 'healthcheck.js') //dist/
    worker.onmessage = (e) => {
      this.setState({
        backendRunning: e.data
      })
    }


    this.threeRef = React.createRef()
    this.props.setWebGLView(this.threeRef)
    this.legend = React.createRef()
    this.onLineSelect = this.onLineSelect.bind(this)
    this.onDataSelected = this.onDataSelected.bind(this)
  }


  componentDidMount() {
    const mangleURL = (url: string) => {
      if (url.endsWith('csv') || url.endsWith('json') || url.endsWith('sdf')) {
        return `datasets/${url}`
      }

      return `datasets/${url}.csv`
    }

    var url = new URL(window.location.toString());
    var set = url.searchParams.get("set");
    var preselect = frontend_utils.CHEM_PROJECT ? "test.sdf" : "datasets/rubik/cube10x2_different_origins.csv"
    var loader = frontend_utils.CHEM_PROJECT ? new SDFLoader() : new CSVLoader();

    if (set != null) {
      if (set == "neural") {
        preselect = "datasets/neural/learning_confmat.csv"
        loader = new CSVLoader();
      } else if (set == "rubik") {
        preselect = "datasets/rubik/cube10x2_different_origins.csv"
        loader = new CSVLoader();
      } else if (set == "chess") {
        preselect = "datasets/chess/chess16k.csv"
        loader = new CSVLoader();
      } else if (set == "cime") {
        preselect = "test.sdf";
        loader = new SDFLoader();
      } else {
        preselect = mangleURL(set)
      }
      loader.resolvePath(new DatasetDatabase().getByPath(preselect), (dataset, json) => { this.onDataSelected(dataset, json) })
    } else {
      loader.resolvePath(new DatasetDatabase().getByPath(preselect), (dataset, json) => { this.onDataSelected(dataset, json) })
    }
  }



  convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }



  /**
   * Main callback when the dataset changes
   * @param dataset 
   * @param json 
   */
  onDataSelected(dataset: Dataset, json) {
    // Wipe old state
    this.props.wipeState()

    // Dispose old view
    this.threeRef.current.disposeScene()

    this.props.setClusterMode(dataset.multivariateLabels ? ClusterMode.Multivariate : ClusterMode.Univariate)

    // Set new dataset as variable
    this.props.setDataset(dataset)

    // Load new view
    let lineScheme = this.mappingFromScale(NamedCategoricalScales.DARK2(), { key: 'algo' }, dataset)

    this.setState({
      lineColorScheme: lineScheme
    })



    this.threeRef.current.createVisualization(dataset, lineScheme, null)

    this.finite(lineScheme, json, dataset)

    this.props.setVectors(dataset.vectors)

    // this.props.setLineUpInput_columns(dataset.columns);
    // this.props.setLineUpInput_data(dataset.vectors);

    this.props.setLineByOptions(dataset.getColumns())

    setTimeout(() => this.threeRef.current.requestRender(), 500)
  }


  finite(lineColorScheme, categories, dataset: Dataset) {
    var algos = LineSelectionTree_GenAlgos(this.props.dataset.vectors)
    var selLines = LineSelectionTree_GetChecks(algos)

    // Update shape legend
    this.setState({
      vectorByTransparency: null,
      selectedVectorByTransparency: "",
      selectedLines: selLines,
      selectedLineAlgos: algos
    })

    this.props.setCategoryOptions(new CategoryOptions(this.props.dataset.vectors, categories))
    this.props.setPathLengthMaximum(dataset.getMaxPathLength())
    this.props.setPathLengthRange([0, dataset.getMaxPathLength()])
    this.props.saveProjection(new Embedding(dataset.vectors, "Initial Projection"))

    const formatRange = range => {
      try {
        return `${range.min.toFixed(2)} - ${range.max.toFixed(2)}`
      } catch {
        return 'unknown'
      }
    }

    this.props.setProjectionColumns(dataset.getColumns(true).map(column => ({
      name: column,
      checked: dataset.columns[column].project,
      normalized: true,
      range: dataset.columns[column].range ? formatRange(dataset.columns[column].range) : "unknown",
      featureLabel: dataset.columns[column].featureLabel
    })))

    this.legend.current?.load(dataset.info.type, lineColorScheme, this.state.selectedLineAlgos)

    this.initializeEncodings(dataset)
  }

  mappingFromScale(scale, attribute, dataset) {
    if (scale instanceof DiscreteScale) {
      // Generate scale
      return new DiscreteMapping(scale, [... new Set(this.props.dataset.vectors.map(vector => vector[attribute.key]))])
    }
    if (scale instanceof ContinuosScale) {
      var min = null, max = null
      if (attribute.key in dataset.ranges) {
        min = dataset.ranges[attribute.key].min
        max = dataset.ranges[attribute.key].max
      } else {
        var filtered = this.props.dataset.vectors.map(vector => vector[attribute.key])
        max = Math.max(...filtered)
        min = Math.min(...filtered)
      }

      return new ContinuousMapping(scale, { min: min, max: max })
    }
    return null
  }

  initializeEncodings(dataset) {
    var state = {} as any

    this.threeRef.current.particles.shapeCat(null)

    var defaultSizeAttribute = this.props.categoryOptions.getAttribute('size', 'multiplicity', 'sequential')

    if (defaultSizeAttribute) {
      this.props.setGlobalPointSize([1, 2])
      this.props.setChannelSize(defaultSizeAttribute)

      this.threeRef.current.particles.sizeCat(defaultSizeAttribute, [1, 2])
    } else {
      this.props.setGlobalPointSize([1])
      this.props.setChannelSize(null)

      this.threeRef.current.particles.sizeCat(defaultSizeAttribute, [1])
    }



    var defaultColorAttribute = this.props.categoryOptions.getAttribute("color", "algo", "categorical")
    if (defaultColorAttribute) {
      this.props.setChannelColor(defaultColorAttribute)
    } else {
      this.props.setChannelColor(null)
    }

    var defaultBrightnessAttribute = this.props.categoryOptions.getAttribute("transparency", "age", "sequential")
    if (defaultBrightnessAttribute) {

      state.selectedVectorByTransparency = defaultBrightnessAttribute.key
      state.vectorByTransparency = defaultBrightnessAttribute
    }

    this.setState(state)

    this.threeRef.current.particles.transparencyCat(defaultBrightnessAttribute)
  }

  onLineSelect(algo, show) {
    this.threeRef.current.filterLines(algo, show)
    this.threeRef.current.requestRender()
  }

  onChangeTab(newTab) {
    if (newTab === this.props.openTab) {
      this.props.setOpenTab(false)
    } else {
      this.props.setOpenTab(newTab)
    }

  }


  render() {
    return <div>

      <div
        style={{
          display: 'flex',
          alignItems: 'stretch',
          width: "100vw",
          height: "100vh"
        }}>

        <Drawer
          variant="permanent"
          style={{
            width: 88
          }}
        >
          <Divider />
          <Tabs
            value={this.props.openTab}
            orientation="vertical"
            indicatorColor="primary"
            textColor="primary"

            onChange={(e, newTab) => this.onChangeTab(newTab)}
            aria-label="disabled tabs example"
          >
            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Load Dataset</Typography>
              <Typography variant="body2">Upload a new dataset or choose a predefined one.</Typography>
            </React.Fragment>}><Tab icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseDataset}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>
            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Embedding and Projection</Typography>
              <Typography variant="body2">Perform projection techniques like t-SNE, UMAP, or a force-directly layout with your data.</Typography>
            </React.Fragment>}><Tab icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseProject}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>

            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Point and Line Channels</Typography>
              <Typography variant="body2">Contains settings that let you map different channels like brightness and color on point and line attributes.</Typography>
            </React.Fragment>}><Tab icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseEncoding}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>
            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Clustering</Typography>
              <Typography variant="body2">Contains options for displaying and navigating clusters in the dataset.</Typography>
            </React.Fragment>}><Tab icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseClusters}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>
            
            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Hover Item and Selection Summary</Typography>
              <Typography variant="body2">Contains information about the currently hovered item and the currently selected summary.</Typography>
            </React.Fragment>}><Tab icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseDetails}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>

            {/* {frontend_utils.CHEM_PROJECT && <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">Backend Settings</Typography>
              <Typography variant="body2">Adjust Settings used in the backend.</Typography>
            </React.Fragment>}><Tab icon={<SvgIcon style={{ fontSize: 64 }} viewBox="0 0 18.521 18.521" component={PseDetails}></SvgIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>
            } */}
            <Tooltip placement="right" title={<React.Fragment>
              <Typography variant="subtitle2">LineUp Integration</Typography>
              <Typography variant="body2">Settings for LineUp Integration</Typography>
            </React.Fragment>}><Tab icon={<img src={'textures/lineup.png'} style={{ width: 64, height: 64 }}></img>} style={{ minWidth: 0, flexGrow: 1, marginTop: '128px' }} /></Tooltip>
          </Tabs>
        </Drawer>

        <Box
          style={{
            flexShrink: 0,
            width: this.props.openTab === false ? '0rem' : "18rem",
            height: '100vh',
            overflowX: 'hidden',
            overflowY: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid rgba(0, 0, 0, 0.12)'
          }}>
          <div style={{
            flexGrow: 1,
            overflowY: 'hidden'
          }}>


            <Grid
              container
              justify="center"
              alignItems="stretch"
              direction="column">



              <FixedHeightTabPanel value={this.props.openTab} index={0} >
                <DatasetTabPanel onDataSelected={this.onDataSelected}></DatasetTabPanel>
              </FixedHeightTabPanel>
              

              <FixedHeightTabPanel value={this.props.openTab} index={1}>
                <EmbeddingTabPanel></EmbeddingTabPanel>
              </FixedHeightTabPanel>

              <FixedHeightTabPanel value={this.props.openTab} index={2}>
                <div style={{
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  height: '100%'
                }}>
                  {this.props.dataset && this.props.dataset.isSequential && <div>
                    <div>
                      <Typography
                        style={{ margin: '0px 0 0px 16px' }}
                        variant="body1"
                        display="block"
                      >
                        Lines
                </Typography>
                    </div>

                    <Grid
                      container
                      justify="center"
                      alignItems="stretch"
                      direction="column"
                      style={{ padding: '0 16px' }}>
                      <Legend
                        ref={this.legend}
                        onLineSelect={this.onLineSelect}></Legend>

                      <Box p={1}></Box>

                      <LineTreePopover
                        onSelectAll={(algo, checked) => {
                          var ch = this.state.selectedLines
                          Object.keys(ch).forEach(key => {
                            var e = this.state.selectedLineAlgos.find(e => e.algo == algo)
                            if (e.lines.find(e => e.line == key)) {
                              ch[key] = checked
                            }

                          })

                          this.setState({
                            selectedLines: ch
                          })

                          this.threeRef.current.setLineFilter(ch)
                          this.threeRef.current.requestRender()
                        }}
                        onChange={(id, checked) => {
                          var ch = this.state.selectedLines
                          ch[id] = checked

                          this.setState({
                            selectedLines: ch
                          })

                          this.threeRef.current.setLineFilter(ch)
                          this.threeRef.current.requestRender()
                        }} checkboxes={this.state.selectedLines} algorithms={this.state.selectedLineAlgos} colorScale={this.state.lineColorScheme} />
                    </Grid>


                    <div style={{ margin: '8px 0px' }}></div>

                    <PathLengthFilter></PathLengthFilter>
                    <PathBrightnessSlider></PathBrightnessSlider>
                  </div>
                  }

                  <Divider style={{ margin: '8px 0px' }} />

                  <div>
                    <Typography
                      style={{ margin: '0px 0 0px 16px' }}
                      color="textPrimary"
                      variant="body1"
                      display="block"
                    >
                      Points
                </Typography>
                  </div>


                  


                  <StatesTabPanel></StatesTabPanel>



                  {
                    this.props.categoryOptions != null && this.props.categoryOptions.hasCategory("transparency") ?
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
                            value={this.state.selectedVectorByTransparency}
                            onChange={(event) => {
                              var attribute = this.props.categoryOptions.getCategory("transparency").attributes.filter(a => a.key == event.target.value)[0]

                              this.setState({
                                selectedVectorByTransparency: event.target.value,
                                vectorByTransparency: attribute
                              })

                              this.threeRef.current.particles.transparencyCat(attribute)
                              this.threeRef.current.requestRender()
                            }}
                          >
                            <MenuItem value="">None</MenuItem>
                            {this.props.categoryOptions.getCategory("transparency").attributes.map(attribute => {
                              return <MenuItem key={attribute.key} value={attribute.key}>{attribute.name}</MenuItem>
                            })}
                          </Select>
                        </FormControl>
                      </Grid>
                      :
                      <div></div>
                  }

                  {
                    this.props.categoryOptions != null && this.props.categoryOptions.hasCategory("size") ?
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
                            value={this.props.channelSize ? this.props.channelSize.key : ''}
                            onChange={(event) => {
                              var attribute = this.props.categoryOptions.getCategory("size").attributes.filter(a => a.key == event.target.value)[0]
                              if (attribute == undefined) {
                                attribute = null
                              }

                              let pointSize = attribute ? [1, 2] : [1]

                              this.props.setGlobalPointSize(pointSize)

                              this.props.setChannelSize(attribute)

                              this.threeRef.current.particles.sizeCat(attribute, pointSize)
                            }}
                          >
                            <MenuItem value="">None</MenuItem>
                            {this.props.categoryOptions.getCategory("size").attributes.map(attribute => {
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
                    this.props.categoryOptions != null && this.props.categoryOptions.hasCategory("color") ?
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
                              value={this.props.channelColor ? this.props.channelColor.key : ""}
                              onChange={(event) => {
                                var attribute = null
                                if (event.target.value != "") {
                                  attribute = this.props.categoryOptions.getCategory("color").attributes.filter(a => a.key == event.target.value)[0]
                                }

                                this.props.setAdvancedColoringSelection(new Array(10000).fill(true))
                                this.props.setChannelColor(attribute)
                              }}
                            >
                              <MenuItem value="">None</MenuItem>
                              {this.props.categoryOptions.getCategory("color").attributes.map(attribute => {
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


                  <Grid item>
                    {
                      this.props.channelColor != null && this.props.channelColor.type == 'categorical' ?

                        <AdvancedColoringPopover></AdvancedColoringPopover>
                        :
                        <div></div>
                    }


                  </Grid>
                </div>
              </FixedHeightTabPanel>


              <FixedHeightTabPanel value={this.props.openTab} index={3}>

                {this.props.dataset != null ?
                  <ClusteringTabPanel
                    open={this.props.openTab == 2}
                    backendRunning={this.state.backendRunning}
                    clusteringWorker={this.state.clusteringWorker}
                  ></ClusteringTabPanel> : <div></div>
                }
              </FixedHeightTabPanel>


              <FixedHeightTabPanel value={this.props.openTab} index={4}>
                <HoverTabPanel hoverUpdate={(hover_item, updater) => { this.threeRef.current.hoverUpdate(hover_item, updater) }}></HoverTabPanel>
              </FixedHeightTabPanel>

              {/* {frontend_utils.CHEM_PROJECT && 
              <FixedHeightTabPanel value={this.props.openTab} index={5}>
                <ChemTabPanel></ChemTabPanel>
              </FixedHeightTabPanel>} */}
              
              <FixedHeightTabPanel value={this.props.openTab} index={5}>
                <LineUpTabPanel></LineUpTabPanel>
              </FixedHeightTabPanel>
            </Grid>

          </div>

        </Box>


        <div style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%'
        }}>
          <AppBar variant="outlined" position="relative" color="transparent">
            <Toolbar>
              <a href={"https://jku-vds-lab.at"} target={"_blank"}><img style={{ height: 48 }} src={"textures/vis-logo-svg.svg"} alt="Kitty Katty!" /></a>
              {frontend_utils.CHEM_PROJECT && <a href={"https://www.bayer.com"} target={"_blank"}><img style={{ height: 48, marginLeft: 48 }} src={"textures/bayer-logo.svg"} alt="Powered By Bayer" /></a>}
              <Typography variant="h6" style={{ marginLeft: 48 }}>
                Projection Space Explorer
              </Typography>
              <ToolSelectionRedux />
            </Toolbar>
          </AppBar>

          <Split
            style={{display: 'flex', flexDirection: 'column', height: '100%'}}
            sizes={[100, 0]}
            minSize={0}
            expandToMin={false}
            gutterSize={10}
            gutterAlign="center"
            snapOffset={30}
            dragInterval={1}
            direction="vertical"
            cursor="ns-resize"
          >
            <div style={{ flexGrow: 0.9 }}>
              <WebGLView
                ref={this.threeRef}
              />
            </div>
            <div style={{ flexGrow: 0.1 }}>
              <LineUpContext onFilter={() => { this.threeRef.current.lineupFilterUpdate() }} hoverUpdate={(hover_item, updater) => { this.threeRef.current.hoverUpdate(hover_item, updater) }}></LineUpContext>
            </div>


          </Split>



        </div>



        <StateSequenceDrawerRedux></StateSequenceDrawerRedux>

        <ClusterOverview
          itemClicked={(cluster) => {
            //this.threeRef.current.setZoomTarget(cluster.vectors, 1)
            this.threeRef.current.onClusterClicked(cluster)
          }}></ClusterOverview>


        <StoryEditor></StoryEditor>



        <div id="HoverItemDiv" style={{
          position: 'absolute',
          left: '0px',
          bottom: '0px',
          zIndex: 10000,
          padding: 8
        }}></div>
      </div>
    </div>
  }
})













const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: '#007dad',
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    }
  }
})

// Render the application into our 'mountingPoint' div that is declared in 'index.html'.
ReactDOM.render(
  <Provider store={createStore(rootReducer, devToolsEnhancer({}))}>
    <MuiThemeProvider theme={theme}>
      <Application />
    </MuiThemeProvider>

  </Provider>, document.getElementById("mountingPoint"))