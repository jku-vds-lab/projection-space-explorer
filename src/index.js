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
import { CategorySelection, ShapeLegend, calculateOptions, Legend, LegendFun } from './view/categorical'
import { makeStyles } from '@material-ui/core/styles';
import DatasetSelector from './util/datasetselector'
import ThreeView from './view/view'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';



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


/**
 * Checkbox determining if intermediate points should be drawn.
 */
window.showIntermediatePoints = function () {
  settings.showIntPoints = !settings.showIntPoints


  problem.particles.update()
}






const AggregationComponent = ({ aggregation }) => {
}






class Application extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      selectedCategory: null,
      algorithms: {},
      legendSelected: {},
      checkboxes: { 'star': true, 'cross': true, 'circle': true, 'square': true }
    }

    this.categoryRef = React.createRef()
    this.threeRef = React.createRef()
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

    window.addEventListener('resize', this.onResize.bind(this))
  }

  convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  onResize() {
    this.threeRef.current.resize(window.innerWidth - this.convertRemToPixels(18 * 1), window.innerHeight)
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
      this.setState({
        selectedCategory: value
      })
      console.log("SELECTED")
      console.log(value)
      this.threeRef.current.particles.shapeCat(value)
    }
    if (type == "transparency") {
      console.log("transparency selected")
      this.threeRef.current.particles.transparencyCat(value)
    }
    if (type == "size") {
      console.log("size selected")
      this.threeRef.current.particles.sizeCat(value)
    }
    if (type == "color") {
      console.log("color selected")
      this.threeRef.current.particles.colorCat(value)
    }
  }



  /**
   * Loads a specific problem set, creating menus, displaying vectors etc.
   */
  loadData() {
    chooseColor = colors.generator();

    setAggregateView(document.getElementById('info'), [], false, this.dataset.type)
    setAggregateView(document.getElementById('aggregate'), [], true, this.dataset.type)

    var algorithms = {}
    // Load csv file
    loader.load(this.dataset.path, algorithms, chooseColor, data => {
      this.segments = loader.getSegments(data)
      this.vectors = data

      this.threeRef.current.createVisualization(this.vectors, this.segments, algorithms, settings)

      d3.json(`datasets/${this.dataset.type}/meta.json`).then(categories => {
        this.categorySelection = {
          "color": "",
          "transparency": "",
          "shape": "",
          "size": ""
        }
        // Get categorical information about data set
        this.categoryOptions = calculateOptions(this.vectors, categories)

        this.categoryRef.current.setData(this.vectors, this.categoryOptions, this.categorySelection)

        // Update shape legend        
        var category = []
        if ("shape" in this.categoryOptions) {
          category = this.categoryOptions["shape"].attributes.filter(a => a.key == this.categorySelection.shape)
        }
        if (category.length > 0) {
          this.setState({
            selectedCategory: category[0]
          })
        } else {
          this.setState({
            selectedCategory: null
          })
        }
        this.setState({
          algorithms: algorithms,
          checkboxes: { 'star': true, 'cross': true, 'circle': true, 'square': true }
        })
        this.legend.current.load(this.dataset.type, algorithms)
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

  render() {
    return <div class="d-flex align-items-stretch" style={{ width: "100vw", height: "100vh" }}>
      <div class="flex-shrink-0" style={{ width: "18rem", 'overflow-y': 'auto' }}>

        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Dataset Selector</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <DatasetSelector preselect={this.preselect} onChange={this.onDatasetSelected} />
          </ExpansionPanelDetails>
        </ExpansionPanel>


        <ExpansionPanel defaultExpanded>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Lines and Points</Typography>
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
            <ShapeLegend category={this.state.selectedCategory} checkboxes={this.state.checkboxes} onChange={(event, symbol) => {
              var state = this.state
              state.checkboxes[symbol] = event.target.checked
              this.setState({ checkboxes: state.checkboxes })
            }}></ShapeLegend>
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





      <ThreeView ref={this.threeRef} onHover={this.onHover} onAggregate={this.onAggregate} />



      <div style={{ width: "18rem", height: '100%', position: 'absolute', left: '18rem', top: '0px', pointerEvents: 'none' }} class="flex-shrink-0">
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
