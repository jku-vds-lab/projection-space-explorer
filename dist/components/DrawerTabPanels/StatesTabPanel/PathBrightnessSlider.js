"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_1 = require("@mui/material");
const react_redux_1 = require("react-redux");
const LineBrightnessDuck_1 = require("../../Ducks/LineBrightnessDuck");
const PathBrightnessSliderFull = ({ lineBrightness, setLineBrightness }) => {
    const marks = [
        {
            value: 0,
            label: "0%",
        },
        {
            value: 50,
            label: "50%",
        },
        {
            value: 100,
            label: "100%",
        },
    ];
    return React.createElement("div", { style: { margin: '0 16px', padding: '0 8px' } },
        React.createElement(material_1.Typography, { id: "range-slider", gutterBottom: true }, "Line Opacity"),
        React.createElement(material_1.Slider, { min: 0, max: 100, step: 5, value: lineBrightness, onChange: (_, newValue) => {
                setLineBrightness(newValue);
            }, marks: marks, valueLabelDisplay: "auto" }));
};
const mapStateToProps = state => ({
    lineBrightness: state.lineBrightness
});
const mapDispatchToProps = dispatch => ({
    setLineBrightness: lineBrightness => dispatch(LineBrightnessDuck_1.setLineBrightness(lineBrightness))
});
exports.PathBrightnessSlider = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(PathBrightnessSliderFull);
