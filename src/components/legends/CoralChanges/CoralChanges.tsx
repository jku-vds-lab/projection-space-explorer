var d3 = require('d3')
import * as React from 'react'
import { connect, ConnectedProps } from 'react-redux'
import { Handler } from 'vega-tooltip';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import '../CoralDetail/coral.scss';
import { setProjectionColumns } from '../../Ducks/ProjectionColumnsDuck';
import { FeatureType, Vect, Dataset, DatasetType } from "../../../components/util/datasetselector"
import { ChiSquareTest } from './ChiSquare'

const useStyles = makeStyles({
  table: {
    maxWidth: 288,
  },
});

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

function getCounts(arr) {
  // ["asd", "asd", "asd", "qwe", "yxc"] -> [["asd","qwe","yxc"], [[3,1,1]]
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
  return [a, b];
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

function sortByScore(a, b) {
  if (a['score'] === b['score']) {
    return 0;
  }
  else {
    return (a['score'] < b['score']) ? 1 : -1;
  }
}

function createData(feature, category, score, char) {
  return { feature, category, score, char }
}

function getBins(a, n = 10) {
  const bin = d3.histogram()
    .thresholds(n-1)
  return bin(a)
}

function getMaxDif(a, b) {
  // get index where 2 arrays a and b differ the most + value
  var maxDif = 0
  var maxDifIndex = 0

  var x = a.map(function (item, index) {
    // In this case item correspond to currentValue of array a, 
    // using index to get value from array b
    const dif = Math.abs(item - b[index])
    maxDifIndex = dif > maxDif ? index : maxDifIndex
    maxDif = dif > maxDif ? dif : maxDif
    return Math.abs(item - b[index]);
  })

  return [maxDif, maxDifIndex]
}

function getCombinedCounts(a, b) {
  // a = [["qwe","asd"][3,1]], b = [["asd","yxc"],"2,2"]
  // -> [["qwe","asd","yxc"],[3,1,0],[0,2,2]]
  const featuresA = a[0]
  const valuesA = a[1]
  const featuresB = b[0]
  const valuesB = b[1]
  const featureDictA = []
  const featureDictB = []

  for (let i = 0; i < a.length; i++) {
    var key = featuresA[i]
    var value = valuesA[i]
    featureDictA[key] = value
    featureDictB[key] = 0
  }

  for (let i = 0; i < a.length; i++) {
    var key = featuresB[i]
    var value = valuesB[i]
    featureDictB[key] = value
    if (!(key in featureDictA))
      featureDictA[key] = 0
  }

  return [Object.keys(featureDictA), Object.values(featureDictA), Object.values(featureDictB)]
}

function getFeaturesCounts(a, b) {
  // data like ["asd", "asd", "qwe", ...]
    // turn into ["asd", "qwe", ...], [2, 43, ...]
    var countsA = getCounts(a)
    var countsB = getCounts(b)
    // add missing features that didn't occur in respectively other array
    const combinedCounts = getCombinedCounts(countsA, countsB)
    return combinedCounts
}

function getBinnedCounts(a, b) {
  // if quantitative bucket data
  a = getBins(a)
  b = getBins(b)
  // returns [Array(4), Array(43), ...]
  // turn into [4, 43, ...]
  for (let i = 0; i < a.length; i++) {
    a[i] = a[i].length()
    b[i] = b[i].length()
  }
  return [a, b]
}

function getDifference(a, b, type) {
  // a, b are arrays of values of the same feature for both selections A and B
  // if categorical those are strings
  // determine difference score

  var maxDifFeature = ""

  if (type !== FeatureType.Categorical) {
    const binnedCounts = getBinnedCounts(a, b)
    a = binnedCounts[0]
    b = binnedCounts[1]
  } else {
    const featuresCounts = getFeaturesCounts(a, b)
    const features = featuresCounts[0]
    a = featuresCounts[1]
    b = featuresCounts[2]

    const maxDifIndex = getMaxDif(a, b)[1]
    maxDifFeature = features[maxDifIndex]
  }
  // chi-square distance
  // const dif = chisquare(a, b)
  const test = new ChiSquareTest()
  const dif = test.calc(a, b)

  return [dif, maxDifFeature]
}

function getVis(a, b, type) {
  return null
}

function chisquare(a, b) {
  var chisquare = 0
  for (let i = 0; i < a.length; i++) {
    const x = a[i]
    const y = b[i]
    chisquare += ((x - y) ** 2) / y
  }
  return chisquare
}

function genRows(vectorsA, vectorsB, projectionColumns, dataset) {
  
  
  // score value 0 for:
  // const a = [1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
  // const b = [1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
  // score value 1 for:
  // const a = [1,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,2,2,2,2,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5]
  // const b = [7,7,7,7,7,7,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,9,9,9,6,6,6,6,6,6,6,6,6,6]
  // 0.82 for:
  // const a = ['qwe','qwe','qwe','qwe','asd','asd','asd','asd','asd','asd','asd','asd','asd']
  // const b = ['qwe','qwe','qwe','qwe','qwe','qwe','yxc','yxc','yxc','yxc','yxc','yxc','yxc','yxc','yxc','yxc','yxc']
  // const type = FeatureType.Categorical

  // console.log('a :>> ', a);
  // console.log('b :>> ', b);

  // const test = new ChiSquareTest()
  // const dif = test.calc(a, b)
  // console.log('dif :>> ', dif);
  

  if (dataset === undefined) {
    return []
  }
  const rows = []
  const dictOfArraysA = dictionary(vectorsA)
  const dictOfArraysB = dictionary(vectorsB)
  const preselect = getProjectionColumns(projectionColumns)

  // for each feature in preselect
  preselect.forEach(key => {
    var type = dataset.columns[key]?.featureType
    var valuesA = dictOfArraysA[key]
    var valuesB = dictOfArraysB[key]
    // calc difference between A and B and 
    var dif = getDifference(valuesA, valuesB, type)
    var difScore = dif[0]
    var mostDifCat = dif[1]
    // append dif to rows
    // create visualization for those features and append to rows
    var vis = getVis(valuesA, valuesB, type)

    // append to rows: key, most differing category, dif score, vis
    rows.push([key, mostDifCat, difScore, vis])
  });

  // turn into array of dicts
  const ret = []
  for (var i = 0; i < rows.length; i++) {
    ret.push(createData(rows[i][0], rows[i][1], rows[i][2], rows[i][3]))
  }

  // sort rows by score
  ret.sort(sortByScore)

  return ret
}

function getTable(vectorsA, vectorsB, projectionColumns, dataset) {
  const classes = useStyles()
  const rows = genRows(vectorsA, vectorsB, projectionColumns, dataset)

  // TODO
  // return null

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
              <TableCell>Char</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.feature}>
                <TableCell component="th" scope="row">
                  {row.feature}<br /><b>{row.category}</b>
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
  scale: number
}

export var CoralChanges = connector(({ width, height, vectorsA, vectorsB, dataset, projectionColumns, scale }: Props) => {
  console.log('coral changes:');
  console.log('dataset :>> ', dataset);
  console.log('vectorsA :>> ', vectorsA);
  console.log('vectorsB :>> ', vectorsB);
  return getTable(vectorsA, vectorsB, projectionColumns, dataset)
})