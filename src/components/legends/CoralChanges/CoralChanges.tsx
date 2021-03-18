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
import './coral.scss';
import { setProjectionColumns } from '../../Ducks/ProjectionColumnsDuck';
import { ChiSquareTest } from './ChiSquare'
import BarChanges from './VegaBarChanges.js';
import Boxplot from './VegaBoxplot.js';
import { Dataset } from '../../Utility/Data/Dataset';
import { Vect } from '../../Utility/Data/Vect';
import { FeatureType } from '../../Utility/Data/FeatureType';
import { setDifferenceThreshold } from "../../Ducks/DifferenceThresholdDuck";
import { cloneDeep } from "../../Utility/CloneDeep";

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

function createData(feature, category, score, char, difference) {
  return { feature, category, score, char, difference }
}

function getBins(a, n = 10) {
  const bin = d3.histogram()
    .thresholds(n - 1)
  return bin(a)
}

function getMaxDif(a, b) {

  const aSum = a.reduce((x, y) => x + y, 0)
  const bSum = b.reduce((x, y) => x + y, 0)
  
  // get index where 2 arrays a and b differ the most + value
  var maxDif = 0
  var maxDifIndex = 0

  var x = a.map(function (item, index) {
    // In this case item corresponds to currentValue of array a, 
    // using index to get value from array b
    // const dif = Math.abs(item - b[index])
    const dif = Math.abs(item/aSum - b[index]/bSum)
    maxDifIndex = dif > maxDif ? index : maxDifIndex
    maxDif = dif > maxDif ? dif : maxDif
    return dif
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

function isInBin(x, i, lowerBounds, upperBounds) {
  return x >= lowerBounds[i] && x <= upperBounds[i]
}

function getFlattenedBins(a, b) {
  // bin a,b together to find sensible bins
  // then e.g. if resulting bins are 1: [1,2] and 2: [2,3]
  // and a = [1.2, 1.7, 2.2, 2.8, 3.0]
  // returns [1, 1, 2, 2, 2] for a
  // similar for b

  // find sensible bins for both a,b together
  const bin = d3.histogram()
    .thresholds(10 - 1)
  const binned = bin(a.concat(b))
  const lowerBounds = []
  const upperBounds = []
  binned.forEach(e => {
    lowerBounds.push(e.x0)
    upperBounds.push(e.x1)
  });

  a = a.sort()
  b = b.sort()

  const retA = []
  const retB = []

  var binIdx = 0

  // go over each element of a
  for (var i = 0; i < a.length; i++) {
    const e = a[i]
    // starting at lowest bin, go to next bin until current element fits in
    while (!isInBin(e, binIdx, lowerBounds, upperBounds) && binIdx < lowerBounds.length) {
      binIdx++
    }
    retA.push(binIdx)
    
  }

  binIdx = 0

  // go over each element of b
  for (var i = 0; i < b.length; i++) {
    const e = b[i]
    // starting at lowest bin, go to next bin until current element fits in
    while (!isInBin(e, binIdx, lowerBounds, upperBounds) && binIdx < lowerBounds.length) {
      binIdx++
    }
    retB.push(binIdx)
    
  }

  return [retA, retB]
}


function getMostDifferingCategory(setA, setB): [number, string] {
  const data = []

  const setACategories = setA.filter((item, index, self) => self.indexOf(item) === index);
  const setBCategories = setB.filter((item, index, self) => self.indexOf(item) === index);
  const allCategories = setACategories.concat(setBCategories).filter((item, index, self) => self.indexOf(item) === index);

  const setASize = setA.length;
  const setBSize = setB.length;
  const overallSize = setASize + setBSize;

  for (const currCat of allCategories) {
    const amountSetA = setA.filter((item) => (item === currCat)).length;
    const amountSetB = setB.filter((item) => (item === currCat)).length;

    // const relDif = (amountSetB - amountSetA) / amountSetA
    const relDif = (amountSetB/setBSize - amountSetA/setASize)
    data.push({'category': currCat, 'difference': relDif})
  }

  const sorted = data.sort(sortByAbsDifference)

  return [sorted[0]['difference'], sorted[0]['category']]
}

function oldGetMostDifferingCategory(a, b): [number, string] {
  // return max dif value, max dif index
  if (!a || !b) {
    return [0, ""]
  }
  const featuresCounts = getFeaturesCounts(a, b)
  const features = featuresCounts[0]
  a = featuresCounts[1]
  b = featuresCounts[2]
  const ret = getMaxDif(a, b)

  return [ret[0], features[ret[1]]]
}

function getDifference(a, b, type): [number, string, number] {
  if(!a || !b) {
    return [0, "", 0]
  }

  // a, b are arrays of values of the same feature for both selections A and B
  // a = ["qwe", "qwe", "qwe", "asd", ...]
  //  or
  //  a = [1, 1, 1, 1, 1, 1, 1, 2.3, 2.3, 2.3, ...]
  // determine difference score

  var maxDifFeature = ""
  var maxDifVal = 0

  if (type !== FeatureType.Categorical) {
    // bin continuous data and turn into categorical data using bin numbers
    const flatBins = getFlattenedBins(a, b)
    a = flatBins[0]
    b = flatBins[1]
  } else {
    // find most differing category
    [maxDifVal, maxDifFeature] = getMostDifferingCategory(a, b)
  }

  // calculate chi-sqaure score
  const test = new ChiSquareTest()
  const dif = test.calc(a, b)

  // for quantitative data use score avlue as difference
  if (type !== FeatureType.Categorical) {
    maxDifVal = dif.scoreValue
  }

  return [dif.scoreValue, maxDifFeature, maxDifVal]
}

function sortByAbsDifference(a, b) {
  if (Math.abs(a['difference']) === Math.abs(b['difference'])) {
      return 0;
  }
  else {
      return (Math.abs(a['difference']) < Math.abs(b['difference'])) ? 1 : -1;
  }
}

function mapCategoricalChangesData(setA, setB, feature) {
  if (!setA || !setB) {
    return {'values': []}
  }
  // a, b like ["qwe","qwe","asd"], ...
  // turn into {'values': [{'category': 'qwe', 'difference': 0.8}, {'category': 'asd', 'difference': -0.6}]
  // should be sorted by absolute difference

  const data = []

  const setACategories = setA.filter((item, index, self) => self.indexOf(item) === index);
  const setBCategories = setB.filter((item, index, self) => self.indexOf(item) === index);
  const allCategories = setACategories.concat(setBCategories).filter((item, index, self) => self.indexOf(item) === index);

  const setASize = setA.length;
  const setBSize = setB.length;
  const overallSize = setASize + setBSize;

  for (const currCat of allCategories) {
    const amountSetA = setA.filter((item) => (item === currCat)).length;
    const amountSetB = setB.filter((item) => (item === currCat)).length;

    // const relDif = (amountSetB - amountSetA) / amountSetA
    const relDif = (amountSetB/setBSize - amountSetA/setASize)
    data.push({'category': currCat, 'difference': relDif})
  }

  const sorted = data.sort(sortByAbsDifference)
  for (let i = 0; i < sorted.length; i++) {
    sorted[i]['rank'] = (i+1)
  }

  return {'values': sorted}
}

function getCategoricalVis(a, b, feature) {
  const data = mapCategoricalChangesData(a, b, feature)
  return <div><b>{feature}</b><br/><BarChanges data={data} actions={false} tooltip={new Handler().call}/></div>
}

function mapContinuousChangesData(a, b, feature) {
  const data = []
  a.forEach(e => {
    data.push({'val': e, 'selection': 'A'})
  });
  b.forEach(e => {
    data.push({'val': e, 'selection': 'B'})
  });
  return {'values': data}
}

function getContinuousVis(a, b, feature) {
  const data = mapContinuousChangesData(a, b, feature)
  return <div><b>{feature}</b><br/><Boxplot data={data} actions={false} tooltip={new Handler().call}/></div>
}

function getVis(a, b, type, feature) {
  if (type === FeatureType.Categorical) {
    return getCategoricalVis(a, b, feature)
  } else {
    return getContinuousVis(a, b, feature)
  } 
}

function genRows(vectorsA, vectorsB, projectionColumns, dataset) {

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
    var [difScore, mostDifCat, difVal] = getDifference(valuesA, valuesB, type)    
    
    // append dif to rows
    // create visualization for those features and append to rows
    var vis = getVis(valuesA, valuesB, type, key)

    // append to rows: key, most differing category, dif score, vis, difVal
    rows.push([key, mostDifCat, difScore, vis, difVal])
    
  });

  // turn into array of dicts
  const ret = []
  for (var i = 0; i < rows.length; i++) {
    ret.push(createData(rows[i][0], rows[i][1], rows[i][2], rows[i][3], rows[i][4]))
  }

  // sort rows by score
  ret.sort(sortByScore)

  return ret
}

const mapStateToProps = state => {
  return ({
    projectionColumns: state.projectionColumns,
    dataset: state.dataset,
    differenceThreshold: state.differenceThreshold
  })
}

const mapDispatch = dispatch => ({
  // projectionColumns and dataset should not be changed from within this component
})

const connector = connect(mapStateToProps, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {

  width?: number
  height?: number
  vectorsA: Array<Vect>
  vectorsB: Array<Vect>
  dataset: Dataset
  scale: number
}


/**
 * filter rows within vega specs according to threshold
 * @param rows array of [{ feature, category, score, char, difference }, ...]
 * @param threshold filter all r={...} with r.difference < threshold, except for quantitative data
 * @param dataset dataset from props to lookup feature type
 */
function filterReactVega(rows, threshold, dataset) {
  for(var i = 0; i < rows.length; i++) {

    const type = dataset.columns[rows[i].feature]?.featureType

    if (type === FeatureType.Categorical) {
      rows[i].char.props.children[2].props.data.values = rows[i].char.props.children[2].props.data.values.filter(v => {
        return Math.abs(v.difference) >= threshold
      })
      
    }
  }
  return rows
}


export const CoralChanges = connector(class extends React.Component<Props> {
  rows: any[]

  constructor(props) {
    super(props)
  }
  
  render() {
    // generate rows including vega specs for table div
    this.rows = genRows(this.props.vectorsA, this.props.vectorsB, this.props.projectionColumns, this.props.dataset);
    // filter entire vega specs with threshold
    this.rows = this.rows.filter(r => {
      return r.difference >= this.props.differenceThreshold
    })
    // filter individual categorical vega spec bars with threshold
    this.rows = filterReactVega(this.rows, this.props.differenceThreshold, this.props.dataset)

    return (
      <div>
        <TableContainer component={Paper} style={{
          height: "400px",
          width: "100%",
          overflow: "auto"
        }}>
          <Table aria-label="simple table" size={'small'}>
            <TableHead>
            </TableHead>
            <TableBody>
              {this.rows.map((row) => (
                <TableRow key={row.feature}>
                  <TableCell>{row.char}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
})