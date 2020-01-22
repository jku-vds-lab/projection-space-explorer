import "regenerator-runtime/runtime";

var chess = require('./problems/chess')
var rubik = require('./problems/rubik')
var neural = require('./problems/neural')

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import { ShapeLegend, calculateOptions, Legend, LegendFun } from './view/categorical'
import { makeStyles } from '@material-ui/core/styles';
import { DatasetSelector, DatasetList } from './util/datasetselector'
import ThreeView from './view/view'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Slider from '@material-ui/core/Slider';
import { DefaultLineColorScheme, TableuVectorColorScheme, Scales, LinearColorScale, SchemeColor, ContinuosScale, DiscreteScale } from "./util/colors";
import { DefaultVectorColorScheme } from "./util/colors";
import { Input, Divider } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import MaskedInput from "react-text-mask";
import { StoryLegend } from "./legends/story";






window.showGuide = function () {
  if (document.getElementById("guide").style.display == "none") {
    document.getElementById("guide").style.display = "block"
  } else {
    document.getElementById("guide").style.display = "none"
  }

}





var ChooseFileDialog = ({ open, onChange }) => {
  return <Dialog open={open}>
    <DatasetList onChange={onChange}></DatasetList>
  </Dialog>
}


console.log(ChooseFileDialog)


class Application extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      selectionState: null,

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
      checkboxes: { 'star': true, 'cross': true, 'circle': true, 'square': true },

      selectedScaleIndex: 0,
      selectedScale: null,
      definedScales: null
    }

    this.threeRef = React.createRef()
    this.legend = React.createRef()
    this.setSelector = React.createRef()
    this.onHover = this.onHover.bind(this)
    this.onAggregate = this.onAggregate.bind(this)
    this.onLineSelect = this.onLineSelect.bind(this)
    this.onDataSelected = this.onDataSelected.bind(this)
    this.onColorScaleChanged = this.onColorScaleChanged.bind(this)
  }

  componentDidMount() {
    var url = new URL(window.location);
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

      this.setSelector.current.init(preselect)
    } else {

      this.setSelector.current.init(preselect)
    }

    window.addEventListener('resize', this.onResize.bind(this))
  }

  convertRemToPixels(rem) {
    return rem * parseFloat(getComputedStyle(document.documentElement).fontSize);
  }

  onResize() {
    this.threeRef.current.resize(window.innerWidth - this.convertRemToPixels(18 * 1), window.innerHeight)
  }


  setAggregateView(element, list, aggregation, type) {
    element.innerHTML = ""
    this.setState({ selectionState: null })

    if (type == "chess") {
      element.innerHTML = chess.aggregate(list)
    }
    if (type == "rubik") {
      element.innerHTML = rubik.aggregate(list)
    }
    if (type == "neural") {
      element.innerHTML = neural.aggregate(list, aggregation)
    }
    if (type == "none" && list.length > 0) {
      element.innerHTML = `<div>${list[0].legend}</div>`
    }
    if (type == 'story' && list.length > 0) {
      this.setState({ selectionState: list[0] })
    }
  }

  onHover(selected) {
    this.setAggregateView(document.getElementById('info'), selected, false, this.dataset.info.type)


  }

  onAggregate(selected) {
    this.setAggregateView(document.getElementById('aggregate'), selected, true, this.dataset.info.type)
  }


  loadData2() {
    this.setAggregateView(document.getElementById('info'), [], false, this.dataset.info.type)
    this.setAggregateView(document.getElementById('aggregate'), [], true, this.dataset.info.type)

    this.lineColorScheme = new DefaultLineColorScheme().createMapping([... new Set(this.vectors.map(vector => vector.algo))])

    this.vectorColorScheme = new DefaultVectorColorScheme().createMapping([... new Set(this.vectors.map(vector => vector.algo))])


    this.threeRef.current.createVisualization(this.dataset, this.lineColorScheme, this.vectorColorScheme)

    this.finite()
  }

  finite() {
    // Get categorical information about data set
    this.categoryOptions = calculateOptions(this.vectors, this.categories)
    console.log("hi")

    // Update shape legend
    this.setState({
      selectedVectorByShape: "",
      vectorByShape: null,
      vectorByTransparency: null,
      selectedVectorByTransparency: "",
      vectorBySize: null,
      vectorByColor: null,
      selectedVectorByColor: "",
      selectedVectorBySize: "",
      checkboxes: { 'star': true, 'cross': true, 'circle': true, 'square': true }
    })

    this.legend.current.load(this.dataset.info.type, this.lineColorScheme)

    this.initializeEncodings()
  }

  initializeEncodings() {
    var state = {}

    var defaultColorAttribute = this.categoryOptions.getAttribute("color", "algo", "categorical")
    if (defaultColorAttribute) {
      state.definedScales = this.defaultScalesForAttribute(defaultColorAttribute)
      state.selectedScaleIndex = 0
      state.selectedVectorByColor = defaultColorAttribute.key
      state.vectorByColor = defaultColorAttribute


      this.threeRef.current.particles.colorCat(defaultColorAttribute, state.definedScales[state.selectedScaleIndex])
    }

    var defaultBrightnessAttribute = this.categoryOptions.getAttribute("transparency", "age", "sequential")
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

  onDataSelected(dataset, json) {
    console.log("test")
    console.log(dataset)
    this.setState({ fileDialogOpen: false })

    // Dispose old view
    this.threeRef.current.disposeScene()

    // Set new dataset as variable
    this.dataset = dataset
    this.vectors = dataset.vectors
    this.segments = dataset.segments
    this.categories = json

    // Load new view
    this.loadData2()
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


  defaultScalesForAttribute(attribute) {
    if (attribute.type == 'categorical') {
      return [
        new DiscreteScale([
          new SchemeColor("#1b9e77"),
          new SchemeColor("#d95f02"),
          new SchemeColor("#7570b3"),
          new SchemeColor("#e7298a"),
          new SchemeColor("#66a61e"),
          new SchemeColor("#e6ab02"),
          new SchemeColor("#a6761d"),
          new SchemeColor("#666666")
        ]),
        new DiscreteScale([
          new SchemeColor("#a6cee3"),
          new SchemeColor("#1f78b4"),
          new SchemeColor("#b2df8a"),
          new SchemeColor("#33a02c"),
          new SchemeColor("#fb9a99"),
          new SchemeColor("#e31a1c"),
          new SchemeColor("#fdbf6f"),
          new SchemeColor("#ff7f00")
        ])
      ]
    } else {
      return [
        new ContinuosScale([
          new SchemeColor('#fdcc8a'),
          new SchemeColor('#b30000')
        ]),
        new ContinuosScale([
          new SchemeColor('#a6611a'),
          new SchemeColor('#f5f5f5'),
          new SchemeColor('#018571')
        ]),
        new ContinuosScale([
          new SchemeColor('#ca0020'),
          new SchemeColor('#f7f7f7'),
          new SchemeColor('#0571b0')
        ])

      ]
    }
  }

  render() {
    //
    //<ChooseFileDialog onChange={this.onDataSelected} open={this.state.fileDialogOpen}></ChooseFileDialog>
    return <div class="d-flex align-items-stretch" style={{ width: "100vw", height: "100vh" }}>
      <div class="flex-shrink-0" style={{ width: "18rem", 'overflow-y': 'auto' }}>
        <Grid
          container
          justify="center"
          alignItems="stretch"
          direction="column">

          <DatasetSelector ref={this.setSelector} onChange={this.onDataSelected} />

          <Divider style={{ padding: '0 4px' }} />
          <div>
            <Typography
              style={{ margin: '5px 0 0px 16px' }}
              variant="button"
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
            <Legend ref={this.legend} onLineSelect={this.onLineSelect}></Legend>
          </Grid>

          <Divider style={{ padding: '0 4px' }} />
          <div>
            <Typography
              style={{ margin: '0px 0 0px 16px' }}
              color="textPrimary"
              variant="button"
              display="block"
            >
              Points
        </Typography>
          </div>

          {
            this.categoryOptions != null && this.categoryOptions.hasCategory("shape") ?
              <Grid
                container
                justify="center"
                alignItems="stretch"
                direction="column"
                style={{ padding: '0 16px' }}>
                <FormControl>
                  <InputLabel shrink id="vectorByShapeSelectLabel">{"shape by"}</InputLabel>
                  <Select labelId="vectorByShapeSelectLabel"
                    id="vectorByShapeSelect"
                    displayEmpty

                    value={this.state.selectedVectorByShape}
                    onChange={(event) => {
                      var attribute = this.categoryOptions.getCategory("shape").attributes.filter(a => a.key == event.target.value)[0]

                      this.setState({
                        selectedVectorByShape: event.target.value,
                        vectorByShape: attribute
                      })

                      this.threeRef.current.particles.shapeCat(attribute)
                    }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {this.categoryOptions.getCategory("shape").attributes.map(attribute => {
                      return <MenuItem value={attribute.key}>{attribute.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>
              </Grid>

              :
              <div></div>
          }

          {
            this.categoryOptions != null && this.categoryOptions.hasCategory("transparency") ?
              <Grid
                container
                justify="center"
                alignItems="stretch"
                direction="column"
                style={{ padding: '0 16px' }}>
                <FormControl>
                  <InputLabel shrink id="vectorByTransparencySelectLabel">{"brightness by"}</InputLabel>
                  <Select labelId="vectorByTransparencySelectLabel"
                    id="vectorByTransparencySelect"
                    displayEmpty
                    value={this.state.selectedVectorByTransparency}
                    onChange={(event) => {
                      var attribute = this.categoryOptions.getCategory("transparency").attributes.filter(a => a.key == event.target.value)[0]

                      this.setState({
                        selectedVectorByTransparency: event.target.value,
                        vectorByTransparency: attribute
                      })

                      this.threeRef.current.particles.transparencyCat(attribute)
                    }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {this.categoryOptions.getCategory("transparency").attributes.map(attribute => {
                      return <MenuItem value={attribute.key}>{attribute.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>
              </Grid>
              :
              <div></div>
          }

          {
            this.categoryOptions != null && this.categoryOptions.hasCategory("size") ?
              <Grid
                container
                justify="center"
                alignItems="stretch"
                direction="column"
                style={{ padding: '0 16px' }}>
                <FormControl>
                  <InputLabel shrink id="vectorBySizeSelectLabel">{"size by"}</InputLabel>
                  <Select labelId="vectorBySizeSelectLabel"
                    id="vectorBySizeSelect"
                    displayEmpty
                    value={this.state.selectedVectorBySize}
                    onChange={(event) => {
                      var attribute = this.categoryOptions.getCategory("size").attributes.filter(a => a.key == event.target.value)[0]

                      this.setState({
                        selectedVectorBySize: event.target.value,
                        vectorBySize: attribute
                      })

                      this.threeRef.current.particles.sizeCat(attribute)
                    }}
                  >
                    <MenuItem value="">None</MenuItem>
                    {this.categoryOptions.getCategory("size").attributes.map(attribute => {
                      return <MenuItem value={attribute.key}>{attribute.name}</MenuItem>
                    })}
                  </Select>
                </FormControl>
              </Grid>
              :
              <div></div>
          }

          {
            this.categoryOptions != null && this.categoryOptions.hasCategory("color") ?
              <Grid
                container
                item
                alignItems="stretch"
                direction="column"
                style={{ padding: '0 16px' }}
              >

                <Grid container item alignItems="stretch" direction="column">
                  <FormControl>
                    <InputLabel shrink id="vectorByColorSelectLabel">{"color by"}</InputLabel>
                    <Select labelId="vectorByColorSelectLabel"
                      id="vectorByColorSelect"
                      displayEmpty
                      value={this.state.selectedVectorByColor}
                      onChange={(event) => {
                        var attribute = null
                        if (event.target.value != "") {
                          attribute = this.categoryOptions.getCategory("color").attributes.filter(a => a.key == event.target.value)[0]
                        }
                        var state = {
                          selectedVectorByColor: event.target.value,
                          vectorByColor: attribute,
                          definedScales: [],
                          selectedScaleIndex: 0
                        }

                        if (attribute != null && attribute.type == 'categorical') {
                          state.selectedScaleIndex = 0
                          state.definedScales = this.defaultScalesForAttribute(attribute)
                        } else if (attribute != null) {
                          state.selectedScaleIndex = 0
                          state.definedScales = this.defaultScalesForAttribute(attribute)
                        }
                        this.setState(state)
                        this.threeRef.current.particles.colorCat(attribute, attribute == null ? null : state.definedScales[state.selectedScaleIndex])

                      }}
                    >
                      <MenuItem value="">None</MenuItem>
                      {this.categoryOptions.getCategory("color").attributes.map(attribute => {
                        return <MenuItem value={attribute.key}>{attribute.name}</MenuItem>
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
              <Scales selectedScaleIndex={this.state.selectedScaleIndex} onChange={this.onColorScaleChanged} definedScales={this.state.definedScales}></Scales>
              : <div></div>}
          </Grid>

          <Divider></Divider>

          <Grid item style={{ padding: '0 16px' }}>
            <ShapeLegend category={this.state.vectorByShape} checkboxes={this.state.checkboxes} onChange={(event, symbol) => {
              var state = this.state
              state.checkboxes[symbol] = event.target.checked
              this.setState({ checkboxes: state.checkboxes })
              this.threeRef.current.filterPoints(state.checkboxes)
            }}></ShapeLegend>
          </Grid>
        </Grid>

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

              <StoryLegend selectionState={this.state.selectionState}></StoryLegend>
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

    </div >
  }
}




ReactDOM.render(<Application />, document.getElementById("test2"))
