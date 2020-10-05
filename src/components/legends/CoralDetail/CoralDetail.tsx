var d3 = require('d3')
import * as React from 'react'
import { connect } from 'react-redux'
import { Handler } from 'vega-tooltip';
import BarChart from './BarChart.js';
import VegaHist from './VegaHist.js';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    maxWidth: 288,
  },
});

function createDataOld(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

function createData(feature, score, char) {
  return {feature, score, char}
}

const barData = {
  "values": [
    { "a": "A", "b": 20 }, { "a": "B", "b": 34 }, { "a": "C", "b": 55 },
    { "a": "D", "b": 19 }, { "a": "E", "b": 40 }, { "a": "F", "b": 34 },
    { "a": "G", "b": 91 }, { "a": "H", "b": 78 }, { "a": "I", "b": 25 }
  ]
};

function mapHistData(data, feature) {
  const mapped = data.map((d) => {
    return {
      feature: d[feature]
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

const getVariance = (data) => {
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
  return variance
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

// coefficient of variation
const getCV = (data) => {
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
  return std / (Math.abs(mean) + 1e-9)
}

const getMean = (data) => {
  const meanValue = data.reduce((sum, element) => sum + element, 0) / data.length;
  return meanValue;
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

function isCategoricalFeature(feature) {
  if (feature === undefined) {
    return true
  }
  for (var i = 0; i < feature.length; i++) {
    if ((feature[i] !== null) && (typeof feature[i] !== "number")) {
      return true
    }
  }
  return false
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
  if (a[1] === b[1]) {
      return 0;
  }
  else {
      return (a[1] < b[1]) ? 1 : -1;
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

function genRows(vectors) {
  const rows = []
  const dictOfArrays = dictionary(vectors)  

  // TODO create dynamic implementation
  const preselect = [
    "KRAS: AA Mutated",
    "KRAS: AA Mutation",
    "Tumor Type",
    "MDM2: Copy Number Class",
    "TP53: AA Mutation",
    "Age"
  ]

  // loop through dict
  for (var key in dictOfArrays) {
    // TODO comment out for all features
    if (preselect.indexOf(key) > -1) {
      // feature cat?
      if (isCategoricalFeature(dictOfArrays[key])) {
        var barData = mapBarChartData(vectors, key)
        var feature = key + ': \n' + getExplainingFeatures(barData['values']).join(', ')
        rows.push([feature, getMaxMean(barData), <BarChart data={barData} actions={false} tooltip={new Handler().call}/>])
      } else {
        // feature quant?
        var histData = mapHistData(vectors, key)
        rows.push([key, 1 - getSTD(dictOfArrays[key]), <VegaHist data={histData} actions={false} tooltip={new Handler().call}/>])
      }
      // TODO comment out for all features
    }
  }

  // sort rows by score
  rows.sort(sortByScore)

  // turn into array of dicts
  // TODO set appropriate limit of features to show
  const ret = []
  // for (var i = 0; i < rows.length; i++) {
    // TODO comment out for all features
  for (var i = 0; i < Math.min(rows.length, 6); i++) {
    ret.push(createData(rows[i][0], rows[i][1], rows[i][2]))
  }

  return ret
}

function getTable(vectors, aggregation, setProjectionColumns, projectionColumns) {
  const dictOfArrays = dictionary(vectors)
  const classes = useStyles()
  const rows = genRows(vectors)

  return (
    <div>
      <TableContainer component={Paper} style={{
        height: "400px",
        width: "100%",
        overflow: "auto"
      }}>
        <Table className={classes.table} aria-label="simple table" size={'small'}>
          <TableHead>
            <TableRow>
              <TableCell>Feature</TableCell>
              <TableCell>Characteristic</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.feature}>
                <TableCell component="th" scope="row">
                  {row.feature}
                </TableCell>
                <TableCell>{row.char}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

const mapStateToProps = state => {
  return ({
    projectionColumns: state.projectionColumns
  })
}

const mapDispatchToProps = dispatch => ({
  setProjectionColumns: projectionColumns => {
    dispatch({
      type: 'SET_PROJECTION_COLUMNS',
      projectionColumns: projectionColumns
    })
  }
})

export var CoralLegend = connect(mapStateToProps, mapDispatchToProps)(({ selection, aggregate, setProjectionColumns, projectionColumns }) => {
  return getTable(selection, aggregate, setProjectionColumns, projectionColumns)
})