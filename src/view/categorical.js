

var util = require('../util/colors')
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { DiscreteMapping } from '../util/colors';



const useStyles = makeStyles({
  root: {
    '&:hover': {
      backgroundColor: 'transparent',
    },
    padding: '3px 9px'
  },
  icon: {
    borderRadius: 3,
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage:
        "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath" +
        " fill-rule='evenodd' clip-rule='evenodd' d='M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 " +
        "1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z' fill='%23fff'/%3E%3C/svg%3E\")",
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
});



class CategoryOptions {
  constructor(vectors, json) {
    this.vectors = vectors
    this.json = json

    if (this.json == null || this.json == "") {
      this.infer()
    } else if (this.vectors != null && this.vectors.length > 0) {
      this.init()
    }
  }

  isCategorical(key) {
    var values = this.vectors.map(vector => vector[key])
    var distinct = [... new Set(values)]

    if (distinct.length < 10) {
      return true
    } else {
      return false
    }
  }

  // Automatically infer categories from this file
  infer() {
    this.json = []

    var header = Object.keys(this.vectors[0]).filter(key => key != 'x' && key != 'y' && key != 'line')
    header.forEach(key => {
      if (this.isCategorical(key)) {

      }
    })
  }

  init() {
    this.json.forEach(category => {
      category.attributes.forEach(attribute => {
        if (attribute.type == 'categorical') {
          attribute.distinct = [... new Set(this.vectors.map(value => value[attribute.key]))]
        }
      })
    })
  }

  hasCategory(catName) {
    if (this.json == null) return false
    return this.json.filter(a => a.category == catName).length > 0
  }

  getCategory(catName) {
    if (this.json == null) return null
    return this.json.filter(a => a.category == catName)[0]
  }

  asArray() {
    return this.json
  }

  getAttribute(category, attribute, type) {
    try {
      return this.json.find(c => c.category == category)
        .attributes.find(a => a.key == attribute && a.type == type)
    } catch (e) {
      return null
    }
  }
}

export function calculateOptions(vectors, categories) {
  return new CategoryOptions(vectors, categories)
}


export var Checky = ({ checked, onChange, id, name, comp }) => {
  const classes = useStyles();


  return <FormControlLabel

    style={{ margin: '0px', padding: '0px', userSelect: 'none' }}

    control={<Checkbox
      className={classes.root}
      style={{ padding: '3px 9px' }}
      color="#ff0000"
      disableRipple
      checked={checked} onChange={onChange} id={id}></Checkbox>}
    label={<Typography style={{ color: `rgb(${comp.r}, ${comp.g}, ${comp.b})` }}>{name}</Typography>}
  ></FormControlLabel>
}

export class Legend extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
    this.onCheckbox = this.onCheckbox.bind(this)
  }

  load(type, lineColorScheme, algorithms) {

    this.lineColorScheme = lineColorScheme
    this.type = type


    var lineChecks = algorithms.map(entry => {
      return {
        color: this.lineColorScheme.map(entry.algo),
        name: entry.algo,
        checked: true,
        algo: entry.algo
      }
    })

    this.setState({ lineChecks: lineChecks })
  }

  onCheckbox(event) {
    var newState = {
      lineChecks: this.state.lineChecks
    }
    var col = newState.lineChecks.filter(c => c.algo == event.target.id)[0]
    col.checked = event.target.checked

    this.setState(newState)

    this.props.onLineSelect(col.algo, event.target.checked)
  }

  render() {
    if (this.state.lineChecks == undefined) return <div id="legend"></div>

    var colorLegend = null
    if (this.type == 'neural') {
      colorLegend = this.state.lineChecks.map(line => {
        var comp = line.color.rgb
        return <div class="d-flex" style={{ width: "100%", height: "1rem" }}>
          <small class="small flex-shrink-0" style={{ width: '2.5rem' }}>{line.name == "undefined" ? '-' : line.name}</small>
          <div class="flex-grow-1" style={{ "background-image": `linear-gradient(to right, rgba(${comp.r}, ${comp.g}, ${comp.b}, 0.2), rgba(${comp.r}, ${comp.g}, ${comp.b},1))` }}></div>
        </div>
      })
    } else {
      colorLegend = this.state.lineChecks.map(line => {
        var comp = line.color.rgb
        return <div style={{ width: "100%", height: "1rem", "background-image": `linear-gradient(to right, rgba(${comp.r}, ${comp.g}, ${comp.b}, 0.2), rgba(${comp.r}, ${comp.g}, ${comp.b},1))` }}>
        </div>
      })
    }

    /**
     *       {colorLegend}
    
    
          <div class="d-flex justify-content-between">
            <div>
              early
          </div>
            <div>
              late
          </div>
          </div>
     */

    return <div id="legend" style={{ width: "100%" }}>
      {this.state.lineChecks.map(line => {

        var comp = line.color.rgb

        return <Checky

          checked={line.checked} onChange={this.onCheckbox} id={line.algo} comp={comp} name={line.name}
        ></Checky>
      })}


    </div>
  }
}





const ShapeSymbol = ({ symbol, text, checked, onCheck }) => {
  const classes = useStyles();

  var paths = {
    "star": "./textures/sprites/star.png",
    "circle": "./textures/sprites/circle.png",
    "square": "./textures/sprites/square.png",
    "cross": "./textures/sprites/cross.png"
  }

  return <div>
    <Checkbox
      className={classes.root}
      checked={checked}
      onChange={(event) => { onCheck(event, symbol) }}
      disableRipple
      color="#ff0000"
      inputProps={{ 'aria-label': 'decorative checkbox' }}></Checkbox>
    <img src={paths[symbol]} style={{ "width": "1rem", "height": "1rem", "vertical-align": "middle" }}></img>
    <span style={{ "vertical-align": "middle", "margin-left": "0.5rem" }}>{text}</span>

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
        return <ShapeSymbol symbol={v.to} text={"display" in v ? v.display : v.from} checked={checkboxes[v.to]} onCheck={onChange}></ShapeSymbol>
      })
    }
  </div>
}

export class CategorySelection extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      options: null,
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
    if (this.state.options == null) return <div></div>

    return <Grid
      container
      justify="center"
      alignItems="stretch"
      direction="column">



      {this.state.options.asArray().map(option => {
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







export var ShowColorLegend = ({ mapping, colorsChecked, onChange }) => {
  if (mapping == undefined || mapping == null) {
    return <div></div>
  }

  if (mapping instanceof DiscreteMapping) {
    return <Grid container direction="column" style={{ padding: '12px 0px' }}>


      {mapping.values.map((value, index) => {
        var color = mapping.map(value)
        return <FormControlLabel style={{ margin: '0 8px' }}
          control={<Checkbox style={{ padding: '3px 9px' }} disableRipple
            color="#ff0000" size='small' checked={colorsChecked[index]} onChange={onChange} id={index}></Checkbox>}
          label={<Typography style={{ color: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})` }}>{value}</Typography>}
        ></FormControlLabel>
      })}</Grid>
  }

  return <div></div>
}