import * as React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Handler } from 'vega-tooltip';
import { makeStyles } from '@mui/styles';
import './coral.scss';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import * as vegaImport from 'vega';
import { FeatureType } from '../../../model/FeatureType';
import { IVector } from '../../../model/Vector';
import BarChart from './BarChart';
import VegaDensity from './VegaDensity';
import VegaDate from './VegaDate';
import type { RootState } from '../../../components/Store/Store';
import { DefaultLegend } from '../../..';

const useStyles = makeStyles({
  table: {
    maxWidth: 288,
  },
  tableRow: {
    height: '66px',
  },
});

function createData(feature, category, score, char) {
  return { feature, category, score, char };
}

function mapHistData(data, feature) {
  const mapped = data.map((d) => {
    return {
      feature: +d[feature],
    };
  });
  return { values: mapped };
}

function mapDensityData(allData, selectedData, feature) {
  const mappedData = allData.map((d, i) => {
    return {
      feature: +d[feature],
      selection: 'all',
    };
  });
  const mappedSelection = selectedData.map((d, i) => {
    return {
      feature: +d[feature],
      selection: 'selection',
    };
  });
  const mapped = [...mappedSelection, ...mappedData];
  return { values: mapped };
}

function mapBarChartData(allData, selectedData, feature) {
  console.log('selectedData', selectedData)
  console.log('feature', feature)
  const selectedCounts = {};
  for (let i = 0; i < selectedData.length; i++) {
    if (selectedData[i][feature] in selectedCounts) {
      selectedCounts[selectedData[i][feature]] += 1;
    } else {
      selectedCounts[selectedData[i][feature]] = 1;
    }
  }
  console.log('selectedData[0][feature] :>> ', selectedData[0][feature]);
  console.log('counts[selectedData[0][feature]] :>> ', selectedCounts[selectedData[0][feature]]);

  const allCounts = {};
  for (let i = 0; i < allData.length; i++) {
    if (allData[i][feature] in allCounts) {
      allCounts[allData[i][feature]] += 1;
    } else {
      allCounts[allData[i][feature]] = 1;
    }
  }
  

  const sortCountDesc = (a, b) => {
    return b.count - a.count;
  };

  const selectedBarChartData = [];
  for (const key in selectedCounts) {
    let count = selectedCounts[key] / selectedData.length;
    count = isFinite(count) ? count : 0;
    selectedBarChartData.push({ selection: 'selected', category: key, count: count });
  }
  selectedBarChartData.sort(sortCountDesc);

  // create a map for featureCategory: id
  const categoryMap = {}
  selectedBarChartData.map((x, i) => {
    categoryMap[x.category] = i
    x.id = i
  })
  console.log('categoryMap :>> ', categoryMap);
  console.log('selectedBarChartData :>> ', selectedBarChartData);
  const l = selectedBarChartData.length
  var idxCounter = l

  const allBarChartData = [];
  for (const key in allCounts) {
    let count = allCounts[key] / allData.length;
    count = isFinite(count) ? count : 0;
    // apply that mapping to allBarChartData without actually having to sort it
    // make sure to check whether category in allBarChartData even exists in map, otherwise create new entry in map for new id
    var i = categoryMap[key]
    if (i == undefined) {
      i = idxCounter
      categoryMap[key] = i
      idxCounter++
    }
    allBarChartData.push({ selection: 'all', category: key, count: count, id: i});
  }

  const barChartData = [...allBarChartData, ...selectedBarChartData];

  console.log('barChartData', barChartData)
  return { values: barChartData };
}

const getSTD = (data) => {
  const total = data.reduce(function (a, b) {
    return a + b;
  });
  let mean = total / data.length;
  mean = isFinite(mean) ? mean : 0;
  function var_numerator(value) {
    return (value - mean) * (value - mean);
  }
  let variance = data.map(var_numerator);
  variance = variance.reduce(function (a, b) {
    return a + b;
  });
  variance /= data.length;
  variance = isFinite(variance) ? variance : 1;
  const std = Math.sqrt(variance);
  return std;
};

function dictionary(list) {
  const map = {};
  for (let i = 0; i < list.length; ++i) {
    for (const key in list[i]) {
      if (key in map) {
        map[key].push(list[i][key]);
      } else {
        map[key] = [list[i][key]];
      }
    }
  }
  return map;
}

function getMaxMean(data) {
  let max = Number.NEGATIVE_INFINITY;
  data = data.values;
  for (let i = 0; i < data.length; i++) {
    if (data[i].count > max) {
      max = data[i].count;
    }
  }
  return max;
}

function sortByScore(a, b) {
  if (a.score === b.score) {
    return 0;
  }

  return a.score < b.score ? 1 : -1;
}

function getExplainingFeatures(data) {
  // data format [{'category': x, 'count': y}, ...]
  // data should be sorted descendingly
  const n = data.length;
  const features = [];
  for (let i = 0; i < n; i++) {
    if (data[i].count >= 1 / n) {
      features.push(data[i].category);
    } else {
      return features;
    }
  }
  return features;
}

function getProjectionColumns(legendAttributes) {
  if (legendAttributes === null) {
    return [];
  }
  const pcol = [];
  for (let i = 0; i <= legendAttributes.length; i++) {
    if (legendAttributes[i] !== undefined && legendAttributes[i].show) {
      pcol.push(legendAttributes[i].feature);
    }
  }
  return pcol;
}

function getNormalizedSTD(data, min, max) {
  if (min === max) {
    return 0;
  }
  data.forEach((x, i, self) => {
    self[i] = (+x - +min) / (+max - +min);
  });

  return getSTD(data);
}

function genRows(vectors, aggregation, legendAttributes, dataset) {
  if (dataset === undefined) {
    return [];
  }

  // if(!aggregation){ // TODO: if it shows the hover state, we don't need to generate all rows because we can't scroll anyway
  //   return []
  // }

  const rows = [];
  const dictOfArrays = dictionary(vectors);
  const preselect = getProjectionColumns(legendAttributes);

  // loop through dict
  for (const key in dictOfArrays) {
    // filter for preselect features
    if (preselect.indexOf(key) > -1) {
      if (dataset.columns[key]?.metaInformation.noLineUp) {
        // dont do anything, if column should not be shown
      } else if (dataset.columns[key]?.featureType === FeatureType.Quantitative) {
        // quantitative feature
        const densityData = mapDensityData(dataset.vectors, vectors, key);
        // logLevel={vegaImport.Debug} | {vegaImport.Warn} | {vegaImport.Error} | {vegaImport.None} | {vegaImport.Info}
        console.log('densityData', densityData)
        rows.push([
          key,
          '',
          1 - getNormalizedSTD(dictOfArrays[key], dataset.columns[key].range.min, dataset.columns[key].range.max),
          <VegaDensity logLevel={vegaImport.Error} data={densityData} actions={false} tooltip={new Handler().call} />,
        ]);
      } else if (dataset.columns[key]?.featureType === FeatureType.Categorical) {
        // categorical feature
        const barData = mapBarChartData(dataset.vectors, vectors, key);
        var barChart;
        if (Object.keys(barData.values).length != 1) {
          // logLevel={vegaImport.Debug} | {vegaImport.Warn} | {vegaImport.Error} | {vegaImport.None} | {vegaImport.Info}
          barChart = <BarChart logLevel={vegaImport.Error} data={barData} actions={false} tooltip={new Handler().call} />;
        } else {
          barChart = null;
        }
        rows.push([key, barData.values[0].category, getMaxMean(barData), barChart]);
      } else if (dataset.columns[key]?.featureType === FeatureType.Date) {
        // date feature
        const histData = mapHistData(vectors, key);
        rows.push([
          key,
          '',
          1 - getNormalizedSTD(dictOfArrays[key], dataset.columns[key].range.min, dataset.columns[key].range.max),
          <VegaDate data={histData} actions={false} tooltip={new Handler().call} />,
        ]);
      }
    }
  }

  // turn into array of dicts
  const ret = [];
  for (let i = 0; i < rows.length; i++) {
    ret.push(createData(rows[i][0], rows[i][1], rows[i][2], rows[i][3]));
  }

  // sort rows by score
  ret.sort(sortByScore);

  return ret;
}

function getTable(vectors, aggregation, legendAttributes, dataset) {
  const classes = useStyles();
  const rows = genRows(vectors, aggregation, legendAttributes, dataset);

  return (
    <div style={{ width: '100%', maxHeight: '100%', overflowY: 'scroll' }}>
      <div
        style={{
          width: '100%',
          // overflow: "auto"
        }}
      >
        <Table className={classes.table} aria-label="simple table" size="small">
          <TableHead />
          <TableBody>
            {rows.map((row) => (
              <TableRow className={classes.tableRow} key={row.feature}>
                <TableCell component="th" scope="row">
                  <div style={{ maxWidth: 200 }}>
                    {row.feature}
                    <br />
                    <b>{row.category}</b>
                  </div>
                </TableCell>
                <TableCell>{row.char}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

const mapState = (state: RootState) => {
  return {
    legendAttributes: state.genericFingerprintAttributes,
    dataset: state.dataset,
  };
};

const mapDispatch = (dispatch) => ({});

const connector = connect(mapState, mapDispatch);

type PropsFromRedux = ConnectedProps<typeof connector>;

type Props = PropsFromRedux & {
  aggregate: boolean;
  selection: IVector[];
};

export var CoralLegend = connector(({ selection, aggregate, legendAttributes, dataset }: Props) => {
  if(selection.length <= 0){
    return <DefaultLegend></DefaultLegend>
  }
  return getTable(selection, aggregate, legendAttributes, dataset);
});
