var d3 = require('d3')
import * as React from 'react'
import { connect } from 'react-redux'

const oneHotToCategorical = state => {

}

function aggregateCoral(vectors, aggregation, setProjectionColumns, projectionColumns) {
  var vector = null
  if (vectors.length != 1 && aggregation) {
    return "<h5>Not applicable</h5>"
  } else if (vectors.length != 1 && !aggregation) {
    vector = { }
    for (var y = 0; y < 9; y++) {
      for (var x = 0; x < 9; x++) {
        vector[`cf${y}${x}`] = ""
      }
    }
  } else {
    vector = vectors[0]
  }

  var container = d3.create('div')

  var table = container.append('table')

  for (var i=0; i < projectionColumns.length; i++) {
    var name = projectionColumns[i]['name']
    var checked = projectionColumns[i]['checked']
    if (checked) {
      table.append('tr')
        .append('td')
        .attr('class', 'coralCohort')
        .text(name+': '+parseFloat(vector[name]).toFixed(3))
    }
  }

  
  // var row = table.append('tr')
  // row.append('td')
  // .attr('class', 'coralCohort')
  // .text('Age: '+parseFloat(vector['Age']).toFixed(3))

  // var row = table.append('tr')
  // row.append('td')
  // .attr('class', 'coralCohort')
  // .text('BMI: '+parseFloat(vector['Body Mass Index (BMI)']).toFixed(3))

  // var row = table.append('tr')
  // row.append('td')
  // .attr('class', 'coralCohort')
  // .text('Dtd: '+parseFloat(vector['Days to death']).toFixed(3))

  // var row = table.append('tr')
  // row.append('td')
  // .attr('class', 'coralCohort')
  // .text('f: '+parseFloat(vector['Gender_female']).toFixed(3))

  // var row = table.append('tr')
  // row.append('td')
  // .attr('class', 'coralCohort')
  // .text('m: '+parseFloat(vector['Gender_male']).toFixed(3))

  var content = container.html()

  // var row = table.append('tr')
  // row.append('td')
  // .attr('class', 'coralCohort')
  // .text('Tumor Type Skin: '+parseFloat(vector['Tumor Type_skin']).toFixed(3))
  // var content = container.html()

  var svg = `<svg width="260" height="240" viewBox="0 0 260 240">
  <g font-size="16" style="text-anchor: left">
    <text x="10" y="10">Cohort Aggregate Data</text>
  </g>

  <foreignObject x="21" y="21" width="180" height="180" style="overflow: scroll">

  ${content}

  </foreignObject>

</svg>`




  return svg
}







// function coralLegend(color) {
// }

const mapStateToProps = state => {
  console.log('mapStateToProps called')
  return ({
  projectionColumns: state.projectionColumns
})}

const mapDispatchToProps = dispatch => ({
    setProjectionColumns: projectionColumns => {dispatch({
      type: 'SET_PROJECTION_COLUMNS',
      projectionColumns: projectionColumns
  })
  console.log('doing osmetihng in setProjectionColumns')
}})

export var CoralLegend = connect(mapStateToProps, mapDispatchToProps)(({ selection, aggregate, setProjectionColumns, projectionColumns }) => {
  return <div dangerouslySetInnerHTML={{ __html: aggregateCoral(selection, aggregate, setProjectionColumns, projectionColumns) }}></div>
})

// export var CoralLegend = ({ selection, aggregate }) => {
//     return <div dangerouslySetInnerHTML={{ __html: aggregateCoral(selection, aggregate) }}></div>
// }