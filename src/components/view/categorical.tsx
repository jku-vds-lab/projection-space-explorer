

import * as React from 'react'
import Typography from '@material-ui/core/Typography';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Checkbox from '@material-ui/core/Checkbox';
import { DiscreteMapping } from '../util/colors';
import { connect } from 'react-redux'
import { setAdvancedColoringSelectionAction } from '../Actions/Actions';
import advancedColoringSelection from '../Reducers/AdvancedColoringSelection';





class CategoryOptions {
  vectors: any
  json: any

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

const mapStateToProps = state => ({
  advancedColoringSelection: state.advancedColoringSelection
})


const mapDispatchToProps = dispatch => ({
  setAdvancedColoringSelection: advancedColoringSelection => dispatch(setAdvancedColoringSelectionAction(advancedColoringSelection))
})

type ShowColorLegendProps = {
  mapping: any
  advancedColoringSelection: boolean[]
  setAdvancedColoringSelection: Function
}

export var ShowColorLegend = connect(mapStateToProps, mapDispatchToProps)(({ mapping, advancedColoringSelection, setAdvancedColoringSelection }: ShowColorLegendProps) => {
  if (mapping == undefined || mapping == null) {
    return <div></div>
  }

  if (mapping instanceof DiscreteMapping) {
    return <Grid container direction="column" style={{ padding: '12px 0px', minWidth: 300 }}>


      {mapping.values.map((value, index) => {
        var color = mapping.map(value)
        return <FormControlLabel key={index} style={{ margin: '0 8px' }}
          control={<Checkbox style={{ padding: '3px 9px' }} disableRipple
            color="primary" size='small' checked={advancedColoringSelection[index]} onChange={(event) => {
              var values = advancedColoringSelection.splice(0)
              values[event.target.value] = event.target.checked
              setAdvancedColoringSelection(values)
            }} value={index}></Checkbox>}
          label={<Typography style={{ color: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})` }}>{value}</Typography>}
        ></FormControlLabel>
      })}</Grid>
  }

  return <div></div>
})