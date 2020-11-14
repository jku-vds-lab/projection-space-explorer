var d3 = require('d3')
import * as React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Handler } from 'vega-tooltip';
import BarChart from './BarChart.js';
import VegaHist from './VegaHist.js';
import VegaDate from './VegaDate.js';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './Sudoku.scss';
import { setProjectionColumns } from '../../Ducks/ProjectionColumnsDuck';
import { FeatureType, Vect } from "../../../components/util/datasetselector"

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

function genRows(vectors, projectionColumns, dataset) {
  if (dataset === undefined) {
    return []
  }
  const rows = []
  const dictOfArrays = dictionary(vectors)
  const preselect = getProjectionColumns(projectionColumns)

  // loop through dict
  for (var key in dictOfArrays) {
    // filter for preselect features
    if (preselect.indexOf(key) > -1) {
      if (dataset.columns[key]?.featureType === FeatureType.Quantitative) {
        // quantitative feature
        var histData = mapHistData(vectors, key)
        rows.push([key, "", 1 - getNormalizedSTD(dictOfArrays[key], dataset.columns[key].range.min, dataset.columns[key].range.max), <VegaHist data={histData} actions={false} tooltip={new Handler().call}/>])

      } else if (dataset.columns[key]?.featureType === FeatureType.Categorical) {
        // categorical feature
        var barData = mapBarChartData(vectors, key)
        rows.push([key, barData['values'][0]['category'], getMaxMean(barData), <BarChart data={barData} actions={false} tooltip={new Handler().call}/>])
        
      } else if (dataset.columns[key]?.featureType === FeatureType.Date) {
        // date feature
        var histData = mapHistData(vectors, key)
        rows.push([key, "", 1 - getNormalizedSTD(dictOfArrays[key], dataset.columns[key].range.min, dataset.columns[key].range.max), <VegaDate data={histData} actions={false} tooltip={new Handler().call}/>])
      }
    }
  }

  // turn into array of dicts
  const ret = []
  for (var i = 0; i < rows.length; i++) {
    ret.push(createData(rows[i][0], rows[i][1], rows[i][2], rows[i][3]))
  }

  // sort rows by score
  ret.sort(sortByScore)

  return ret
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

function getTable(vectors, aggregation, projectionColumns, dataset) {
  // dictOfArrays[featureName] = array of i[featureName] for all i in the selection
  const dictOfArrays = dictionary(vectors)

  // featureValuesCounts[featureName] = [[list of features], [how often they occur], [percentage of how often they occur]]
  const featureValuesCounts = []

  // collect all values / frequencies for dictOfArrays
  for (var key in dictOfArrays) {
    featureValuesCounts[key] = valueCount(dictOfArrays[key])
  }

  const classes = useStyles()
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

      if (featureValuesCounts[key]) {
        // categories
        var categories = featureValuesCounts[key][0]
        // relative frequencies
        var relFreq = featureValuesCounts[key][2]
        // index of most frequent category of that feature
        var i2 = featureValuesCounts[key][3]
        // most frequent category of that feature
        var category = categories[i2]
        // relative frequency of that category
        var freq = relFreq[i2]
        // relative frequency of that category

        var category = str2number[category]
        if (category === 0) {
          category = '-'
        }
        
      } else {
        category = '-'
        var freq = 1.0

      }
      // underline categories that are equivalent in the entire selection
      var textDec = freq === 1.0 ? 'underline' : 'normal'
      // opacity + font-size encode frequency linearly
      var s = '<text x='+((Math.floor(i/3)+i) * xOffset)+' y='+((Math.floor(j/3)+j+1) * yOffset)+' text-decoration=\"'+textDec+'\" font-weight=\"normal\" opacity=\"'+(freq)+'\" font-size=\"'+(freq * maxSize)+'\">'+category+'</text>' 
      svg += s
    }
  }

  svg += '</svg>'
     
  return (
    <div className="Container" dangerouslySetInnerHTML={{__html: svg}}></div>
  )
  
  // return (
  //   <svg width="300" height="300">

  //   <text x={xOffset} y={yOffset} fontSize={0.7*maxSize}>1</text>
  //   <text x={2*xOffset} y={yOffset} fontSize={maxSize}>2</text>
  //   <text x={3*xOffset} y={yOffset} fontSize={0.9*maxSize}>3</text>
    
  //   <text x={xOffset} y={2*yOffset} fontSize={maxSize}>4</text>
  //   <text x={2*xOffset} y={2*yOffset} fontSize={0.3*maxSize}>5</text>
  //   <text x={3*xOffset} y={2*yOffset} fontSize={maxSize}>6</text>

  //   <text x={xOffset} y={3*yOffset} fontSize={0.4*maxSize}>7</text>
  //   <text x={2*xOffset} y={3*yOffset} fontSize={maxSize}>8</text>
  //   <text x={3*xOffset} y={3*yOffset} fontSize={0.6*maxSize}>9</text>

  //   </svg>
  // )
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
    aggregate: boolean
    selection: Vect[]
}

export var SudokuLegend = connector(({ selection, aggregate, projectionColumns, dataset }: Props) => {
  return getTable(selection, aggregate, projectionColumns, dataset)
})