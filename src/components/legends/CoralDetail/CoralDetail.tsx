var d3 = require('d3')
import * as React from 'react'
import { connect } from 'react-redux'
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
import './coral.scss';
import { setProjectionColumns } from '../../Ducks/ProjectionColumnsDuck';
import { FeatureType } from "../../../components/util/datasetselector"

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

        if (dataset.featureTypes[key] === FeatureType.Quantitative) {
          // quantitative feature
          var histData = mapHistData(vectors, key)
          rows.push([key, "", 1 - getSTD(dictOfArrays[key]), <VegaHist data={histData} actions={false} tooltip={new Handler().call}/>])
        } else if (dataset.featureTypes[key] === FeatureType.Categorical) {
          // categorical feature
          var barData = mapBarChartData(vectors, key)
          var feature = key + ': \n' + barData['values'][0]['category']
          rows.push([key, barData['values'][0]['category'], getMaxMean(barData), <BarChart data={barData} actions={false} tooltip={new Handler().call}/>])
        } else if (dataset.featureTypes[key] === FeatureType.Date) {
          // date feature
          var histData = mapHistData(vectors, key)
          rows.push([key, "", 1 - getSTD(dictOfArrays[key]), <VegaDate data={histData} actions={false} tooltip={new Handler().call}/>])
        }
    }
  }

  // sort rows by score
  rows.sort(sortByScore)

  // turn into array of dicts
  const ret = []
  for (var i = 0; i < rows.length; i++) {
    ret.push(createData(rows[i][0], rows[i][1], rows[i][2], rows[i][3]))
  }

  return ret
}

function getTable(vectors, aggregation, projectionColumns, dataset) {
  const classes = useStyles()
  const rows = genRows(vectors, projectionColumns, dataset)

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
                {row.feature}<br/><b>{row.category}</b>
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
    projectionColumns: state.projectionColumns,
    dataset: state.dataset
  })
}

export var CoralLegend = connect(mapStateToProps, null)(({ selection, aggregate, projectionColumns, dataset }) => {
  return getTable(selection, aggregate, projectionColumns, dataset)
})