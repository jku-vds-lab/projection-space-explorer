var d3 = require('d3')
import * as React from 'react'
import { connect } from 'react-redux'
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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
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

function genRows(vectors) {
  const chartAge = <VegaHist data={mapHistData(vectors, 'Age')} actions={false} />
  const chartBMI = <VegaHist data={mapHistData(vectors, 'Body Mass Index (BMI)')} actions={false} />
  const chartDTD = <VegaHist data={mapHistData(vectors, 'Days to death')} actions={false} />
  return [
    createData('Age', 159, chartAge, 24, 4.0),
    createData('BMI', 237, chartBMI, 37, 4.3),
    createData('Days to death', 262, chartDTD, 24, 6.0)//,//,
    // createData('Cupcake', 305, 3.7, 67, 4.3),
    // createData('Gingerbread', 356, 16.0, 49, 3.9),
  ];
}

const calculateVariancePercentage = (data) => {
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
  // variance relative to mean
  return variance / (mean + 1e-9)
}

const calculateMean = (data) => {
  const meanValue = data.reduce((sum, element) => sum + element, 0) / data.length;
  return meanValue;
}

function getTable(vectors, aggregation, setProjectionColumns, projectionColumns) {

  const classes = useStyles();
  const rows = genRows(vectors)

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table" size={'small'}>
        <TableHead>
          <TableRow>
            <TableCell>Feature</TableCell>
            <TableCell>Dissimilarity</TableCell>
            <TableCell>Characteristic</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell>{row.calories}</TableCell>
              <TableCell>{row.fat}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
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