

import * as React from 'react'
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import { DiscreteMapping } from '../util/colors';






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
    return <Grid container direction="column" style={{ padding: '12px 0px', minWidth: 300 }}>


      {mapping.values.map((value, index) => {
        var color = mapping.map(value)
        return <FormControlLabel style={{ margin: '0 8px' }}
          control={<Checkbox style={{ padding: '3px 9px' }} disableRipple
            color="primary" size='small' checked={colorsChecked[index]} onChange={onChange} id={index}></Checkbox>}
          label={<Typography style={{ color: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})` }}>{value}</Typography>}
        ></FormControlLabel>
      })}</Grid>
  }

  return <div></div>
}