"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_1 = require("@mui/material");
const react_redux_1 = require("react-redux");
const GlobalPointBrightnessDuck_1 = require("../../Ducks/GlobalPointBrightnessDuck");
const styles_1 = require("@mui/styles");
const useStyles = styles_1.makeStyles(theme => ({
    root: {
        margin: '0px 16px',
        padding: '0px 8px'
    },
}));
const BrightnessSliderFull = ({ brightnessScale, setRange }) => {
    const classes = useStyles();
    const marks = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 0.25,
            label: `0.25`,
        },
        {
            value: 0.5,
            label: `0.5`,
        },
        {
            value: 0.75,
            label: `0.75`,
        },
        {
            value: 1,
            label: `1`,
        }
    ];
    return React.createElement("div", { className: classes.root },
        React.createElement(material_1.Typography, { id: "range-slider", gutterBottom: true }, "Brightness Scale"),
        React.createElement(material_1.Slider, { min: 0, max: 1, value: brightnessScale, onChange: (_, newValue) => setRange(newValue), step: 0.05, marks: marks, valueLabelDisplay: "auto" }));
};
const mapStateToProps = (state) => ({
    brightnessScale: state.globalPointBrightness
});
const mapDispatchToProps = dispatch => ({
    setRange: value => dispatch(GlobalPointBrightnessDuck_1.setGlobalPointBrightness(value))
});
exports.BrightnessSlider = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(BrightnessSliderFull);
