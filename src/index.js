import "regenerator-runtime/runtime";

var meshes = require('./view/meshes')

var chess = require('./problems/chess')
var rubik = require('./problems/rubik')
var neural = require('./problems/neural')

var loader = require('./util/loader')
var colors = require('./util/colors')

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { CategorySelection, ShapeLegend, calculateOptions, Legend } from './view/categorical'
import { makeStyles } from '@material-ui/core/styles';
import DatasetSelector from './util/datasetselector'
import ThreeView from './view/view'




const useStyles = makeStyles(theme => ({
  heading: {
    fontSize: theme.typography.pxToRem(16),
    fontWeight: theme.typography.fontWeightRegular,
  },
  text: {
    fontSize: theme.typography.pxToRem(10),
    fontWeight: theme.typography.fontWeightRegular,
  }
}))







function setAggregateView(element, list, aggregation, type) {
  element.innerHTML = ""

  if (type == "chess") {
    element.innerHTML = chess.aggregate(list)
  }
  if (type == "rubik") {
    element.innerHTML = rubik.aggregate(list)
  }
  if (type == "neural") {
    element.innerHTML = neural.aggregate(list, aggregation)
  }
}




































window.showGuide = function () {
  if (document.getElementById("guide").style.display == "none") {
    document.getElementById("guide").style.display = "block"
  } else {
    document.getElementById("guide").style.display = "none"
  }

}

var settings = {
  showIntPoints: true
}


var chooseColor = colors.generator();

var algorithms = {};


/**
 * Checkbox determining if intermediate points should be drawn.
 */
window.showIntermediatePoints = function () {
  settings.showIntPoints = !settings.showIntPoints


  problem.particles.update()
}


window.toggleData = function (element, algo) {
  segments.forEach((segment) => {
    if (segment.algo == algo) {
      segment.line.visible = element.checked


      segment.vectors.forEach((vector) => {
        if (vector.algo == algo) {
          vector.visible = element.checked
        }
      })
    }
  })

  problem.particles.update()
}










function loadLegend(type) {
  var chessOpeners = ["Barnes Hut Opening", "Kings Pawn Opening", "English Opening"]

  if (type == "rubik") {
    document.getElementById('legend').innerHTML = rubik.legend(algorithms[1].color, algorithms[0].color)
  } else if (type == "chess") {
    console.log("chess loaded")
    document.getElementById('legend').innerHTML = chess.legend(Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'name': chessOpeners[key], 'algo': key } }))
  } else if (type == "neural") {
    //document.getElementById('legend').innerHTML = neural.legend(Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'learningRate': key } }))
  }
}






function getSegments(data) {
  //creating an array holding arrays of x,y,cubenum,algo,age for each cube

  // Sort data by cubeNum
  data.sort((a, b) => a.cubeNum - b.cubeNum)


  var n = data.length
  var points = new Array()
  var currentCube = 0
  var newArray = { vectors: new Array(), algo: data[0].algo }
  for (var i = 0; i < n; i++) {
    if (data[i].cubeNum != currentCube) {
      points.push(newArray)
      currentCube = data[i].cubeNum

      newArray = { vectors: new Array(), algo: data[i].algo }
    }

    newArray.vectors.push(data[i])
  }
  points.push(newArray)
  return points
}


class Application extends React.Component {

  constructor(props) {
    super(props)

    this.state = {}

    this.categoryRef = React.createRef()
    this.threeRef = React.createRef()
    this.shapeLegend = React.createRef()
    this.legend = React.createRef()
    this.onDatasetSelected = this.onDatasetSelected.bind(this)
    this.onHover = this.onHover.bind(this)
    this.onAggregate = this.onAggregate.bind(this)
    this.onCategoryChange = this.onCategoryChange.bind(this)
    this.onLineSelect = this.onLineSelect.bind(this)

    var url = new URL(window.location);
    var set = url.searchParams.get("set");

    if (set != null) {
      if (set == "neural") {
        this.preselect = "datasets/neural/learning_confmat.csv"
      } else if (set == "rubik") {
        this.preselect = "datasets/rubik/cube10x2_different_origins.csv"
      } else if (set == "chess") {
        this.preselect = "datasets/chess/chess16k.csv"
      }
    } else {
      this.preselect = "datasets/rubik/cube10x2_different_origins.csv"
    }
  }

  componentDidMount() {
    var url = new URL(window.location);
    var set = url.searchParams.get("set");
    if (set != null) {
      if (set == "neural") {
        this.preselect = "datasets/neural/learning_confmat.csv"
      } else if (set == "rubik") {
        this.preselect = "datasets/rubik/cube10x2_different_origins.csv"
      } else if (set == "chess") {
        this.preselect = "datasets/chess/chess16k.csv"
      }
      this.dataset = { path: this.preselect, type: set }
      this.loadData()
    } else {

      // Set new dataset as variable

      this.dataset = { path: this.preselect, type: "rubik" }

      // Load new view
      this.loadData()
    }
  }


  onHover(selected) {
    setAggregateView(document.getElementById('info'), selected, false, this.dataset.type)


  }

  onAggregate(selected) {
    setAggregateView(document.getElementById('aggregate'), selected, true, this.dataset.type)
  }

  /**
   * 
   * @param {*} type a category type eg. transparency or color
   * @param {*} value a category value eg. algo or cp
   */
  onCategoryChange(type, value) {
    // if the shape changed, we need to update the legend and update the particles
    if (type == 'shape') {
      this.shapeLegend.current.setState({ category: value })
      this.threeRef.current.particles.shapeCat(value)
    }
  }



  /**
   * Loads a specific problem set, creating menus, displaying vectors etc.
   */
  loadData() {
    chooseColor = colors.generator();
    algorithms = {}



    setAggregateView(document.getElementById('info'), [], false, this.dataset.type)
    setAggregateView(document.getElementById('aggregate'), [], true, this.dataset.type)




    // Load csv file
    loader.load(this.dataset.path, algorithms, chooseColor, data => {
      this.algorithms = algorithms
      this.segments = getSegments(data)
      this.vectors = data

      this.threeRef.current.createVisualization(this.vectors, this.segments, this.algorithms, settings)

      d3.json(`datasets/${this.dataset.type}/meta.json`).then(categories => {
        this.categorySelection = { "shape": "cp" }
        // Get categorical information about data set
        this.categoryOptions = calculateOptions(this.vectors, categories)

        this.categoryRef.current.setData(this.vectors, this.categoryOptions)



        this.shapeLegend.current.setSelection(this.categorySelection, this.categoryOptions)


        this.legend.current.load(this.dataset.type, this.algorithms)

        //loadLegend(this.dataset.type);
      })
    })
  }

  onDatasetSelected(event) {
    // Dispose old view
    this.threeRef.current.disposeScene()

    // Set new dataset as variable
    this.dataset = event

    // Load new view
    this.loadData()
  }

  onLineSelect(algo, show) {
    this.threeRef.current.filterLines(algo, show)
  }

  render() {
    return <div class="d-flex align-items-stretch" style={{ width: "100vw", height: "100vh" }}>
      <div class="flex-shrink-0" style={{ width: "18rem", margin: "0.5rem", 'overflow-y': 'scroll' }}>


        <DatasetSelector preselect={this.preselect} onChange={this.onDatasetSelected} />

        <hr />

        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Lines</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
          <Legend ref={this.legend} onLineSelect={this.onLineSelect}></Legend>
          </ExpansionPanelDetails>
        </ExpansionPanel>
      

        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Shapes</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <ShapeLegend ref={this.shapeLegend}></ShapeLegend>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <ExpansionPanel>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Categorisation</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <CategorySelection ref={this.categoryRef} onChange={this.onCategoryChange}></CategorySelection>
          </ExpansionPanelDetails>
        </ExpansionPanel>

      </div>

      <div style={{ width: "18rem", margin: "0.5rem" }} class="card flex-shrink-0">
        <div class="d-flex align-items-center justify-content-center" style={{ height: "50%" }}>
          <div class="text-center" style={{ width: "100%", height: "100%", position: "relative" }}>
            <div class="card-body p-2">
              <h6 class="card-title">Selected State</h6>
              <div id="info" class="d-flex align-items-stretch justify-content-center"></div>
            </div>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-center" style={{ height: "50%" }}>
          <div class="text-center" style={{ width: "100%", height: "100%", position: "relative" }}>
            <div class="card-body p-2">
              <h6 class="card-title">State Similiarity</h6>
              <div id="aggregate" class="d-flex align-items-stretch justify-content-center"></div>
            </div>
          </div>
        </div>
      </div>

      <ThreeView ref={this.threeRef} onHover={this.onHover} onAggregate={this.onAggregate} />

      <div id="guide" style={{ position: "absolute", left: "18rem", top: "2rem", display: "none" }}>
        <div class="card bg-dark text-white" style={{ width: "20rem", height: "20rem", opacity: "90%" }}>
          <div class="card-body">
            <h5 class="card-title">Basic Controls</h5>

            <p class="card-text">You can move the camera by pressing the left mouse button and dragging the image.</p>
            <p class="card-text">Use your mousewheel to zoom in and out of the projection.</p>
            <p class="card-text">You can select multiple states by dragging a rectangle while pressing the ALT key.</p>
          </div>
        </div>
      </div>

    </div>
  }
}




ReactDOM.render(<Application />, document.getElementById("test2"))
