import "regenerator-runtime/runtime";

import Alert from '@material-ui/lab/Alert';
import Typography from '@material-ui/core/Typography';
import { calculateOptions } from './view/categorical'
import { ShapeLegend } from './ShapeLegend/ShapeLegend'
import ThreeView from './view/view'
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
import { graphLayout } from "./util/graphs";
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
import * as libtess from 'libtess'



/*global libtess */
/* exported triangulate */

var tessy = (function initTesselator() {
  // function called for each vertex of tesselator output
  function vertexCallback(data, polyVertArray) {
    // console.log(data[0], data[1]);
    polyVertArray[polyVertArray.length] = data[0];
    polyVertArray[polyVertArray.length] = data[1];
  }
  function begincallback(type) {
    if (type !== libtess.primitiveType.GL_TRIANGLES) {
      console.log('expected TRIANGLES but got type: ' + type);
    }
  }
  function errorcallback(errno) {
    console.log('error callback');
    console.log('error number: ' + errno);
  }
  // callback for when segments intersect and must be split
  function combinecallback(coords, data, weight) {
    // console.log('combine callback');
    return [coords[0], coords[1], coords[2]];
  }
  function edgeCallback(flag) {
    // don't really care about the flag, but need no-strip/no-fan behavior
    // console.log('edge flag: ' + flag);
  }


  var tessy = new libtess.GluTesselator();
  // tessy.gluTessProperty(libtess.gluEnum.GLU_TESS_WINDING_RULE, libtess.windingRule.GLU_TESS_WINDING_POSITIVE);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_VERTEX_DATA, vertexCallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_BEGIN, begincallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_ERROR, errorcallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_COMBINE, combinecallback);
  tessy.gluTessCallback(libtess.gluEnum.GLU_TESS_EDGE_FLAG, edgeCallback);

  return tessy;
})();

function triangulate(contours) {
  // libtess will take 3d verts and flatten to a plane for tesselation
  // since only doing 2d tesselation here, provide z=1 normal to skip
  // iterating over verts only to get the same answer.
  // comment out to test normal-generation code
  tessy.gluTessNormal(0, 0, 1);

  var triangleVerts = [];
  tessy.gluTessBeginPolygon(triangleVerts);

  for (var i = 0; i < contours.length; i++) {
    tessy.gluTessBeginContour();
    var contour = contours[i];
    for (var j = 0; j < contour.length; j += 2) {
      var coords = [contour[j], contour[j + 1], 0];
      tessy.gluTessVertex(coords, coords);
    }
    tessy.gluTessEndContour();
  }

  // finish polygon (and time triangulation process)
  var startTime = new Date().getTime();
  tessy.gluTessEndPolygon();
  var endTime = new Date().getTime();

  return triangleVerts;
}






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






class Application extends React.Component {
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

      currentTool: 'default',

      projectionComputing: false,

      sizeScale: [1, 2],

      tabValue: 0,

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




  onPointClusteringStartClick() {
    var worker = new Worker('dist/cluster.js')
    worker.onmessage = (e) => {
      var clusters = []
      Object.keys(e.data).forEach(k => {
        var t = e.data[k]
        clusters[k] = new Cluster(t.points, t.bounds, t.hull, t.triangulation)
        clusters[k].label = k
        clusters.push(clusters[k])
      })

      // Inject cluster attributes
      clusters.forEach(cluster => {
        var vecs = []
        cluster.points.forEach(point => {
          var label = point.label
          var probability = point.probability
          var index = point.meshIndex
          vecs.push(this.dataset.vectors[point.meshIndex])

          this.dataset.vectors[index]['clusterLabel'] = label

          if (isNaN(probability)) {
            this.dataset.vectors[index]['clusterProbability'] = 0
          } else {
            this.dataset.vectors[index]['clusterProbability'] = probability
          }
        })
        cluster.vectors = vecs
      })
    }


    worker.postMessage({
      type: 'point',
      load: this.vectors.map(vector => [vector.x, vector.y])
    })


    this.setState((state, props) => {
      return {
        clusteringOpen: true,
        clusteringWorker: worker
      }
    })
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
          clusters: clusters,
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



  onClusteringStartClick() {
    /**var worker = new Worker('dist/cluster.js')
 
    var load = []
 
    this.segments.forEach((segment, i) => {
      segment.vectors.forEach((vec, vi) => {
        if (vi < segment.vectors.length - 1) {
          load.push([segment.vectors[vi].x, segment.vectors[vi].y, segment.vectors[vi + 1].x, segment.vectors[vi + 1].y, segment.vectors[vi].view.lineIndex])
        }
      })
    })
 
    worker.onmessage = (e) => {
      // Retreived segment clusters
      var bundles = {}
      console.log(e.data)
      e.data.result.forEach((entry, i) => {
        const [label, probability] = entry
 
        if (label >= 0) {
          if (label in bundles) {
            bundles[label].push(load[i])
          } else {
            bundles[label] = [ load[i] ]
          }
        }
      })
      
      // Get center point for bundles
      console.log(bundles)
      this.threeRef.current.debugSegs(bundles)
    }
 
    worker.postMessage({
      type: 'segment',
      load: load
    })
    return;**/






    var worker = new Worker('dist/cluster.js')
    worker.onmessage = (e) => {
      // Point clusteruing
      var clusters = []
      Object.keys(e.data).forEach(k => {
        var t = e.data[k]
        var f = new Cluster(t.points, t.bounds, t.hull, t.triangulation)
        f.label = k
        clusters.push(f)
      })


      // Inject cluster attributes
      clusters.forEach(cluster => {
        var vecs = []
        cluster.points.forEach(point => {
          var label = point.label
          var probability = point.probability
          var index = point.meshIndex
          vecs.push(this.dataset.vectors[point.meshIndex])

          this.dataset.vectors[index]['clusterLabel'] = label

          if (isNaN(probability)) {
            this.dataset.vectors[index]['clusterProbability'] = 0
          } else {
            this.dataset.vectors[index]['clusterProbability'] = probability
          }
        })
        cluster.vectors = vecs
      })

      this.setState((state, props) => {
        var colorAttribute = state.categoryOptions.json.find(e => e.category == 'color').attributes
        if (!colorAttribute.find(e => e.key == 'clusterLabel')) {
          colorAttribute.push({
            "key": 'clusterLabel',
            "name": 'clusterLabel',
            "type": "categorical"
          })
        }



        var transparencyAttribute = state.categoryOptions.json.find(e => e.category == 'transparency').attributes
        if (!transparencyAttribute.find(e => e.key == 'clusterProbability')) {
          transparencyAttribute.push({
            "key": 'clusterProbability',
            "name": 'clusterProbability',
            "type": "sequential",
            "values": {
              "range": [0.2, 1]
            }
          })
        }



        this.threeRef.current.createClusters(clusters)

        var story = new Story(clusters.slice(0, 9))

        return {
          categoryOptions: state.categoryOptions,
          clusteringOpen: false,
          clusteringWorker: null,
          clusters: clusters,
          stories: [story],
          activeStory: story
        }
      })
    }
    worker.postMessage({
      type: 'point',
      load: this.vectors.map(vector => [vector.x, vector.y])
    })


    this.setState((state, props) => {
      return {
        clusteringOpen: true,
        clusteringWorker: worker
      }
    })
  }


  render() {
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
            value={this.state.tabValue}
            indicatorColor="primary"
            textColor="primary"
            onChange={(e, newVal) => { this.setState({ tabValue: newVal }) }}
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

            <TabPanel value={this.state.tabValue} index={0}>
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

            <TabPanel value={this.state.tabValue} index={1}>
              <FlexParent
                alignItems='stretch'
                flexDirection='column'
                margin='0 16px'
              >
                <Button
                  variant="outlined"
                  disabled={this.state.backendRunning == false}
                  style={{
                    margin: '8px 0'
                  }}
                  onClick={() => {
                    this.onClusteringStartClick()
                  }}>Start Clustering</Button>

                <Button
                  variant="outlined"
                  disabled={this.state.backendRunning == false}
                  style={{
                    margin: '8px 0'
                  }}
                  onClick={() => {
                    this.onSegmentClustering()
                  }}>Segment Clustering</Button>

                {this.state.backendRunning ? <div></div> : <Alert severity="error">No backend detected!</Alert>}

                <Button
                  variant="outlined"
                  style={{
                    margin: '8px 0'
                  }}
                  onClick={() => {
                    function downloadCSV(csv, filename) {
                      var csvFile;
                      var downloadLink;

                      // CSV file
                      csvFile = new Blob([csv], { type: "text/plain" });

                      // Download link
                      downloadLink = document.createElement("a");

                      // File name
                      downloadLink.download = filename;

                      // Create a link to the file
                      downloadLink.href = window.URL.createObjectURL(csvFile);

                      // Hide download link
                      downloadLink.style.display = "none";

                      // Add the link to DOM
                      document.body.appendChild(downloadLink);

                      // Click download link
                      downloadLink.click();
                    }

                    function vectorAsXml(vectors, segments) {

                      var nodes = vectors.map((vector, i) => {
                        return `
                        <node id="${i}">
                          <data key="x">${vector.x}</data>
                          <data key="tooltip">LIT(lngx=-92.224444,laty=34.729444)</data>
                          <data key="y">${vector.y}</data>
                        </node>`
                      })

                      var edges = ""

                      var j = 0
                      segments.forEach((segment, si) => {
                        for (var i = 0; i < segment.vectors.length - 1; i++) {
                          var p0 = segment.vectors[i]
                          var p1 = segment.vectors[i + 1]


                          edges = edges + `<edge id="${j}" source="${p0.view.meshIndex}" target="${p1.view.meshIndex}">
                                            </edge>`
                          j = j + 1
                        }
                      })

                      return nodes + edges
                    }

                    downloadCSV(vectorAsXml(this.dataset.vectors, this.dataset.segments), "output.tra")
                  }}>TraClus download</Button>

                <ClusterWindow
                  worker={this.state.clusteringWorker}
                  onClose={() => {
                    var worker = this.state.clusteringWorker
                    if (worker != null) {
                      worker.terminate()
                    }

                    this.setState({
                      clusteringWorker: null,
                      clusteringOpen: false
                    })
                  }}
                ></ClusterWindow>





                <StoryPreview stories={this.state.stories} activeStory={this.state.activeStory} onChange={((e, newStory) => this.setState({ activeStory: newStory }))}></StoryPreview>
              </FlexParent>



            </TabPanel>

            <TabPanel value={this.state.tabValue} index={2}>
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
        clusters={this.state.clusters}
        onHover={this.onHover}
        algorithms={this.state.selectedLineAlgos}
        onAggregate={this.onAggregate}
        selectionState={this.state.selectionState}
        pathLengthRange={this.state.pathLengthRange}
        tool={this.state.currentTool}
        activeStory={this.state.activeStory}>

      </ThreeView>


      <ClusterOverview type={this.state.datasetType} story={this.state.activeStory} itemClicked={(cluster) => {
        this.threeRef.current.setZoomTarget(cluster.vectors, 1)
      }}></ClusterOverview>

      <ToolSelection
        currentTool={this.state.currentTool}
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
}


ReactDOM.render(<Application />, document.getElementById("test2"))