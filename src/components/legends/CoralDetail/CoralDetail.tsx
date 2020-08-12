var d3 = require('d3')
import * as React from 'react'

function intToComponents(colorBeginner) {
    var compBeginner = {
      r: (colorBeginner & 0xff0000) >> 16,
      g: (colorBeginner & 0x00ff00) >> 8,
      b: (colorBeginner & 0x0000ff)
    };

    return compBeginner
}

var interpolator = d3.interpolateRgb("rgb(255, 255, 255)", "rgb(150,150,255)")
var max = 20;

function interpolate(value) {
  return interpolator(Math.min(1.0, value))
}

function aggregateCoral(vectors, aggregation) {
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

  container.append('g')
  var table = container.append('table')
  var row = table.append('tr')
  row.append('td')
  .attr('class', 'coralCohort')
  .text('Age: '+parseFloat(vector['Age']).toFixed(3))

  var row = table.append('tr')
  row.append('td')
  .attr('class', 'coralCohort')
  .text('BMI: '+parseFloat(vector['Body Mass Index (BMI)']).toFixed(3))

  var row = table.append('tr')
  row.append('td')
  .attr('class', 'coralCohort')
  .text('Dtd: '+parseFloat(vector['Days to death']).toFixed(3))

  var row = table.append('tr')
  row.append('td')
  .attr('class', 'coralCohort')
  .text('f: '+parseFloat(vector['Gender_female']).toFixed(3))

  var row = table.append('tr')
  row.append('td')
  .attr('class', 'coralCohort')
  .text('m: '+parseFloat(vector['Gender_male']).toFixed(3))

  /*var table = container.append('table')
  .attr("class", "neural")

  console.log('vectors:', vectors)
  console.log('agg:', aggregation)

  for (var y = 0; y < 9; y++) {
    var row = table.append('tr')
    for (var x = 0; x < 9; x++) {
      if (x != y) {
        row.append('td')
        .attr("class", "neuralcell")
        .style("background-color", interpolate(vector[`cf${y}${x}`] / max))
        .text(vector[`cf${y}${x}`])
      } else {
        row.append('td')
        .attr("class", "neuralcell")
        .style("background-color", "transparent")
      }
    }
  }*/

  var content = container.html()

  var svg = `<svg width="260" height="240" viewBox="0 0 260 240">
  <g font-size="16" style="text-anchor: left">
    <text x="10" y="10">Cohort Aggregate Data</text>
  </g>

  <foreignObject x="21" y="21" width="180" height="180">

  ${content}

  </foreignObject>

</svg>`




  return svg
}







// function coralLegend(color) {
// }




export var CoralLegend = ({ selection, aggregate }) => {
    return <div dangerouslySetInnerHTML={{ __html: aggregateCoral(selection, aggregate) }}></div>
}