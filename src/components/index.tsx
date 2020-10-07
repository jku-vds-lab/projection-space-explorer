import "regenerator-runtime/runtime";

import Typography from '@material-ui/core/Typography';
import { WebGLView } from './WebGLView/WebGLView'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { defaultScalesForAttribute, ContinuosScale, DiscreteScale, DiscreteMapping, ContinuousMapping, NamedCategoricalScales } from "./util/colors";
import { BottomNavigation, BottomNavigationAction, Divider, Icon, SvgIcon, Tooltip } from "@material-ui/core";
import { Dataset, DatasetDatabase } from './util/datasetselector'
import { LineTreePopover, LineSelectionTree_GenAlgos, LineSelectionTree_GetChecks } from './DrawerTabPanels/StatesTabPanel/LineTreePopover/LineTreePopover'
import Box from '@material-ui/core/Box';
import { arraysEqual } from "./WebGLView/UtilityFunctions";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { ChooseFileDialog } from './util/dataselectui'
import { DataEdge, MultiDictionary } from "./util/datasetselector"
import * as React from "react";
import { SelectionClusters } from "./Overlays/SelectionClusters/SelectionClusters";
import { Tool, ToolSelectionRedux } from "./Overlays/ToolSelection/ToolSelection";
import { PathLengthFilter } from "./DrawerTabPanels/StatesTabPanel/PathLengthFilter/PathLengthFilter";
import { SizeSlider } from "./DrawerTabPanels/StatesTabPanel/SizeSlider/SizeSlider";
import { ClusterOverview } from "./Overlays/ClusterOverview/ClusterOverview";
import { Story } from "./util/Cluster";
import { Legend } from "./DrawerTabPanels/StatesTabPanel/LineSelection/LineSelection";
import concaveman = require("concaveman");
import * as ReactDOM from 'react-dom';
import { ClusteringTabPanel } from "./DrawerTabPanels/ClusteringTabPanel/ClusteringTabPanel";
import { triangulate } from "./WebGLView/tools";
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import { setActiveStory } from "./Ducks/ActiveStoryDuck";
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
import { CSVLoader } from "../model/Loaders/CSVLoader";
import { GithubLink } from "./Overlays/GithubLink/GithubLink";
import { StoryEditor } from "./Overlays/StoryEditor/StoryEditor";
import { PathBrightnessSlider } from "./DrawerTabPanels/StatesTabPanel/PathTransparencySlider/PathBrightnessSlider";
import { PointsIcon } from "./Icons/PointsIcon";
import { ClusterIcon } from "./Icons/ClusterIcon";
import SettingsIcon from '@material-ui/icons/Settings';
import { setActiveLine } from "./Ducks/ActiveLineDuck";
import { setStories } from "./Ducks/StoriesDuck";
import { rootReducer } from "./Store/Store";
import { setPathLengthMaximum, setPathLengthRange } from "./Ducks/PathLengthRange";
import { setCategoryOptions } from "./Ducks/CategoryOptionsDuck";
import { setChannelSize } from "./Ducks/ChannelSize";
import { setGlobalPointSize } from "./Ducks/GlobalPointSizeDuck";










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
      {<Box style={{ overflowY: 'auto', height: '100%' }}>{children}</Box>}
    </Typography>
  );
}




const mapStateToProps = state => ({
  openTab: state.openTab,
  activeStory: state.activeStory,
  dataset: state.dataset,
  categoryOptions: state.categoryOptions,
  channelSize: state.channelSize
})


const mapDispatchToProps = dispatch => ({
  setOpenTab: openTab => dispatch(setOpenTabAction(openTab)),
  setDataset: dataset => dispatch(setDatasetAction(dataset)),
  setAdvancedColoringSelection: value => dispatch(setAdvancedColoringSelectionAction(value)),
  setHighlightedSequence: value => dispatch(setHighlightedSequenceAction(value)),
  setActiveLine: value => dispatch(setActiveLine(value)),
  setActiveStory: activeStory => dispatch(setActiveStory(activeStory)),
  setStories: stories => dispatch(setStories(stories)),
  setProjectionColumns: projectionColumns => dispatch(setProjectionColumns(projectionColumns)),
  setProjectionOpen: projectionOpen => dispatch(setProjectionOpenAction(projectionOpen)),
  setWebGLView: webGLView => dispatch(setWebGLView(webGLView)),
  setClusterMode: clusterMode => dispatch(setClusterModeAction(clusterMode)),
  setPathLengthMaximum: maximum => dispatch(setPathLengthMaximum(maximum)),
  setPathLengthRange: range => dispatch(setPathLengthRange(range)),
  setCategoryOptions: categoryOptions => dispatch(setCategoryOptions(categoryOptions)),
  setChannelSize: channelSize => dispatch(setChannelSize(channelSize)),
  setGlobalPointSize: size => dispatch(setGlobalPointSize(size))
})


var Application = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component<any, any> {
  legend: React.RefObject<Legend>;
  dataset: Dataset;
  vectors: any;
  segments: any;
  threeRef: any;


  constructor(props) {
    super(props)

    this.state = {
      selectionState: [],

      fileDialogOpen: true,

      vectorByTransparency: null,
      selectedVectorByTransparency: "",

      vectorByColor: null,
      selectedVectorByColor: "",

      selectedScaleIndex: 0,
      selectedScale: null,
      definedScales: null,

      datasetType: 'none',

      selectedLines: {},

      projectionComputing: false,

      sizeScale: [1, 2],

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
    this.onColorScaleChanged = this.onColorScaleChanged.bind(this)
  }



  componentDidMount() {

    var url = new URL(window.location.toString());
    var set = url.searchParams.get("set");
    var preselect = "datasets/rubik/cube10x2_different_origins.csv"
    if (set != null) {

      if (set == "neural") {
        preselect = "datasets/neural/learning_confmat.csv"
      } else if (set == "rubik") {
        preselect = "datasets/rubik/cube10x2_different_origins.csv"
      } else if (set == "chess") {
        preselect = "datasets/chess/chess16k.csv"
      }

      new CSVLoader().resolvePath(new DatasetDatabase().getByPath(preselect), (dataset, json) => { this.onDataSelected(dataset, json) })
    } else {
      new CSVLoader().resolvePath(new DatasetDatabase().getByPath(preselect), (dataset, json) => { this.onDataSelected(dataset, json) })
    }

    window.addEventListener('resize', this.onResize.bind(this))
  }

  convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  onResize() {
    this.threeRef.current.resize(window.innerWidth - this.convertRemToPixels(18 * 1), window.innerHeight)
  }



  /**
   * Main callback when the dataset changes
   * @param dataset 
   * @param json 
   */
  onDataSelected(dataset, json) {
    // Dispose old view
    this.threeRef.current.disposeScene()

    // Set new dataset as variable
    this.props.setDataset(dataset)
    this.vectors = dataset.vectors
    this.segments = dataset.segments

    this.setState({
      datasetType: dataset.info.type,
      vectors: this.vectors
    })

    // Load new view
    let lineScheme = this.mappingFromScale(NamedCategoricalScales.DARK2, { key: 'algo' }, dataset)

    this.setState({
      lineColorScheme: lineScheme
    })

    this.threeRef.current.createVisualization(dataset, lineScheme, null)

    this.finite(lineScheme, json, dataset)
  }

  finite(lineColorScheme, categories, dataset) {
    var algos = LineSelectionTree_GenAlgos(this.vectors)
    var selLines = LineSelectionTree_GetChecks(algos)

    // Update shape legend
    this.setState({
      vectorByTransparency: null,
      selectedVectorByTransparency: "",
      vectorByColor: null,
      selectedVectorByColor: "",
      selectedLines: selLines,
      selectedLineAlgos: algos
    })

    this.props.setCategoryOptions(new CategoryOptions(this.vectors, categories))
    this.props.setPathLengthMaximum(dataset.getMaxPathLength())
    this.props.setPathLengthRange([0, dataset.getMaxPathLength()])
    this.props.setHighlightedSequence(null)
    this.props.setActiveLine(null)
    this.props.setActiveStory(null)
    this.props.setStories(null)
    this.props.setClusterMode(dataset.multivariateLabels ? ClusterMode.Multivariate : ClusterMode.Univariate)

    this.props.setProjectionColumns(dataset.getColumns().map(column => ({
      name: column,
      checked: dataset.preselectedProjectionColumns.includes(column),
      normalized: true
    })))

    this.legend.current?.load(dataset.info.type, lineColorScheme, this.state.selectedLineAlgos)

    this.initializeEncodings(dataset)
  }

  mappingFromScale(scale, attribute, dataset) {
    if (scale instanceof DiscreteScale) {
      // Generate scale
      return new DiscreteMapping(scale, [... new Set(this.vectors.map(vector => vector[attribute.key]))])
    }
    if (scale instanceof ContinuosScale) {
      var min = null, max = null
      if (attribute.key in dataset.ranges) {
        min = dataset.ranges[attribute.key].min
        max = dataset.ranges[attribute.key].max
      } else {
        var filtered = this.vectors.map(vector => vector[attribute.key])
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

      this.threeRef.current.particles.sizeCat(defaultSizeAttribute, [1,2])
    } else {
      this.props.setGlobalPointSize([1])
    }

    var defaultColorAttribute = this.props.categoryOptions.getAttribute("color", "algo", "categorical")
    if (defaultColorAttribute) {
      state.definedScales = defaultScalesForAttribute(defaultColorAttribute)
      state.selectedScaleIndex = 0
      state.selectedVectorByColor = defaultColorAttribute.key
      state.vectorByColor = defaultColorAttribute

      this.threeRef.current.particles.colorCat(defaultColorAttribute, this.mappingFromScale(state.definedScales[state.selectedScaleIndex], defaultColorAttribute, dataset))
      state.showColorMapping = this.threeRef.current.particles.getMapping()
    }

    var defaultBrightnessAttribute = this.props.categoryOptions.getAttribute("transparency", "age", "sequential")
    if (defaultBrightnessAttribute) {
      state.selectedVectorByTransparency = defaultBrightnessAttribute.key
      state.vectorByTransparency = defaultBrightnessAttribute
    }

    this.setState(state)

    this.threeRef.current.particles.transparencyCat(defaultBrightnessAttribute)
  }

  onColorScaleChanged(scale, index) {
    this.setState({
      selectedScale: scale,
      selectedScaleIndex: index
    })

    this.threeRef.current.particles.setColorScale(scale)
    this.threeRef.current.particles.updateColor()
  }

  onLineSelect(algo, show) {
    this.threeRef.current.filterLines(algo, show)
  }


  onSegmentClustering() {
    var worker = new Worker('dist/cluster.js')

    // Try to extract puth bundles
    var load = []

    this.segments.forEach((segment, i) => {
      segment.vectors.forEach((vec, vi) => {
        if (vi < segment.vectors.length - 1) {
          load.push([
            segment.vectors[vi].x,
            segment.vectors[vi].y,
            segment.vectors[vi + 1].x,
            segment.vectors[vi + 1].y,
            segment.lineKey,
            segment.vectors[vi].clusterLabel == undefined ? 0 : segment.vectors[vi].clusterLabel,
            segment.vectors[vi + 1].clusterLabel == undefined ? 0 : segment.vectors[vi + 1].clusterLabel,
            segment.vectors[vi].view.meshIndex,
            segment.vectors[vi + 1].view.meshIndex])
        }
      })
    })

    worker.onmessage = (e) => {
      // Retreived segment clusters
      var bundles = {}
      var edgeClusters = new MultiDictionary()
      e.data.result.forEach((entry, i) => {
        const [label, probability] = entry

        if (label >= 0) {
          if (label in bundles) {
            bundles[label].push(load[i])
          } else {
            bundles[label] = [load[i]]
          }


          edgeClusters.insert(label, new DataEdge(this.vectors[load[i][7]], this.vectors[load[i][8]]))
        }
      })

      // Get center point for bundles
      var result = this.threeRef.current.debugD3(edgeClusters)
      var clusters = result[1]

      clusters.forEach(cluster => {
        var pts = cluster.vectors.map(vector => [vector.x, vector.y])
        // Get hull of cluster
        var polygon = concaveman(pts);

        // Get triangulated hull for cluster
        var triangulated = triangulate([polygon.flat()])


        cluster.hull = polygon
        cluster.triangulation = triangulated
      })


      //this.threeRef.current.debugSegs(bundles, edgeClusters)


      this.setState((state, props) => {
        this.threeRef.current.createClusters(clusters)

        var story = new Story(clusters.slice(0, 9), null)

        return {
          clusteringOpen: false,
          clusteringWorker: null,
          //clusters: clusters,
          stories: [story],
          activeStory: story
        }
      })
    }

    this.setState((state, props) => {
      return {
        clusteringOpen: true,
        clusteringWorker: worker
      }
    })

    worker.postMessage({
      type: 'segment',
      load: load
    })
  }





  render() {
    console.log("RENDER BAD")

    return <div style={
      {
        display: 'flex',
        alignItems: 'stretch',
        width: "100vw",
        height: "100vh",
        pointerEvents: this.state.projectionComputing ? 'none' : 'auto'
      }}>

      <div style={{
        flexShrink: 0,
        width: "18rem",
        height: '100vh',
        overflowX: 'hidden',
        overflowY: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>



        <div>
          <ChooseFileDialog onChange={this.onDataSelected}></ChooseFileDialog>


          <Tabs
            value={this.props.openTab}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, newVal) => { this.props.setOpenTab(newVal) }}
            aria-label="disabled tabs example"
          >
            <Tooltip enterDelay={500} title={<React.Fragment>
              <Typography variant="subtitle2">Point and Line Channels</Typography>
              <Typography variant="body2">Contains settings that let you map different channels like brightness and color on point and line attributes.</Typography>
            </React.Fragment>}><Tab icon={<PointsIcon></PointsIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>
            <Tooltip enterDelay={500} title={<React.Fragment>
              <Typography variant="subtitle2">Clustering</Typography>
              <Typography variant="body2">Contains options for displaying and navigating clusters in the dataset.</Typography>
            </React.Fragment>}><Tab icon={<ClusterIcon></ClusterIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>
            <Tooltip enterDelay={500} title={<React.Fragment>
              <Typography variant="subtitle2">Embedding and Projection</Typography>
              <Typography variant="body2">Contains options to perform projection techniques like t-SNE and other approaches like a force-directed layout.</Typography>
            </React.Fragment>}><Tab icon={<SettingsIcon style={{ fontSize: 48, color: 'black' }}></SettingsIcon>} style={{ minWidth: 0, flexGrow: 1 }} /></Tooltip>
          </Tabs>
        </div>


        <div style={{
          flexGrow: 1,
          overflowY: 'auto'
        }}>


          <Grid
            container
            justify="center"
            alignItems="stretch"
            direction="column">



            <Divider style={{ margin: '8px 0px' }} />

            <TabPanel value={this.props.openTab} index={0}>

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
                    }}
                    onChange={(id, checked) => {
                      var ch = this.state.selectedLines
                      ch[id] = checked

                      this.setState({
                        selectedLines: ch
                      })

                      this.threeRef.current.setLineFilter(ch)
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

                          let pointSize = attribute ? [1,2] : [1]
                        
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
                          value={this.state.selectedVectorByColor}
                          onChange={(event) => {
                            var attribute = null
                            if (event.target.value != "") {
                              attribute = this.props.categoryOptions.getCategory("color").attributes.filter(a => a.key == event.target.value)[0]
                            }
                            var state = {
                              selectedVectorByColor: event.target.value,
                              vectorByColor: attribute,
                              definedScales: [],
                              selectedScaleIndex: 0,
                              showColorMapping: undefined
                            }

                            this.props.setAdvancedColoringSelection(new Array(100).fill(true))

                            var scale = null

                            if (attribute != null && attribute.type == 'categorical') {
                              state.selectedScaleIndex = 0
                              state.definedScales = defaultScalesForAttribute(attribute)

                              scale = state.definedScales[state.selectedScaleIndex]
                            } else if (attribute != null) {
                              state.selectedScaleIndex = 0
                              state.definedScales = defaultScalesForAttribute(attribute)

                              scale = state.definedScales[state.selectedScaleIndex]
                            }


                            this.threeRef.current.particles.colorCat(attribute, this.mappingFromScale(scale, attribute, this.props.dataset))


                            state.showColorMapping = this.threeRef.current.particles.getMapping()
                            this.setState(state)

                            this.threeRef.current.particles.update()
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
                {this.state.definedScales != null && this.state.definedScales.length > 0 ?
                  <ColorScaleSelect selectedScaleIndex={this.state.selectedScaleIndex} onChange={this.onColorScaleChanged} definedScales={this.state.definedScales}></ColorScaleSelect>
                  : <div></div>}
              </Grid>


              <Grid item>
                {
                  this.state.vectorByColor != null && this.state.vectorByColor.type == 'categorical' ?

                    <AdvancedColoringPopover
                      showColorMapping={this.state.showColorMapping}></AdvancedColoringPopover>
                    :
                    <div></div>
                }


              </Grid>

            </TabPanel>


            <TabPanel value={this.props.openTab} index={1}>
              {this.props.dataset != null ?
                <ClusteringTabPanel
                  open={this.props.openTab == 1}
                  backendRunning={this.state.backendRunning}
                  clusteringWorker={this.state.clusteringWorker}
                  dataset={this.props.dataset}
                ></ClusteringTabPanel> : <div></div>
              }

            </TabPanel>

            <TabPanel value={this.props.openTab} index={2}>
              <EmbeddingTabPanel></EmbeddingTabPanel>
            </TabPanel>
          </Grid>

        </div>

      </div>





      <WebGLView
        ref={this.threeRef}
        algorithms={this.state.selectedLineAlgos}
      />

      <StateSequenceDrawerRedux></StateSequenceDrawerRedux>

      <ClusterOverview
        type={this.state.datasetType}
        //story={this.state.activeStory}
        itemClicked={(cluster) => {
          this.threeRef.current.setZoomTarget(cluster.vectors, 1)
        }}></ClusterOverview>



      <ToolSelectionRedux />

      <GithubLink></GithubLink>





      <SelectionClusters
        vectors={this.state.vectors}
        datasetType={this.state.datasetType}
        selectionState={this.state.selectionState}
      ></SelectionClusters>

      {this.props.activeStory && false && <StoryEditor></StoryEditor>}

    </div >
  }
})


ReactDOM.render(<Provider store={createStore(rootReducer)}><Application /></Provider>, document.getElementById("mountingPoint"))