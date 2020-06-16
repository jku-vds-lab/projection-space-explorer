import "regenerator-runtime/runtime";

import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import { calculateOptions } from './view/categorical'
import { ShapeLegend } from './ShapeLegend/ShapeLegend'
import { ThreeView } from './view/view'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { ColorScaleSelect, defaultScalesForAttribute, ContinuosScale, DiscreteScale, DiscreteMapping, ContinuousMapping, NamedCategoricalScales, SimplePopover } from "./util/colors";
import { Divider, Card, CardContent } from "@material-ui/core";
import { loadFromPath } from './util/datasetselector'
import { LineSelectionPopover, LineSelectionTree } from './view/lineselectiontree'
import Box from '@material-ui/core/Box';
import { TensorLoader, MediaControlCard, AdditionalMenu, ClusterWindow } from "./projection/integration";
import { arraysEqual } from "./view/utilfunctions";
import BlurOffIcon from '@material-ui/icons/BlurOff';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import { GenericLegend } from './legends/Generic'
import { ChooseFileDialog } from './util/dataselectui'
import { FlexParent } from './library/grid'
import { DataEdge, MultiDictionary } from "./util/datasetselector"
import * as React from "react";
import { SelectionClusters } from "./clustering/SelectionClusters/SelectionClusters";
import { ToolSelection } from "./ToolSelection/ToolSelection";
import { PathLengthFilter } from "./PathLengthFilter/PathLengthFilter";
import { SizeSlider } from "./SizeSlider/SizeSlider";
import { ClusterOverview } from "./clustering/ClusterOverview/ClusterOverview";
import Cluster, { Story } from "./library/Cluster";
import { FingerprintPreview } from "./clustering/FingerprintPreview/FingerprintPreview";
import { StoryPreview } from "./clustering/StoryPreview/StoryPreview";
import { Legend } from "./Legend/Legend";
import concaveman = require("concaveman");

import { ClusteringTabPanel } from "./DrawerTabPanels/ClusteringTabPanel/ClusteringTabPanel";
import { annotateVectors, triangulate } from "./util/tools";
import { createStore, combineReducers } from 'redux'
import { Provider } from 'react-redux'
import { connect } from 'react-redux'
import currentTool from "./Reducers/CurrentToolReducer";
import currentAggregation from "./Reducers/CurrentAggregationReducer";
import activeStory from "./Reducers/ActiveStoryReducer";
import stories from "./Reducers/StoriesReducer";
import currentClusters from "./Reducers/CurrentCLustersReducer";
import openTab from "./Reducers/OpenTabReducer";
import clusterEdges from "./Reducers/ClusterEdgesReducer";









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



function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



const mapStateToProps = state => ({
  currentTool: state.currentTool,
  openTab: state.openTab
})


const mapDispatchToProps = dispatch => ({
  setOpenTab: openTab => dispatch({
    type: 'SET_OPEN_TAB',
    openTab: openTab
  })
})


var Application = connect(mapStateToProps, mapDispatchToProps)(class extends React.Component {
  threeRef: React.RefObject<any>;
  legend: React.RefObject<unknown>;
  dataset: any;
  vectors: any;
  segments: any;

  constructor(props) {
    super(props)

    this.state = {
      selectionState: [],
      selectionAggregation: [],

      fileDialogOpen: true,

      vectorByShape: null,
      selectedVectorByShape: "",

      vectorByTransparency: null,
      selectedVectorByTransparency: "",

      vectorBySize: null,
      selectedVectorBySize: "",

      vectorByColor: null,
      selectedVectorByColor: "",

      legendSelected: {},

      selectedScaleIndex: 0,
      selectedScale: null,
      definedScales: null,

      datasetType: 'none',

      colorsChecked: new Array(100).fill(true),

      selectedLines: {},

      pathLengthRange: null,

      projectionComputing: false,

      sizeScale: [1, 2],

      backendRunning: false,

      projectionOpen: false
    }

    var worker = new Worker('dist/healthcheck.js')
    worker.onmessage = (e) => {
      this.setState({
        backendRunning: e.data
      })
    }





    this.threeRef = React.createRef()
    this.legend = React.createRef()
    this.onHover = this.onHover.bind(this)
    this.onAggregate = this.onAggregate.bind(this)
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

      loadFromPath(preselect, this.onDataSelected)
    } else {
      loadFromPath(preselect, (dataset, json) => { this.onDataSelected(dataset, json) })
    }

    window.addEventListener('resize', this.onResize.bind(this))
  }

  convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  onResize() {
    this.threeRef.current.resize(window.innerWidth - this.convertRemToPixels(18 * 1), window.innerHeight)
  }


  setAggregateView(element, list, type) {
    if (list == null || list.length <= 0) {
      this.setState({ selectionAggregation: [] })
    } else {
      this.setState({ selectionAggregation: list })
    }
  }

  setSelectionView(element, list, type) {
    if (list == null || list.length <= 0) {
      this.setState({ selectionState: [] })
    } else {
      this.setState({ selectionState: list })
    }
  }

  onHover(selected) {
    this.setSelectionView(document.getElementById('info'), selected, this.dataset.info.type)
  }

  onAggregate(selected) {
    this.setAggregateView(document.getElementById('aggregate'), selected, this.dataset.info.type)
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
    this.dataset = dataset
    this.vectors = dataset.vectors
    this.segments = dataset.segments
    this.categories = json

    this.setState({
      datasetType: this.dataset.info.type,
      dataset: dataset,
      vectors: this.vectors
    })

    // Load new view
    this.loadData2()
  }


  loadData2() {
    this.setAggregateView(document.getElementById('info'), [], false, this.dataset.info.type)
    this.setAggregateView(document.getElementById('aggregate'), [], true, this.dataset.info.type)


    //this.lineColorScheme = new DefaultLineColorScheme().createMapping([... new Set(this.vectors.map(vector => vector.algo))])
    this.lineColorScheme = this.mappingFromScale(NamedCategoricalScales.DARK2, { key: 'algo' })

    this.setState({
      lineColorScheme: this.lineColorScheme
    })

    this.threeRef.current.createVisualization(this.dataset, this.lineColorScheme, null)

    this.finite()
  }

  finite() {
    var algos = LineSelectionTree.genAlgos(this.vectors)
    var selLines = LineSelectionTree.getChecks(algos)

    // Update shape legend
    this.setState({
      categoryOptions: calculateOptions(this.vectors, this.categories),
      selectedVectorByShape: "",
      vectorByShape: null,
      vectorByTransparency: null,
      selectedVectorByTransparency: "",
      vectorBySize: null,
      vectorByColor: null,
      selectedVectorByColor: "",
      selectedVectorBySize: "",
      selectedLines: selLines,
      selectedLineAlgos: algos,
      pathLengthRange: [0, this.dataset.getMaxPathLength()],
      maxPathLength: this.dataset.getMaxPathLength()
    })




    this.legend.current.load(this.dataset.info.type, this.lineColorScheme, this.state.selectedLineAlgos)

    this.initializeEncodings()
  }

  mappingFromScale(scale, attribute) {
    if (scale instanceof DiscreteScale) {
      // Generate scale
      return new DiscreteMapping(scale, [... new Set(this.vectors.map(vector => vector[attribute.key]))])
    }
    if (scale instanceof ContinuosScale) {
      var min = null, max = null
      if (attribute.key in this.dataset.ranges) {
        min = this.dataset.ranges[attribute.key].min
        max = this.dataset.ranges[attribute.key].max
      } else {
        var filtered = this.vectors.map(vector => vector[attribute.key])
        max = Math.max(...filtered)
        min = Math.min(...filtered)
      }

      return new ContinuousMapping(scale, { min: min, max: max })
    }
    return null
  }

  initializeEncodings() {
    var state = {}

    var defaultSizeAttribute = this.state.categoryOptions.getAttribute('size', 'multiplicity', 'sequential')
    if (defaultSizeAttribute) {
      state.selectedVectorBySize = defaultSizeAttribute.key
      state.vectorBySize = defaultSizeAttribute

      this.threeRef.current.particles.sizeCat(defaultSizeAttribute)
    }

    var defaultColorAttribute = this.state.categoryOptions.getAttribute("color", "algo", "categorical")
    if (defaultColorAttribute) {
      state.definedScales = defaultScalesForAttribute(defaultColorAttribute)
      state.selectedScaleIndex = 0
      state.selectedVectorByColor = defaultColorAttribute.key
      state.vectorByColor = defaultColorAttribute

      this.threeRef.current.particles.colorCat(defaultColorAttribute, this.mappingFromScale(state.definedScales[state.selectedScaleIndex], defaultColorAttribute))
      state.showColorMapping = this.threeRef.current.particles.getMapping()
    }

    var defaultBrightnessAttribute = this.state.categoryOptions.getAttribute("transparency", "age", "sequential")
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
      selectedScaleIndex: index,
      colorsChecked: new Array(100).fill(true)
    })

    this.threeRef.current.particles.setColorScale(scale)
    this.threeRef.current.particles.updateColor()
  }

  onLineSelect(algo, show) {
    this.threeRef.current.filterLines(algo, show)
  }

  legendOnChange(event) {
    var select = this.legendSelected
    select
    var newState = {
      legendSelected: {}
    }
    var col = newState.colors.filter(c => c.color == event.target.id)[0]
    col.checked = event.target.checked

    this.setState(newState)

    this.props.onLineSelect(col.algo, event.target.checked)
  }


  selectColorAttribute() {
    var attribute = null
    if (event.target.value != "") {
      attribute = this.state.categoryOptions.getCategory("color").attributes.filter(a => a.key == event.target.value)[0]
    }
    var state = {
      selectedVectorByColor: event.target.value,
      vectorByColor: attribute,
      definedScales: [],
      selectedScaleIndex: 0,
      colorsChecked: new Array(100).fill(true)
    }

    var scale = null

    if (attribute != null && attribute.type == 'categorical') {
      state.selectedScaleIndex = 0
      state.definedScales = defaultScalesForAttribute(attribute)

      scale = state.definedScales[state.selectedScaleIndex]

      this.threeRef.current.particles.colorFilter(state.colorsChecked)
    } else if (attribute != null) {
      state.selectedScaleIndex = 0
      state.definedScales = defaultScalesForAttribute(attribute)

      scale = state.definedScales[state.selectedScaleIndex]

      this.threeRef.current.particles.colorFilter(null)
    }


    this.threeRef.current.particles.colorCat(attribute, this.mappingFromScale(scale, attribute))


    state.showColorMapping = this.threeRef.current.particles.getMapping()
    this.setState(state)

    this.threeRef.current.particles.update()
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
            segment.vectors[vi].view.lineIndex,
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

        var story = new Story(clusters.slice(0, 9))

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
    console.log("application render")
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
            <Tab label="States" style={{ minWidth: 0, flexGrow: 1 }} />
            <Tab label="Clusters" style={{ minWidth: 0, flexGrow: 1 }} />
            <Tab label="Projection" style={{ minWidth: 0, flexGrow: 1 }} />
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
                  algorithms={this.state.selectedLineAlgos}
                  onLineSelect={this.onLineSelect}></Legend>

                <Box p={1}></Box>

                <LineSelectionPopover vectors={this.state.vectors}
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
                  }} checkboxes={this.state.selectedLines} algorithms={this.state.selectedLineAlgos} colorScale={this.state.lineColorScheme}>

                </LineSelectionPopover>
              </Grid>

              <div style={{ margin: '8px 0px' }}></div>

              <PathLengthFilter
                pathLengthRange={this.state.pathLengthRange}
                maxPathLength={this.state.maxPathLength}
                onChange={(event, newValue) => {
                  this.setState({
                    pathLengthRange: newValue
                  })
                }}></PathLengthFilter>

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





              {
                this.state.categoryOptions != null && this.state.categoryOptions.hasCategory("shape") ?
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

                        value={this.state.selectedVectorByShape}
                        onChange={(event) => {
                          var attribute = this.state.categoryOptions.getCategory("shape").attributes.filter(a => a.key == event.target.value)[0]

                          this.setState({
                            selectedVectorByShape: event.target.value,
                            vectorByShape: attribute
                          })

                          this.threeRef.current.filterPoints({ 'star': true, 'cross': true, 'circle': true, 'square': true })
                          this.threeRef.current.particles.shapeCat(attribute)
                        }}
                      >
                        <MenuItem value="">None</MenuItem>
                        {this.state.categoryOptions.getCategory("shape").attributes.map(attribute => {
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
                  dataset={this.state.dataset}
                  category={this.state.vectorByShape}
                  onChange={(checkboxes) => {
                    this.threeRef.current.filterPoints(checkboxes)
                  }}></ShapeLegend>
              </Grid>

              {
                this.state.categoryOptions != null && this.state.categoryOptions.hasCategory("transparency") ?
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
                          var attribute = this.state.categoryOptions.getCategory("transparency").attributes.filter(a => a.key == event.target.value)[0]

                          this.setState({
                            selectedVectorByTransparency: event.target.value,
                            vectorByTransparency: attribute
                          })

                          this.threeRef.current.particles.transparencyCat(attribute)
                        }}
                      >
                        <MenuItem value="">None</MenuItem>
                        {this.state.categoryOptions.getCategory("transparency").attributes.map(attribute => {
                          return <MenuItem key={attribute.key} value={attribute.key}>{attribute.name}</MenuItem>
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  :
                  <div></div>
              }

              {
                this.state.categoryOptions != null && this.state.categoryOptions.hasCategory("size") ?
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
                        value={this.state.selectedVectorBySize}
                        onChange={(event) => {
                          var attribute = this.state.categoryOptions.getCategory("size").attributes.filter(a => a.key == event.target.value)[0]

                          this.setState({
                            selectedVectorBySize: event.target.value,
                            vectorBySize: attribute
                          })

                          this.threeRef.current.particles.sizeCat(attribute)
                        }}
                      >
                        <MenuItem value="">None</MenuItem>
                        {this.state.categoryOptions.getCategory("size").attributes.map(attribute => {
                          return <MenuItem key={attribute.key} value={attribute.key}>{attribute.name}</MenuItem>
                        })}
                      </Select>
                    </FormControl>
                  </Grid>
                  :
                  <div></div>
              }

              {
                this.state.categoryOptions != null && this.state.categoryOptions.hasCategory("size") && this.state.vectorBySize != null ?
                  <SizeSlider
                    sizeScale={this.state.vectorBySize.values.range}
                    onChange={(e, newVal) => {
                      if (arraysEqual(newVal, this.state.vectorBySize.values.range)) {
                        return;
                      }

                      this.state.vectorBySize.values.range = newVal

                      this.setState({
                        vectorBySize: this.state.vectorBySize
                      })

                      if (this.state.vectorBySize != null) {
                        this.threeRef.current.particles.sizeCat(this.state.vectorBySize)
                        this.threeRef.current.particles.updateSize()
                      }
                    }}
                  ></SizeSlider> : <div></div>
              }

              {
                this.state.categoryOptions != null && this.state.categoryOptions.hasCategory("color") ?
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
                              attribute = this.state.categoryOptions.getCategory("color").attributes.filter(a => a.key == event.target.value)[0]
                            }
                            var state = {
                              selectedVectorByColor: event.target.value,
                              vectorByColor: attribute,
                              definedScales: [],
                              selectedScaleIndex: 0,
                              colorsChecked: new Array(100).fill(true)
                            }

                            var scale = null

                            if (attribute != null && attribute.type == 'categorical') {
                              state.selectedScaleIndex = 0
                              state.definedScales = defaultScalesForAttribute(attribute)

                              scale = state.definedScales[state.selectedScaleIndex]

                              this.threeRef.current.particles.colorFilter(state.colorsChecked)
                            } else if (attribute != null) {
                              state.selectedScaleIndex = 0
                              state.definedScales = defaultScalesForAttribute(attribute)

                              scale = state.definedScales[state.selectedScaleIndex]

                              this.threeRef.current.particles.colorFilter(null)
                            }


                            this.threeRef.current.particles.colorCat(attribute, this.mappingFromScale(scale, attribute))


                            state.showColorMapping = this.threeRef.current.particles.getMapping()
                            this.setState(state)

                            this.threeRef.current.particles.update()
                          }}
                        >
                          <MenuItem value="">None</MenuItem>
                          {this.state.categoryOptions.getCategory("color").attributes.map(attribute => {
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

                    <SimplePopover
                      showColorMapping={this.state.showColorMapping}
                      colorsChecked={this.state.colorsChecked}
                      onChange={(event) => {

                        var state = {}
                        state.colorsChecked = this.state.colorsChecked
                        state.colorsChecked[event.target.id] = event.target.checked
                        this.setState(state)

                        this.threeRef.current.particles.colorFilter(state.colorsChecked)
                      }}></SimplePopover>
                    :
                    <div></div>
                }


              </Grid>

            </TabPanel>

            <TabPanel value={this.props.openTab} index={1}>
              {this.state.dataset != null ?
                <ClusteringTabPanel
                  open={this.props.openTab == 1}
                  backendRunning={this.state.backendRunning}
                  clusteringWorker={this.state.clusteringWorker}
                  dataset={this.state.dataset}
                ></ClusteringTabPanel> : <div></div>
              }

            </TabPanel>

            <TabPanel value={this.props.openTab} index={2}>
              <FlexParent
                alignItems='stretch'
                flexDirection='column'
                margin='0 16px'
              >
                <Button variant="outlined"
                  style={{
                    margin: '8px 0'
                  }}
                  onClick={() => {
                    this.setState((state, props) => {
                      return {
                        projectionOpen: true
                      }
                    })
                  }}>Start Projection</Button>

                <MediaControlCard
                  input={this.state.projectionInput}
                  worker={this.state.projectionWorker}
                  params={this.state.projectionParams}
                  onClose={() => {
                    if (this.state.projectionWorker) {
                      this.state.projectionWorker.terminate()
                    }

                    this.setState({
                      projectionComputing: false,
                      projectionInput: null,
                      projectionParams: null,
                      projectionWorker: null
                    })
                  }}
                  onComputingChanged={(e, newVal) => {
                    this.setState({
                      projectionComputing: newVal
                    })
                  }}
                  onStep={(Y) => {
                    this.vectors.forEach((vector, i) => {
                      vector.x = Y[i][0]
                      vector.y = Y[i][1]
                    })
                    this.threeRef.current.updateXY()
                  }} />
              </FlexParent>
            </TabPanel>
          </Grid>

        </div>

      </div>





      <ThreeView
        ref={this.threeRef}
        //clusters={this.state.clusters}
        onHover={this.onHover}
        algorithms={this.state.selectedLineAlgos}
        onAggregate={this.onAggregate}
        selectionState={this.state.selectionState}
        pathLengthRange={this.state.pathLengthRange}
        tool={this.props.currentTool}
        type={this.state.datasetType}>
      </ThreeView>


      <ClusterOverview
        type={this.state.datasetType}
        //story={this.state.activeStory}
        itemClicked={(cluster) => {
          this.threeRef.current.setZoomTarget(cluster.vectors, 1)
        }}></ClusterOverview>

      <ToolSelection
        currentTool={this.props.currentTool}
        onChange={(newValue) => this.setState({ currentTool: newValue })} />


      <TensorLoader
        open={this.state.projectionOpen}
        setOpen={(value) => {
          this.setState({
            projectionOpen: value
          })
        }}

        dataset={this.state.dataset}

        onTensorInitiated={(event, selected, params) => {

          var worker = new Worker('dist/worker.js')

          // Initialise state
          this.setState({
            projectionComputing: true,
            projectionWorker: worker,
            projectionInput: this.state.dataset.asTensor(selected),
            projectionParams: params
          })
        }}
      ></TensorLoader>


      <SelectionClusters
        vectors={this.state.vectors}
        datasetType={this.state.datasetType}
        selectionState={this.state.selectionState}
        selectionAggregation={this.state.selectionAggregation}
      ></SelectionClusters>


    </div >
  }
})



/**
 * Combine reducers and create a store for the main application.
 */
const rootReducer = combineReducers({
  currentTool: currentTool,
  currentAggregation: currentAggregation,
  activeStory: activeStory,
  stories: stories,
  currentClusters: currentClusters,
  openTab: openTab,
  clusterEdges: clusterEdges
})


const store = createStore(rootReducer)

ReactDOM.render(<Provider store={store}><Application /></Provider>, document.getElementById("test2"))