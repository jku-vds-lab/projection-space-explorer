"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_redux_1 = require("react-redux");
const styles_1 = require("@mui/styles");
require("./coral.scss");
const material_1 = require("@mui/material");
const useStyles = styles_1.makeStyles({
    table: {
        maxWidth: 288,
    },
    tableRow: {
        height: "66px"
    },
});
function createData(feature, category, score, char) {
    return { feature, category, score, char };
}
function mapHistData(data, feature) {
    const mapped = data.map((d) => {
        return {
            feature: +d[feature]
        };
    });
    return { "values": mapped };
}
function mapDensityData(allData, selectedData, feature) {
    const mappedData = allData.map((d) => {
        return {
            feature: +d[feature],
            selection: "all"
        };
    });
    const mappedSelection = selectedData.map((d) => {
        return {
            feature: +d[feature],
            selection: "selection"
        };
    });
    const mapped = [...mappedSelection, ...mappedData];
    return { "values": mapped };
}
function mapBarChartData(data, feature) {
    const counts = {};
    for (var i = 0; i < data.length; i++) {
        if (data[i][feature] in counts) {
            counts[data[i][feature]] += 1;
        }
        else {
            counts[data[i][feature]] = 1;
        }
    }
    const sortCountDesc = (a, b) => {
        return b['count'] - a['count'];
    };
    const barChartData = [];
    for (var key in counts) {
        barChartData.push({ 'category': key, 'count': counts[key] / data.length });
    }
    barChartData.sort(sortCountDesc);
    return { 'values': barChartData };
}
const getSTD = (data) => {
    const total = data.reduce(function (a, b) {
        return a + b;
    });
    const mean = total / data.length;
    function var_numerator(value) {
        return ((value - mean) * (value - mean));
    }
    var variance = data.map(var_numerator);
    variance = variance.reduce(function (a, b) {
        return (a + b);
    });
    variance = variance / data.length;
    const std = Math.sqrt(variance);
    return std;
};
function dictionary(list) {
    var map = {};
    for (var i = 0; i < list.length; ++i) {
        for (var key in list[i]) {
            if (key in map) {
                map[key].push(list[i][key]);
            }
            else {
                map[key] = [list[i][key]];
            }
        }
    }
    return map;
}
function getMaxMean(data) {
    var max = Number.NEGATIVE_INFINITY;
    data = data['values'];
    for (var i = 0; i < data.length; i++) {
        if (data[i]['count'] > max) {
            max = data[i]['count'];
        }
    }
    return max;
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
    const n = data.length;
    const features = [];
    for (var i = 0; i < n; i++) {
        if (data[i]['count'] >= (1 / n)) {
            features.push(data[i]['category']);
        }
        else {
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
    for (var i = 0; i <= legendAttributes.length; i++) {
        if (legendAttributes[i] !== undefined && legendAttributes[i]['show']) {
            pcol.push(legendAttributes[i]['feature']);
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
    // turn into array of dicts
    const ret = [];
    for (var i = 0; i < rows.length; i++) {
        ret.push(createData(rows[i][0], rows[i][1], rows[i][2], rows[i][3]));
    }
    // sort rows by score
    ret.sort(sortByScore);
    return ret;
}
function getTable(vectors, aggregation, legendAttributes, dataset) {
    const classes = useStyles();
    const rows = genRows(vectors, aggregation, legendAttributes, dataset);
    return (React.createElement("div", { style: { width: "100%", maxHeight: '100%', overflowY: "scroll" } },
        React.createElement("div", { style: {
                width: "100%",
            } },
            React.createElement(material_1.Table, { className: classes.table, "aria-label": "simple table", size: 'small' },
                React.createElement(material_1.TableHead, null),
                React.createElement(material_1.TableBody, null, rows.map((row) => (React.createElement(material_1.TableRow, { className: classes.tableRow, key: row.feature },
                    React.createElement(material_1.TableCell, { component: "th", scope: "row" },
                        React.createElement("div", { style: { maxWidth: 200 } },
                            row.feature,
                            React.createElement("br", null),
                            React.createElement("b", null, row.category))),
                    React.createElement(material_1.TableCell, null, row.char)))))))));
}
const mapState = (state) => {
    return ({
        legendAttributes: state.genericFingerprintAttributes,
        dataset: state.dataset
    });
};
const mapDispatch = dispatch => ({});
const connector = react_redux_1.connect(mapState, mapDispatch);
exports.CoralLegend = connector(({ selection, aggregate, legendAttributes, dataset }) => {
    return getTable(selection, aggregate, legendAttributes, dataset);
});
