"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const styles_1 = require("@mui/styles");
const CountryCodes_1 = require("../../../components/Utility/CountryCodes");
const styles_2 = require("@mui/styles");
const React = require("react");
const theme = material_1.createTheme({
    typography: {
        subtitle1: {
            fontSize: 11,
        }
    },
});
const HEIGHT = 32;
const WIDTH = 44;
const useStyles = styles_1.makeStyles({
    table: {
        width: WIDTH * 6,
        height: HEIGHT * 6,
        borderCollapse: 'collapse',
        tableLayout: 'fixed'
    },
    smalltable: {
        width: WIDTH * 6,
        borderCollapse: 'collapse',
        tableLayout: 'fixed'
    },
    textcell: {
        height: HEIGHT,
        margin: '0',
        padding: '0',
        border: '0px'
    },
    rowtextcell: {
        height: HEIGHT,
        margin: '0',
        padding: '0 15px 0 0',
        border: '0px'
    },
    cell: {
        width: WIDTH,
        height: HEIGHT,
        background: '#70AD47',
        margin: '0',
        padding: '0',
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: '#D9D9D9'
    },
    nocell: {
        width: WIDTH,
        height: HEIGHT,
        margin: '0',
        padding: '0',
        border: '1px solid black',
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: '#D9D9D9'
    },
    oldcell: {
        width: WIDTH,
        height: HEIGHT,
        margin: '0',
        padding: '0',
        background: '#D9D9D9',
        borderWidth: '1px',
        borderStyle: 'dashed',
        borderColor: '#D9D9D9'
    }
});
exports.YearAggComp = ({ selection }) => {
    var lineStart = 20;
    var lineEnd = 232 - 20;
    if (selection == null || selection == undefined || selection.length == 0) {
        return React.createElement("svg", { width: "232", height: "76", viewBox: "0 0 232 76" },
            React.createElement("line", { x1: lineStart, y1: "38", x2: lineEnd, y2: "38", stroke: "black" }));
    }
    var years = [...new Set(selection.map(value => value.new_year))];
    years.sort();
    var count = years.map(year => selection.filter(s => s.new_year == year).length);
    var max = Math.max(...count);
    var segmentWidth = 14;
    return React.createElement("svg", { width: "232", height: "76", viewBox: "0 0 232 76" },
        React.createElement("line", { x1: lineStart, y1: "38", x2: lineEnd, y2: "38", stroke: "black" }),
        years.map((year, i) => {
            var startX = ((lineEnd - lineStart) / 2) - ((segmentWidth * years.length) / 2);
            var newX = startX + i * segmentWidth;
            return React.createElement("text", { fontSize: "12", transform: `rotate(45, ${newX}, ${48})`, x: newX, y: 46 }, year);
        }),
        years.map((year, i) => {
            var startX = ((lineEnd - lineStart) / 2) - ((segmentWidth * years.length) / 2);
            var newX = startX + i * segmentWidth;
            var h = ((count[i] / max) * 30) + 2;
            return React.createElement("rect", { strokeWidth: 1, x: newX, y: 38 - h, width: 10, height: h });
        }));
};
exports.YearComp = ({ oldYear, newYear }) => {
    var lineStart = 60;
    var lineEnd = 232 - 60;
    var oldX = lineStart + (lineEnd - lineStart) * ((oldYear - 1800) / 215);
    var newX = lineStart + (lineEnd - lineStart) * ((newYear - 1800) / 215);
    return React.createElement("svg", { width: "232", height: "76", viewBox: "0 0 232 76" },
        React.createElement("line", { x1: lineStart, y1: "48", x2: lineEnd, y2: "48", stroke: "black" }),
        React.createElement("circle", { cx: newX, cy: "48", r: "14", stroke: "black", strokeWidth: "1", fill: "#70AD47" }),
        React.createElement("circle", { cx: oldX, cy: "48", r: "10", stroke: "black", strokeWidth: "1", fill: "#D9D9D9" }),
        React.createElement("text", { x: newX, y: "20", fontSize: "14", textAnchor: "middle", fill: "#70AD47" }, newYear),
        React.createElement("text", { x: oldX, y: "32", fontSize: "14", textAnchor: "middle", fill: "#D9D9D9" }, oldYear),
        React.createElement("text", { x: "38", y: "52", fontSize: "14", textAnchor: "end" }, "1800"),
        React.createElement("text", { x: "190", y: "52", fontSize: "14" }, "2015"));
};
function parseCountries(countries) {
    if (countries == null)
        return [];
    try {
        var replaced = countries.replace(/'/g, '"').replace(/;/g, ',');
        var parsed = JSON.parse(`{ "result": ${replaced} }`);
        if (parsed == null) {
            return [];
        }
        else {
            return parsed.result;
        }
    }
    catch (e) {
        return ['error'];
    }
}
exports.StoryLegend = ({ selection }) => {
    if (selection == null) {
        return React.createElement("div", null);
    }
    var vertical = ["gdp", "child_mortality", "fertility", "life_expect", "population"];
    var horizontal = ["x", "y", "size"];
    var countryArray = selection.flatMap(s => parseCountries(s.new_country));
    var countryCounts = {};
    countryArray.forEach(country => {
        countryCounts[country] = countryCounts[country] ? countryCounts[country] + 1 : 1;
    });
    var allCountries = [...new Set(countryArray)];
    allCountries.sort((a, b) => {
        return countryCounts[b] - countryCounts[a];
    });
    const classes = useStyles();
    return React.createElement(styles_2.ThemeProvider, { theme: theme },
        React.createElement(material_1.Grid, { container: true, style: { background: 'white' }, alignItems: "center", direction: "column" },
            React.createElement(material_1.Table, { className: classes.table },
                React.createElement(material_1.TableBody, null,
                    React.createElement(material_1.TableRow, null,
                        React.createElement(material_1.TableCell, { className: classes.textcell, style: { width: 2 * WIDTH } }),
                        React.createElement(material_1.TableCell, { className: classes.textcell, align: "center" },
                            React.createElement(material_1.Typography, { variant: 'subtitle2' }, "X")),
                        React.createElement(material_1.TableCell, { className: classes.textcell, align: "center" },
                            React.createElement(material_1.Typography, { variant: 'subtitle2' }, "Y")),
                        React.createElement(material_1.TableCell, { className: classes.textcell, align: "center" },
                            React.createElement(material_1.Typography, { variant: 'subtitle2' }, "Size")),
                        React.createElement(material_1.TableCell, { className: classes.textcell, align: "center" },
                            React.createElement(material_1.Typography, { variant: 'subtitle2' }, "Color"))),
                    selection.length == 1 ?
                        vertical.map(row => {
                            var selectionState = selection[0];
                            return React.createElement(material_1.TableRow, { key: row },
                                React.createElement(material_1.TableCell, { key: `text${row}`, className: classes.rowtextcell, align: "right" },
                                    React.createElement(material_1.Typography, { variant: 'subtitle1' }, row)),
                                horizontal.map(col => {
                                    var newVal = selectionState[`new_${col}`];
                                    var oldVal = selectionState[`old_${col}`];
                                    if (newVal == row) {
                                        return React.createElement(material_1.TableCell, { key: `text${row}${col}`, className: classes.cell, align: "right" });
                                    }
                                    else if (newVal != oldVal && oldVal == row) {
                                        return React.createElement(material_1.TableCell, { key: `text${row}${col}`, className: classes.oldcell, align: "right" });
                                    }
                                    else {
                                        return React.createElement(material_1.TableCell, { key: `text${row}${col}`, className: classes.nocell, align: "right" });
                                    }
                                }));
                        })
                        :
                            vertical.map(row => {
                                return React.createElement(material_1.TableRow, { key: row },
                                    React.createElement(material_1.TableCell, { className: classes.rowtextcell, align: "right" },
                                        React.createElement(material_1.Typography, { variant: 'subtitle1' }, row)),
                                    horizontal.map(col => {
                                        // col is x, y, size
                                        // row is child_mortality... fertility
                                        var percent = selection.length > 0 ? selection.filter(value => value[`new_${col}`] == row).length / selection.length : 0;
                                        var W = WIDTH - 2;
                                        var H = HEIGHT - 2;
                                        var A = W * H;
                                        var A2 = (W * H) * percent;
                                        return React.createElement(material_1.TableCell, { key: `${row}${col}`, className: classes.nocell, align: "right" },
                                            React.createElement(material_1.Grid, { alignItems: "center", justifyContent: "center", direction: "column", container: true },
                                                React.createElement(material_1.Grid, { item: true },
                                                    React.createElement("div", { style: {
                                                            background: '#70AD47',
                                                            width: Math.sqrt(((A / (A / A2)) * W) / H),
                                                            height: Math.sqrt(((A / (A / A2)) * H) / W)
                                                        } }))));
                                    }));
                            }))),
            React.createElement(material_1.Divider, { style: { margin: '4px 0px', width: WIDTH * 4 } }),
            React.createElement(material_1.Table, { className: classes.smalltable },
                React.createElement(material_1.TableBody, null,
                    React.createElement(material_1.TableRow, null,
                        React.createElement(material_1.TableCell, { className: classes.rowtextcell, style: { width: 2 * WIDTH }, align: "right" },
                            React.createElement(material_1.Typography, { variant: 'subtitle1' }, "Continent")),
                        React.createElement(material_1.TableCell, { className: classes.nocell }),
                        React.createElement(material_1.TableCell, { className: classes.nocell }),
                        React.createElement(material_1.TableCell, { className: classes.nocell }),
                        React.createElement(SubColor, { selection: selection, row: 'continent' })),
                    React.createElement(material_1.TableRow, null,
                        React.createElement(material_1.TableCell, { className: classes.rowtextcell, style: { width: 2 * WIDTH }, align: "right" },
                            React.createElement(material_1.Typography, { variant: 'subtitle1' }, "Religion")),
                        React.createElement(material_1.TableCell, { className: classes.nocell }),
                        React.createElement(material_1.TableCell, { className: classes.nocell }),
                        React.createElement(material_1.TableCell, { className: classes.nocell }),
                        React.createElement(SubColor, { selection: selection, row: 'main_religion' })))),
            selection.length == 1 ?
                React.createElement(exports.YearComp, { oldYear: selection[0].old_year, newYear: selection[0].new_year })
                :
                    React.createElement(exports.YearAggComp, { selection: selection }),
            React.createElement(material_1.Grid, { item: true, style: { height: 32 } }, selection.length == 1 ?
                React.createElement(Countries, { countries: parseCountries(selection[0].new_country), countryCounts: countryCounts })
                : React.createElement(Countries, { countries: allCountries, countryCounts: countryCounts }))));
};
var SubColor = ({ selection, row }) => {
    const classes = useStyles();
    if (selection.length == 1) {
        var selectionState = selection[0];
        var newVal = selectionState[`new_color`];
        var oldVal = selectionState[`old_color`];
        if (newVal == row) {
            return React.createElement(material_1.TableCell, { className: classes.cell, align: "right" });
        }
        else if (newVal != oldVal && oldVal == row) {
            return React.createElement(material_1.TableCell, { className: classes.oldcell, align: "right" });
        }
        else {
            return React.createElement(material_1.TableCell, { className: classes.nocell, align: "right" });
        }
    }
    else {
        var percent = selection.length > 0 ? selection.filter(value => value[`new_color`] == row).length / selection.length : 0;
        var W = WIDTH - 2;
        var H = HEIGHT - 2;
        var A = W * H;
        var A2 = (W * H) * percent;
        return React.createElement(material_1.TableCell, { className: classes.nocell, align: "right" },
            React.createElement(material_1.Grid, { container: true, justifyContent: "center", direction: "column", alignItems: "center" },
                React.createElement(material_1.Grid, { item: true },
                    React.createElement("div", { style: {
                            background: '#70AD47',
                            width: Math.sqrt(((A / (A / A2)) * W) / H),
                            height: Math.sqrt(((A / (A / A2)) * H) / W)
                        } }))));
    }
};
var Countries = ({ countries, countryCounts }) => {
    if (countries == null || countries == undefined)
        return React.createElement("div", null);
    var countrySum = 0;
    Object.keys(countryCounts).forEach(key => {
        if (countryCounts[key] > countrySum) {
            countrySum = countryCounts[key];
        }
    });
    return countries.map(countryName => {
        return React.createElement("img", { title: `${countryName} : ${countryCounts[countryName]}`, src: "img/flags/flags-iso/shiny/24/" + CountryCodes_1.getCountryCode(countryName) + ".png", style: { opacity: countryCounts[countryName] / countrySum } });
    });
};
