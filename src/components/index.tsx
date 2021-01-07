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
import { createMuiTheme, Divider, Drawer, MuiThemeProvider, Paper, Tooltip } from "@material-ui/core";
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
import { ClusterIcon } from "./Icons/ClusterIcon";
import { setActiveLine } from "./Ducks/ActiveLineDuck";
import { setPathLengthMaximum, setPathLengthRange } from "./Ducks/PathLengthRange";
import { setCategoryOptions } from "./Ducks/CategoryOptionsDuck";
import { setChannelSize } from "./Ducks/ChannelSize";
import { setGlobalPointSize } from "./Ducks/GlobalPointSizeDuck";
import { setSelectedClusters } from "./Ducks/SelectedClustersDuck";
import { setChannelColor } from "./Ducks/ChannelColorDuck";
import { UploadIcon } from "./Icons/UploadIcon";
import { VisualChannelIcon } from "./Icons/VisualChannelIcon";
import { StoryIcon } from "./Icons/StoryIcon";
import { EmbeddingIcon } from "./Icons/EmbeddingIcon";
import { rootReducer } from "./Store/Store";
import { DatasetTabPanel } from "./DrawerTabPanels/DatasetTabPanel/DatasetTabPanel";
import { LineUpContext } from "./LineUpContext/LineUpContext";
import { devToolsEnhancer } from 'redux-devtools-extension';
import { setLineUpInput_data, setLineUpInput_columns, setLineUpInput_visibility } from './Ducks/LineUpInputDuck';
import { SDFLoader } from "./Utility/Loaders/SDFLoader";








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



const mapStateToProps = state => ({
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
  setLineUpInput_data: input => dispatch(setLineUpInput_data(input)),
  setLineUpInput_columns: input => dispatch(setLineUpInput_columns(input)),
  setLineUpInput_visibility: input => dispatch(setLineUpInput_visibility(input)),
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

    var worker = new Worker('dist/healthcheck.js')
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

    var url = new URL(window.location.toString());
    var set = url.searchParams.get("set");
    var preselect = "datasets/rubik/cube10x2_different_origins.csv"
    // var preselect = "datasets/chemvis/test.sdf"
    if (set != null) {

      var preselect = "datasets/rubik/cube10x2_different_origins.csv"
      if (set == "neural") {
        preselect = "datasets/neural/learning_confmat.csv"
      } else if (set == "rubik") {
        preselect = "datasets/rubik/cube10x2_different_origins.csv"
      } else if (set == "chess") {
        preselect = "datasets/chess/chess16k.csv"
      } else if (set == "chemvis"){
        new SDFLoader().resolvePath(new DatasetDatabase().getByPath("datasets/chemvis/test.sdf"), (dataset, json) => { this.onDataSelected(dataset, json) });
        return;
      }

      new CSVLoader().resolvePath(new DatasetDatabase().getByPath(preselect), (dataset, json) => { this.onDataSelected(dataset, json) })
    } else {
      new CSVLoader().resolvePath(new DatasetDatabase().getByPath(preselect), (dataset, json) => { this.onDataSelected(dataset, json) })
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
  onDataSelected(dataset, json) {
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

    this.props.setLineUpInput_columns(dataset.columns);
    this.props.setLineUpInput_data(dataset.vectors);

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

    const formatRange = range => {
      try {
        return `${range.min.toFixed(2)} - ${range.max.toFixed(2)}`
      } catch {
        return 'unknown'
      }
    }

    this.props.setProjectionColumns(dataset.getColumns(true).map(column => ({
      name: column,
      checked: dataset.preselectedProjectionColumns ? dataset.preselectedProjectionColumns.includes(column) : true,
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


  render() {
    return <div
      style={{
        display: 'flex',
        alignItems: 'stretch',
        width: "100vw",
        height: "100vh"
      }}>

      <Drawer
        variant="permanent"
        style={{
          width: 72
        }}
      >
        <Divider />
        <Tabs
          value={this.props.openTab}
          orientation="vertical"
          indicatorColor="primary"
          textColor="primary"
          onChange={(e, newVal) => { this.props.setOpenTab(newVal) }}
          aria-label="disabled tabs example"
        >
          <Tooltip placement="right" title={<React.Fragment>
            <Typography variant="subtitle2">Load Dataset</Typography>
            <Typography variant="body2">Upload a new dataset or choose a predefined one.</Typography>
          </React.Fragment>}><Tab icon={<UploadIcon></UploadIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>
          <Tooltip placement="right" title={<React.Fragment>
            <Typography variant="subtitle2">Point and Line Channels</Typography>
            <Typography variant="body2">Contains settings that let you map different channels like brightness and color on point and line attributes.</Typography>
          </React.Fragment>}><Tab icon={<VisualChannelIcon></VisualChannelIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>
          <Tooltip placement="right" title={<React.Fragment>
            <Typography variant="subtitle2">Clustering</Typography>
            <Typography variant="body2">Contains options for displaying and navigating clusters in the dataset.</Typography>
          </React.Fragment>}><Tab icon={<ClusterIcon></ClusterIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>
          <Tooltip placement="right" title={<React.Fragment>
            <Typography variant="subtitle2">Embedding and Projection</Typography>
            <Typography variant="body2">Perform projection techniques like t-SNE, UMAP, or a force-directly layout with your data.</Typography>
          </React.Fragment>}><Tab icon={<EmbeddingIcon></EmbeddingIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>
        </Tabs>
      </Drawer>

      <Box
        style={{
          flexShrink: 0,
          width: "18rem",
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

            <TabPanel value={this.props.openTab} index={1}>

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

                            this.props.setAdvancedColoringSelection(new Array(100).fill(true))
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

            </TabPanel>


            <FixedHeightTabPanel value={this.props.openTab} index={2}>

              {this.props.dataset != null ?
                <ClusteringTabPanel
                  open={this.props.openTab == 2}
                  backendRunning={this.state.backendRunning}
                  clusteringWorker={this.state.clusteringWorker}
                ></ClusteringTabPanel> : <div></div>
              }
            </FixedHeightTabPanel>


            <TabPanel value={this.props.openTab} index={3}>
              <EmbeddingTabPanel></EmbeddingTabPanel>
            </TabPanel>
          </Grid>

        </div>

      </Box>


      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%'
      }}>
        <div style={{ flexGrow: 1 }}>
          <WebGLView
            ref={this.threeRef}
          />
        </div>
        <div style={{ flexGrow: 0 }}>
          <LineUpContext onFilter={() => {this.threeRef.current.lineupFilterUpdate()}}></LineUpContext>
        </div>
      </div>



      <StateSequenceDrawerRedux></StateSequenceDrawerRedux>

      <ClusterOverview
        itemClicked={(cluster) => {
          //this.threeRef.current.setZoomTarget(cluster.vectors, 1)
          this.threeRef.current.onClusterClicked(cluster)
        }}></ClusterOverview>

      

      <SelectionClusters></SelectionClusters>

      <StoryEditor></StoryEditor>

      <ToolSelectionRedux />
    </div >
  }
})













// Create theme for the application.
const theme = createMuiTheme({
  palette: {
    type: 'light'
  }
})

// Render the application into our 'mountingPoint' div that is declared in 'index.html'.
ReactDOM.render(
  <Provider store={createStore(rootReducer, devToolsEnhancer({}))}>
    <MuiThemeProvider theme={theme}>
      <Application />
    </MuiThemeProvider>

  </Provider>, document.getElementById("mountingPoint"))