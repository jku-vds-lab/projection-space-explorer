"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_1 = require("@mui/material");
const react_redux_1 = require("react-redux");
const PathLengthRange_1 = require("../../Ducks/PathLengthRange");
exports.PathLengthFilterFull = ({ pathLengthRange, setPathLengthRange }) => {
    if (pathLengthRange == null) {
        return React.createElement("div", null);
    }
    const marks = [
        {
            value: 0,
            label: '0',
        },
        {
            value: pathLengthRange.maximum,
            label: `${pathLengthRange.maximum}`,
        },
    ];
    return React.createElement("div", { style: { margin: '0 16px', padding: '0 8px' } },
        React.createElement(material_1.Typography, { id: "range-slider", gutterBottom: true }, "Path Length Filter"),
        React.createElement(material_1.Slider, { min: 0, max: pathLengthRange.maximum, value: pathLengthRange.range, onChange: (_, newValue) => {
                setPathLengthRange(newValue);
            }, marks: marks, valueLabelDisplay: "auto" }));
};
const mapStateToProps = state => ({
    pathLengthRange: state.pathLengthRange
});
const mapDispatchToProps = dispatch => ({
    setPathLengthRange: pathLengthRange => dispatch(PathLengthRange_1.setPathLengthRange(pathLengthRange))
});
exports.PathLengthFilter = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(exports.PathLengthFilterFull);
