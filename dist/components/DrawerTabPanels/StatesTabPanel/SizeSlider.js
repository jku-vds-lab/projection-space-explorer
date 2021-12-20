"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_1 = require("@mui/material");
const react_redux_1 = require("react-redux");
const GlobalPointSizeDuck_1 = require("../../Ducks/GlobalPointSizeDuck");
const SizeSliderFull = ({ sizeScale, setRange }) => {
    const marks = [
        {
            value: 0,
            label: '0',
        },
        {
            value: 1,
            label: `1`,
        },
        {
            value: 2,
            label: `2`,
        },
        {
            value: 3,
            label: `3`,
        },
        {
            value: 4,
            label: `4`,
        },
        {
            value: 5,
            label: `5`,
        },
    ];
    return React.createElement("div", { style: {
            margin: '0px 16px',
            padding: '0px 8px'
        } },
        React.createElement(material_1.Typography, { id: "range-slider", gutterBottom: true }, "Size Scale"),
        React.createElement(material_1.Slider, { min: 0, max: 5, value: sizeScale, onChange: (_, newValue) => setRange(newValue), step: 0.25, marks: marks, valueLabelDisplay: "auto" }));
};
/**
 *
 * @param state                 sizeScale={this.state.vectorBySize.values.range}
                onChange={(e, newVal) => {
                  if (arraysEqual(newVal, this.state.vectorBySize.values.range)) {
                    return;
                  }

                  this.state.vectorBySize.values.range = newVal

                  this.setState({
                    vectorBySize: this.state.vectorBySize
                  })

                  if (this.state.vectorBySize != null) {
                    this.threeRef.current.particles.sizeCat(this.state.vectorBySize)
                    this.threeRef.current.particles.updateSize()
                  }
                }}
 */
const mapStateToProps = state => ({
    sizeScale: state.globalPointSize
});
const mapDispatchToProps = dispatch => ({
    setRange: value => dispatch(GlobalPointSizeDuck_1.setGlobalPointSize(value))
});
exports.SizeSlider = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(SizeSliderFull);
