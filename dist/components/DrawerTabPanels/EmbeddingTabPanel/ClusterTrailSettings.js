"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const React = require("react");
const react_redux_1 = require("react-redux");
const TrailSettingsDuck_1 = require("../../Ducks/TrailSettingsDuck");
const mapStateToProps = (state) => ({
    trailSettings: state.trailSettings
});
const mapDispatchToProps = dispatch => ({
    setTrailVisibility: visibility => dispatch(TrailSettingsDuck_1.setTrailVisibility(visibility)),
    setTrailLength: length => dispatch(TrailSettingsDuck_1.setTrailLength(length))
});
const connector = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
exports.ClusterTrailSettings = connector(({ trailSettings, setTrailVisibility, setTrailLength }) => {
    return React.createElement(material_1.FormGroup, null,
        React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { color: "primary", checked: trailSettings.show, onChange: (_, newVal) => setTrailVisibility(newVal), name: "jason" }), label: "Show Group Trail" }),
        React.createElement(material_1.Typography, { id: "discrete-slider", gutterBottom: true }, "Trail Length"),
        React.createElement(material_1.Slider, { value: trailSettings.length, "aria-labelledby": "discrete-slider", valueLabelDisplay: "auto", step: 5, marks: true, min: 10, max: 100, onChange: (_, newVal) => {
                setTrailLength(newVal);
            } }));
});
