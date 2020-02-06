import "regenerator-runtime/runtime";

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { ShapeLegend, calculateOptions, Legend, LegendFun, ShowColorLegend } from './view/categorical'
import { DatasetList } from './util/datasetselector'
import ThreeView from './view/view'
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Grid from '@material-ui/core/Grid';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { DefaultLineColorScheme, TableuVectorColorScheme, ColorScaleSelect, defaultScalesForAttribute, ContinuosScale, DiscreteScale, DiscreteMapping, ContinuousMapping } from "./util/colors";
import { Divider, Card, CardContent, Checkbox } from "@material-ui/core";
import Dialog from '@material-ui/core/Dialog';
import { StoryLegend } from "./legends/story";
import { loadFromPath } from './util/datasetselector'
import { RubikLegend } from "./legends/rubik";
import { NeuralLegend } from "./legends/neural";
import { ChessLegend } from "./legends/chess";
import Popover from '@material-ui/core/Popover';
import { LineSelectionPopover, LineSelectionTree } from './view/lineselectiontree'
import Box from '@material-ui/core/Box';








var GenericLegend = ({ type, vectors, aggregate, dataset }) => {
  if (type == 'story') {
    return <StoryLegend selection={vectors} vectors={dataset}></StoryLegend>
  } else if (type == 'rubik') {
    return <RubikLegend selection={vectors}></RubikLegend>
  } else if (type == 'neural') {
    return <NeuralLegend selection={vectors} aggregate={aggregate}></NeuralLegend>
  } else if (type == 'chess') {
    return <ChessLegend selection={vectors}></ChessLegend>
  } else {
    return <div></div>
  }
}


window.showGuide = function () {
  if (document.getElementById("guide").style.display == "none") {
    document.getElementById("guide").style.display = "block"
  } else {
    document.getElementById("guide").style.display = "none"
  }
}





var ChooseFileDialog = ({ onChange }) => {
  const [open, setOpen] = React.useState(false)

  return <Grid
    container
    justify="center"
    alignItems="stretch"
    direction="column"
    style={{ padding: '8px 16px' }}>
    <Button variant="contained" onClick={(event) => {
      setOpen(true)
    }}>Load Dataset</Button>
    <Dialog open={open} onClose={() => { setOpen(false) }}>
      <DatasetList onChange={(dataset, json) => {
        setOpen(false)
        onChange(dataset, json)
      }}></DatasetList>
    </Dialog>
  </Grid>
}



class Application extends React.Component {

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
      checkboxes: { 'star': true, 'cross': true, 'circle': true, 'square': true },

      selectedScaleIndex: 0,
      selectedScale: null,
      definedScales: null,

      datasetType: 'none',

      colorsChecked: [true, true, true, true, true, true, true, true, true],

      selectedLines: {}
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

      loadFromPath(preselect, this.onDataSelected)
      //this.setSelector.current.init(preselect)
    } else {
      loadFromPath(preselect, (dataset, json) => { this.onDataSelected(dataset, json) })
      //this.setSelector.current.init(preselect)
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
      vectors: this.vectors
    })

    // Load new view
    this.loadData2()
  }


  loadData2() {
    this.setAggregateView(document.getElementById('info'), [], false, this.dataset.info.type)
    this.setAggregateView(document.getElementById('aggregate'), [], true, this.dataset.info.type)

    this.lineColorScheme = new DefaultLineColorScheme().createMapping([... new Set(this.vectors.map(vector => vector.algo))])

    console.log(this.lineColorScheme.map('beginner'))

    this.setState({
      lineColorScheme: this.lineColorScheme
    })

    this.threeRef.current.createVisualization(this.dataset, this.lineColorScheme, null)

    this.finite()
  }

  finite() {
    // Get categorical information about data set
    this.categoryOptions = calculateOptions(this.vectors, this.categories)

    var algos = LineSelectionTree.genAlgos(this.vectors)
    var selLines = LineSelectionTree.getChecks(algos)

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
      checkboxes: { 'star': true, 'cross': true, 'circle': true, 'square': true },
      selectedLines: selLines,
      selectedLineAlgos: algos
    })

    this.legend.current.load(this.dataset.info.type, this.lineColorScheme)

    this.initializeEncodings()
  }

  mappingFromScale(scale, attribute) {
    if (scale instanceof DiscreteScale) {
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

    var defaultColorAttribute = this.categoryOptions.getAttribute("color", "algo", "categorical")
    if (defaultColorAttribute) {
      state.definedScales = defaultScalesForAttribute(defaultColorAttribute)
      state.selectedScaleIndex = 0
      state.selectedVectorByColor = defaultColorAttribute.key
      state.vectorByColor = defaultColorAttribute



      this.threeRef.current.particles.colorCat(defaultColorAttribute, this.mappingFromScale(state.definedScales[state.selectedScaleIndex], defaultColorAttribute))
      state.showColorMapping = this.threeRef.current.particles.getMapping()
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
      selectedScaleIndex: index,
      colorsChecked: [true, true, true, true, true, true, true, true]
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
      attribute = this.categoryOptions.getCategory("color").attributes.filter(a => a.key == event.target.value)[0]
    }
    var state = {
      selectedVectorByColor: event.target.value,
      vectorByColor: attribute,
      definedScales: [],
      selectedScaleIndex: 0,
      colorsChecked: [true, true, true, true, true, true, true, true]
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





  render() {
    return <div class="d-flex align-items-stretch" style={{ width: "100vw", height: "100vh" }}>
      <div class="flex-shrink-0" style={{ width: "18rem", 'overflow-y': 'auto', 'overflow-x': 'hidden' }}>


        <Grid
          container
          justify="center"
          alignItems="stretch"
          direction="column">



          <Grid item>
            <ChooseFileDialog ref={this.setSelector} onChange={this.onDataSelected}></ChooseFileDialog>
          </Grid>

          <Divider style={{ margin: '8px 0px' }} />
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
            <Legend ref={this.legend} onLineSelect={this.onLineSelect}></Legend>

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
            this.categoryOptions != null && this.categoryOptions.hasCategory("shape") ?
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
                      var attribute = this.categoryOptions.getCategory("shape").attributes.filter(a => a.key == event.target.value)[0]

                      this.setState({
                        selectedVectorByShape: event.target.value,
                        vectorByShape: attribute,
                        checkboxes: { 'star': true, 'cross': true, 'circle': true, 'square': true }
                      })

                      this.threeRef.current.filterPoints({ 'star': true, 'cross': true, 'circle': true, 'square': true })
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

          <Grid item style={{ padding: '0 16px' }}>
            <ShapeLegend category={this.state.vectorByShape} checkboxes={this.state.checkboxes} onChange={(event, symbol) => {
              var state = this.state
              state.checkboxes[symbol] = event.target.checked
              this.setState({ checkboxes: state.checkboxes })
              this.threeRef.current.filterPoints(state.checkboxes)
            }}></ShapeLegend>
          </Grid>

          {
            this.categoryOptions != null && this.categoryOptions.hasCategory("transparency") ?
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
                <FormControl style={{ margin: '4px 0px' }}>
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
                  <FormControl style={{ margin: '4px 0px' }}>
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
                          selectedScaleIndex: 0,
                          colorsChecked: [true, true, true, true, true, true, true, true]
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


        </Grid>

      </div>





      <ThreeView ref={this.threeRef} onHover={this.onHover} onAggregate={this.onAggregate} selectionState={this.state.selectionState} />




      <div style={{ width: "18rem", height: '100%', position: 'absolute', left: '18rem', top: '0px', pointerEvents: 'none' }} class="flex-shrink-0">
        <div class="d-flex align-items-center justify-content-center" style={{ height: "50%" }}>

          <Card style={{ pointerEvents: 'auto' }}>
            <CardContent style={{ padding: '8px' }}>
              <Typography align="center" gutterBottom variant="body1">Hover State</Typography>
              <GenericLegend aggregate={false} type={this.state.datasetType} vectors={this.state.selectionState} dataset={this.state.vectors}></GenericLegend>

            </CardContent>
          </Card>

        </div>
        <div class="d-flex align-items-center justify-content-center" style={{ height: "50%" }}>
          <Card style={{ pointerEvents: 'auto' }}>
            <CardContent style={{ padding: '8px' }}>
              <Typography align="center" gutterBottom variant="body1">{`Aggregation (${this.state.selectionAggregation.length})`}</Typography>

              <GenericLegend aggregate={true} type={this.state.datasetType} vectors={this.state.selectionAggregation} dataset={this.state.vectors}></GenericLegend>
            </CardContent>
          </Card>
        </div>
      </div>


    </div >
  }
}







var SimplePopover = ({ showColorMapping, colorsChecked, onChange }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  return <div>
    <Button style={{ margin: '0px 16px' }} aria-describedby={id} variant="contained" color="primary" onClick={handleClick}>
      Advanced Coloring
      </Button>
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
    >



      <ShowColorLegend
        mapping={showColorMapping}
        colorsChecked={colorsChecked}
        onChange={onChange}></ShowColorLegend>

    </Popover>
  </div>
}




ReactDOM.render(<Application />, document.getElementById("test2"))
