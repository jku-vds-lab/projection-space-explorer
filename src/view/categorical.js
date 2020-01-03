
var chess = require('../problems/chess')
var rubik = require('../problems/rubik')
var neural = require('../problems/neural')
var util = require('../util/colors')
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';

export function calculateOptions(vectors, categories) {
  var set = {
  }

  // Map to better structure
  categories.forEach(category => {
    var distinct = undefined
    if (category.type == 'categorical') {
      // Generate distinct set from values
      distinct = [... new Set(vectors.map(value => value[category.vectorKey]))]

    }

    category.allowed.forEach(allowedValue => {

      if (!(allowedValue in set)) {
        set[allowedValue] = { attributes: [] }
      }

      set[allowedValue].attributes.push({
        key: category.vectorKey,
        name: category.name,
        type: category.type,
        category: category,
        distinct: distinct
      })
    })
  })
  return set
}



export class Legend extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.onCheckbox = this.onCheckbox.bind(this)
  }

  load(type, algorithms, colors) {
    var chessOpeners = ["Barnes Hut Opening", "Kings Pawn Opening", "English Opening"]
    var rubikNames = ["Beginner", "Fridrich"]
    this.type = type

    console.log(algorithms)
    var colors = []
    if (type == "rubik") {
      colors = Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'name': rubikNames[key], 'checked': true, 'algo': key } })
      //document.getElementById('legend').innerHTML = rubik.legend(algorithms[1].color, algorithms[0].color)
    } else if (type == "chess") {
      colors = Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'name': chessOpeners[key], 'algo': key, 'checked': true } })
      //document.getElementById('legend').innerHTML = chess.legend(Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'name': chessOpeners[key], 'algo': key } }))
    } else if (type == "neural") {
      colors = Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'learningRate': key, name: key, checked: true, algo: key } })
      //document.getElementById('legend').innerHTML = neural.legend(Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'learningRate': key } }))
    }

    this.setState({ algorithms: algorithms, colors: colors })
  }

  onCheckbox(event) {
    var newState = {
      algorithms: this.state.algorithms,
      colors: this.state.colors
    }
    var col = newState.colors.filter(c => c.color == event.target.id)[0]
    col.checked = event.target.checked

    this.setState(newState)

    this.props.onLineSelect(col.algo, event.target.checked)
  }

  render() {
    if (this.state.colors == undefined) return <div id="legend"></div>

    var colorLegend = null
    if (this.type == 'neural') {
      colorLegend = this.state.colors.map(color => {
        var comp = util.hexToRGB(color.color)
        return <div class="d-flex" style={{ width: "100%", height: "1rem" }}>
          <small class="small flex-shrink-0" style={{ width: '2.5rem' }}>{color.learningRate == "undefined" ? '-' : color.learningRate}</small>
          <div class="flex-grow-1" style={{ "background-image": `linear-gradient(to right, rgba(${comp.r}, ${comp.g}, ${comp.b}, 0.2), rgba(${comp.r}, ${comp.g}, ${comp.b},1))` }}></div>
        </div>
      })
    } else {
      colorLegend = this.state.colors.map(color => {
        var comp = util.hexToRGB(color.color)
        return <div style={{ width: "100%", height: "1rem", "background-image": `linear-gradient(to right, rgba(${comp.r}, ${comp.g}, ${comp.b}, 0.2), rgba(${comp.r}, ${comp.g}, ${comp.b},1))` }}>
        </div>
      })
    }

    return <div id="legend" style={{ width: "100%" }}>
      {this.state.colors.map(color => {

        var comp = util.hexToRGB(color.color)
        return <div class="custom-control custom-checkbox">
          <input type="checkbox" checked={color.checked} class="custom-control-input" id={color.color} onClick={this.onCheckbox}></input>
          <label style={{ color: `rgb(${comp.r}, ${comp.g}, ${comp.b})` }} class="custom-control-label" for={color.color} >{color.name}</label>
        </div>
      })}

      <hr />

      {colorLegend}


      <div class="d-flex justify-content-between">
        <div>
          early
      </div>
        <div>
          late
      </div>
      </div>
    </div>
  }
}



/**
 * Simple shape legend
 */
export class ShapeLegend extends React.Component {
  constructor(props) {
    super(props)

    this.state = { category: null }
  }

  setSelection(selection, options) {
    var category = options["shape"].attributes.filter(a => a.key == selection.shape)[0]

    this.setState(category)
  }

  render() {
    if (this.state.category == null) return <div></div>

    var paths = {
      "star": "./textures/sprites/star.png",
      "circle": "./textures/sprites/circle.png",
      "square": "./textures/sprites/square.png",
      "cross": "./textures/sprites/cross.png"
    }

    this.state.category.values.map(a => { console.log("value"); return 0 })

    return <div>
      {
        this.state.category.values.map(v => {
          return <div>
            <img src={paths[v.shapeType]} style={{ "width": "1rem", "height": "1rem", "vertical-align": "middle" }}></img>
            <span style={{ "vertical-align": "middle", "margin-left": "0.5rem" }}>{v.display}</span><br />
          </div>
        })
      }
    </div>
  }
}

export class CategorySelection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      options: {},
      selection: {
        "color": "",
        "transparency": "",
        "shape": "",
        "size": ""
      }
    }
  }

  setData(vectors, options) {

    this.vectors = vectors
    this.setState({
      options: options
    })
    console.log(this.state)
  }

  render() {
    return <Grid
      container
      justify="center"
      alignItems="stretch"
      direction="column">
      {Object.keys(this.state.options).map(key => {
        const handler = event => {
          var state = this.state
          state.selection[key] = event.target.value
          this.setState(state)
          if (event.target.value != "")
            this.props.onChange(key, this.state.options[key].attributes.filter(a => a.key == event.target.value)[0].category)
        }

        return <FormControl>
          <InputLabel id={'labeli' + key}>{'by ' + key}</InputLabel>
          <Select labelId={'labeli' + key}
            id={key}
            value={this.state.selection[key]}
            onChange={handler}
          >
            <MenuItem value="">None</MenuItem>
            {this.state.options[key].attributes.map(attribute => {
              return <MenuItem value={attribute.key}>{attribute.name}</MenuItem>
            })}
          </Select>
        </FormControl>
      })}
    </Grid>
  }
}

