
var chess = require('../problems/chess')
var rubik = require('../problems/rubik')
var neural = require('../problems/neural')
var util = require('../util/colors')
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';

export function calculateOptions(vectors, categories) {
  var set = {
  }

  categories.forEach(category => {
    category.attributes.forEach(attribute => {
      var distinct = undefined
      if (attribute.type == 'categorical') {
        attribute.distinct = [... new Set(vectors.map(value => value[attribute.key]))]
      }

    })
  })

  console.log(categories)

  return categories

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
  console.log(set)
  return set
}


export var LegendFun = ({ algorithms, onChange, type }) => {
  var colors = []
  var chessOpeners = ["Barnes Hut Opening", "Kings Pawn Opening", "English Opening"]
  var rubikNames = ["Beginner", "Fridrich"]

  var colors = []
  if (type == "rubik") {
    colors = Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'name': rubikNames[key], 'checked': true, 'algo': key } })
  } else if (type == "chess") {
    colors = Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'name': chessOpeners[key], 'algo': key, 'checked': true } })
  } else if (type == "neural") {
    colors = Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'learningRate': key, name: key, checked: true, algo: key } })
  }

  if (colors == undefined) return <div id="legend"></div>

  var colorLegend = null
  if (type == 'neural') {
    colorLegend = colors.map(color => {
      var comp = util.hexToRGB(color.color)
      return <div class="d-flex" style={{ width: "100%", height: "1rem" }}>
        <small class="small flex-shrink-0" style={{ width: '2.5rem' }}>{color.learningRate == "undefined" ? '-' : color.learningRate}</small>
        <div class="flex-grow-1" style={{ "background-image": `linear-gradient(to right, rgba(${comp.r}, ${comp.g}, ${comp.b}, 0.2), rgba(${comp.r}, ${comp.g}, ${comp.b},1))` }}></div>
      </div>
    })
  } else {
    colorLegend = colors.map(color => {
      var comp = util.hexToRGB(color.color)
      return <div style={{ width: "100%", height: "1rem", "background-image": `linear-gradient(to right, rgba(${comp.r}, ${comp.g}, ${comp.b}, 0.2), rgba(${comp.r}, ${comp.g}, ${comp.b},1))` }}>
      </div>
    })
  }

  return <div id="legend" style={{ width: "100%" }}>
    {colors.map(color => {

      var comp = util.hexToRGB(color.color)

      return <FormControlLabel
        control={<Checkbox size='small' checked={color.checked} onChange={onChange} id={color.color}></Checkbox>}
        label={<Typography style={{ color: `rgb(${comp.r}, ${comp.g}, ${comp.b})` }}>{color.name}</Typography>}
      ></FormControlLabel>
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

export var Checky = ({ checked, onChange, id, name, comp }) => {


  return <FormControlLabel
    style={{ margin: '0px', padding: '0px' }}
    control={<Checkbox size='small' checked={checked} onChange={onChange} id={id}></Checkbox>}
    label={<Typography style={{ color: `rgb(${comp.r}, ${comp.g}, ${comp.b})` }}>{name}</Typography>}
  ></FormControlLabel>
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

    var colors = []
    if (type == "rubik") {
      colors = Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'name': rubikNames[key], 'checked': true, 'algo': key } })
    } else if (type == "chess") {
      colors = Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'name': chessOpeners[key], 'algo': key, 'checked': true } })
    } else if (type == "neural") {
      colors = Object.keys(algorithms).sort().map(function (key, index) { return { 'color': algorithms[key].color, 'learningRate': key, name: key, checked: true, algo: key } })
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

        return <Checky
          checked={color.checked} onChange={this.onCheckbox} id={color.color} comp={comp} name={color.name}
        ></Checky>

        return <FormControlLabel

          control={<Checkbox size='small' checked={color.checked} onChange={this.onCheckbox} id={color.color}></Checkbox>}
          label={<Typography style={{ color: `rgb(${comp.r}, ${comp.g}, ${comp.b})` }}>{color.name}</Typography>}
        ></FormControlLabel>

        return <div class="custom-control custom-checkbox">
          <input type="checkbox" checked={color.checked} class="custom-control-input" id={color.color} onClick={this.onCheckbox}></input>
          <label style={{ color: `rgb(${comp.r}, ${comp.g}, ${comp.b})` }} class="custom-control-label" for={color.color} >{color.name}</label>
        </div>
      })}

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

export var Blub = ({ bla }) => {
  return <div>{bla}</div>
}


const ShapeSymbol = ({ symbol, text, checked, onCheck }) => {
  var paths = {
    "star": "./textures/sprites/star.png",
    "circle": "./textures/sprites/circle.png",
    "square": "./textures/sprites/square.png",
    "cross": "./textures/sprites/cross.png"
  }

  return <div>
    <img src={paths[symbol]} style={{ "width": "1rem", "height": "1rem", "vertical-align": "middle" }}></img>
    <span style={{ "vertical-align": "middle", "margin-left": "0.5rem" }}>{text}</span>
    <Checkbox size='small' checked={checked} onChange={(event) => { onCheck(event, symbol) }}></Checkbox>
  </div>
}

/**
 * Simple shape legend
 * put a category in props
 */
export var ShapeLegend = ({ category, checkboxes, onChange }) => {
  var defaults = [{ symbol: 'cross', text: 'First State' }, { symbol: 'circle', text: 'Intermediate State' }, { symbol: 'star', text: 'Last State' }]

  if (category == null) {
    return <div>
      {defaults.map(def => {
        return <ShapeSymbol symbol={def.symbol} text={def.text} checked={checkboxes[def.symbol]} onCheck={onChange}></ShapeSymbol>
      })}
    </div>
  }

  return <div>
    {
      category.values.map(v => {
        return <ShapeSymbol symbol={v.shapeType} text={v.display} checked={checkboxes[v.shapeType]} onCheck={onChange}></ShapeSymbol>
      })
    }
  </div>
}

export class CategorySelection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      options: [],
      selection: {
        "color": "",
        "transparency": "",
        "shape": "",
        "size": ""
      }
    }
  }

  setData(vectors, options, selection) {
    this.vectors = vectors
    this.setState({
      options: options,
      selection: selection
    })
  }

  render() {
    return <Grid
      container
      justify="center"
      alignItems="stretch"
      direction="column">



      {this.state.options.map(option => {
        const handler = event => {
          var state = this.state
          state.selection[option.category] = event.target.value
          this.setState(state)
          if (event.target.value != "") {
            this.props.onChange(option.category, option.attributes.filter(attribute => attribute.key == event.target.value)[0])
          } else {
            this.props.onChange(option.category, null)
          }
        }

        return <FormControl>
          <InputLabel id={'labeli' + option.category}>{'by ' + option.category}</InputLabel>
          <Select labelId={'labeli' + option.category}
            id={option.category}
            value={this.state.selection[option.category]}
            onChange={handler}
          >
            <MenuItem value="">None</MenuItem>
            {option.attributes.map(attribute => {
              return <MenuItem value={attribute.key}>{attribute.name}</MenuItem>
            })}
          </Select>
        </FormControl>
      })}
    </Grid>
  }
}
