var d3 = require('d3')
import * as React from 'react'
import { connect } from 'react-redux'

const calculateVariancePercentage = (data) => {
  const total= data.reduce(function(a,b){
    return a+b
  });
  const mean=total/data.length
  function var_numerator(value){
    return ((value-mean)*(value-mean));
  }
  var variance=data.map(var_numerator);
  variance=variance.reduce(function(a,b){
    return (a+b);
  });
  variance = variance/data.length;
  // variance relative to mean
  return variance / (mean + 1e-9)
}

const calculateMean = (data) => {
  const meanValue = data.reduce((sum, element) => sum + element, 0) / data.length;
  return meanValue;
}

function aggregateCoral(vectors, aggregation, setProjectionColumns, projectionColumns) {
  var vector = null
  var container = d3.create('div')
  if (vectors.length > 1 && aggregation) {

    // create list of only the features that were checked for projection
    const checkedFeatures = []
    for (const entry of projectionColumns.entries()) {
      // entry[0] .. idx, entry[1] ... {name: , checked}
      if (entry[1]['checked']) {
        checkedFeatures.push(entry[1]['name'])
      }  
    }
    
    // turn this array of maps for each sample into map of arrays
    // i.e. mapOfArrays['brain cancer'] = [0, 1, 1, 1, 0, 0]
    const mapOfArrays = {}
    for (var i = 0; i < checkedFeatures.length; i++) {
      mapOfArrays[checkedFeatures[i]] = vectors.map(sample => +sample[checkedFeatures[i]])
    }

    const meanDict = {}
    for (var i = 0; i < checkedFeatures.length; i++) {
      meanDict[checkedFeatures[i]] = calculateMean(mapOfArrays[checkedFeatures[i]])
    }

    // create dictionary for featureName: variance
    const varDict = {}
    for (var i = 0; i < checkedFeatures.length; i++) {
      varDict[checkedFeatures[i]] = calculateVariancePercentage(mapOfArrays[checkedFeatures[i]])
    }

    // sorting this dictionary by variance

    // Create items array
    var items = Object.keys(varDict).map(function(key) {
      return [key, meanDict[key], varDict[key]];
    });

    // Sort the array based on the third element, i.e., variance
    items.sort(function(first, second) {
      return first[2] - second[2]
    });

    var table = container.append('table')
  
    // create html table for variance sorted features aggregates
    for (var key in items) {
      table.append('tr')
        .append('td')
        .attr('class', 'coralCohort')
        .text(items[key][0])

      table.append('tr')
      .append('td')
      .attr('class', 'coralCohort')
      .text('mean:' + parseFloat(items[key][1]).toFixed(3) + ', var:' + parseFloat(items[key][2]).toFixed(3))
    
    }

  }
  else if (vectors.length != 1 && aggregation) {
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
  }

  var content = container.html()

  var svg = `<svg width="300" height="440" viewBox="0 0 300 440">

  <foreignObject x="21" y="21" width="300" height="400" style="overflow: scroll">

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