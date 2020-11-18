var d3 = require('d3')
import * as React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Handler } from 'vega-tooltip';
import { makeStyles } from '@material-ui/core/styles';
import './Sudoku.scss';
import { FeatureType, Vect, Dataset, DatasetType } from "../../../components/util/datasetselector"

const useStyles = makeStyles({
  table: {
    maxWidth: 288,
  },
});

function createData(feature, category, score, char) {
  return {feature, category, score, char}
}

function mapHistData(data, feature) {
  const mapped = data.map((d) => {
    return {
      feature: +d[feature]
    }
  })
  return {"values": mapped}
}

function mapBarChartData(data, feature) {
  const counts = {}
  for (var i=0; i<data.length; i++) {
    if (data[i][feature] in counts) {
      counts[data[i][feature]] += 1
    } else {
      counts[data[i][feature]] = 1
    }
  }

  const sortCountDesc = (a,b) => {
    return b['count'] - a['count']
  }

  const barChartData = []
  for (var key in counts) {
    barChartData.push({'category': key, 'count': counts[key]/data.length})
  }
  barChartData.sort(sortCountDesc)
  return {'values': barChartData}
}

const getSTD = (data) => {
  const total = data.reduce(function (a, b) {
    return a + b
  });
  const mean = total / data.length
  function var_numerator(value) {
    return ((value - mean) * (value - mean));
  }
  var variance = data.map(var_numerator);
  variance = variance.reduce(function (a, b) {
    return (a + b);
  });
  variance = variance / data.length;
  const std = Math.sqrt(variance)
  return std
}

function dictionary(list) {
  var map = {}
  for (var i = 0; i < list.length; ++i) {
    for (var key in list[i]) {
      if (key in map) {
        map[key].push(list[i][key])
      } else {
        map[key] = [list[i][key]]
      }
    }
  }
  return map
}

function getMaxMean(data) {
  var max = Number.NEGATIVE_INFINITY
  data = data['values']
  for (var i = 0; i < data.length; i++) {
    if (data[i]['count'] > max) {
      max = data[i]['count']
    }
  }
  return max
}

function sortByScore(a, b) {
  if (a['score'] === b['score']) {
      return 0;
  }
  else {
      return (a['score'] < b['score']) ? 1 : -1;
  }
}

function getExplainingFeatures(data) {
  // data format [{'category': x, 'count': y}, ...]
  // data should be sorted descendingly
  const n = data.length
  const features = []
  for (var i = 0; i < n; i++) {
    if (data[i]['count'] >= (1/n)) { 
      features.push(data[i]['category'])
    } else {
      return features
    }
  }
  return features
}

function getProjectionColumns(projectionColumns) {
  if (projectionColumns === null) {
    return []
  }
  const pcol = []
  for (var i = 0; i <= projectionColumns.length; i++) {
    if (projectionColumns[i] !== undefined && projectionColumns[i]['checked']) {
      pcol.push(projectionColumns[i]['name'])
    }
  }
  return pcol
}

function getNormalizedSTD(data, min, max) {
  if (min === max) {
    return 0
  }
  data.forEach( (x, i, self) => {
    self[i] = (+x - +min)/(+max - +min)
  });
  
  return getSTD(data)
  
}


const str2number = []
str2number['Zero'] = 0
str2number['One'] = 1
str2number['Two'] = 2
str2number['Three'] = 3
str2number['Four'] = 4
str2number['Five'] = 5
str2number['Six'] = 6
str2number['Seven'] = 7
str2number['Eight'] = 8
str2number['Nine'] = 9

function FieldData(data, feature) {
  const mapped = data.map((d) => {
    return {
      feature: +d[feature]
    }
  })
  return {"values": mapped}
}

function valueCount(arr) {
  var a = [],
    b = [],
    prev;

  arr.sort();
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== prev) {
      a.push(arr[i]);
      b.push(1);
    } else {
      b[b.length - 1]++;
    }
    prev = arr[i];
  }

  const sum = b.reduce((a, b) => a + b, 0);
  const c = b.map(function (d, i) {
    return (d / sum);
  });

  const d = c.indexOf(Math.max(...c));

  return [a, b, c, d];
}

function getTable(vectorsA, vectorsB, projectionColumns, dataset) {
  // dictOfArrays[featureName] = array of i[featureName] for all i in the selection
  const dictOfArraysA = dictionary(vectorsA)
  const dictOfArraysB = dictionary(vectorsB)

  // featureValuesCounts[featureName] = [[list of features], [how often they occur], [percentage of how often they occur]]
  const featureValuesCountsA = []
  const featureValuesCountsB = []

  // collect all values / frequencies for dictOfArrays
  for (var key in dictOfArraysA) {
    featureValuesCountsA[key] = valueCount(dictOfArraysA[key])
  }

  for (var key in dictOfArraysB) {
    featureValuesCountsB[key] = valueCount(dictOfArraysB[key])
  }

  var xOffset = 25
  var yOffset = 25
  var xInter = 25
  var yInter = 25
  var maxSize = 25

  var svg = '<svg width="300" height="300">'

  for (var i = 0; i < 9; i++) {
    for (var j = 0; j < 9; j++) {
      // current feature key
      var key = ''+i+''+j

      if (featureValuesCountsA[key]) {
        // categories
        var categoriesA = featureValuesCountsA[key][0]
        // relative frequencies
        var relFreqA = featureValuesCountsA[key][2]
        // index of most frequent category of that feature
        var i2A = featureValuesCountsA[key][3]
        // most frequent category of that feature
        var categoryA = categoriesA[i2A]
        // relative frequency of that category
        var freqA = relFreqA[i2A]
        // relative frequency of that category

        var categoryA = str2number[categoryA]
        if (categoryA === 0) {
          categoryA = '-'
        }
        
      } else {
        categoryA = '-'
        var freqA = 1.0

      }

      if (featureValuesCountsB[key]) {
        // categories
        var categoriesB = featureValuesCountsB[key][0]
        // relative frequencies
        var relFreqB = featureValuesCountsB[key][2]
        // index of most frequent category of that feature
        var i2B = featureValuesCountsB[key][3]
        // most frequent category of that feature
        var categoryB = categoriesB[i2B]
        // relative frequency of that category
        var freqB = relFreqB[i2B]
        // relative frequency of that category

        var categoryB = str2number[categoryB]
        if (categoryB === 0) {
          categoryB = '-'
        }
        
      } else {
        categoryB = '-'
        var freqB = 1.0

      }

      // underline categories that are equivalent in the entire selection
      var textDec = freqB === 1.0 ? 'underline' : 'normal'

      // encode features that haven't changed as *
      var category = '*'
      if (categoryA !== categoryB) {
        // if features have changed use second selection's most frequent category
        category = categoryB
      } else {
        // draw all stars at same opacity and size
        freqB = 1.0
        textDec = 'normal'
      }
      // opacity + font-size encode frequency linearly
      var s = '<text x='+((Math.floor(i/3)+i) * xOffset)+' y='+((Math.floor(j/3)+j+1) * yOffset)+' text-decoration=\"'+textDec+'\" font-weight=\"normal\" opacity=\"'+(freqB)+'\" font-size=\"'+(freqB * maxSize)+'\">'+category+'</text>' 
      svg += s
    }
  }

  svg += '</svg>'
     
  return (
    <div className="Container" dangerouslySetInnerHTML={{__html: svg}}></div>
  )
}

const mapState = state => {
  return ({
    projectionColumns: state.projectionColumns,
    dataset: state.dataset
  })
}

const mapDispatch = dispatch => ({})

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {

  width?: number
  height?: number
  vectorsA: Array<Vect>
  vectorsB: Array<Vect>
  dataset: Dataset
}

export var SudokuChanges = connector(({ width, height, vectorsA, vectorsB, dataset, projectionColumns }: Props) => {
  return getTable(vectorsA, vectorsB, projectionColumns, dataset)
})