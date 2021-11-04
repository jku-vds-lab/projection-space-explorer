"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_1 = require("@mui/material");
const react_redux_1 = require("react-redux");
const DifferenceThresholdDuck_1 = require("../../../components/Ducks/DifferenceThresholdDuck");
class simpleSlider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: 0.25,
        };
        this.handleChange = (event, value) => {
            this.setState({ value });
        };
    }
    componentDidUpdate(prevProps) {
        if ((this.props.differenceThreshold !== prevProps.differenceThreshold) && this.props.differenceThreshold) {
            DifferenceThresholdDuck_1.setDifferenceThreshold(this.props.differenceThreshold);
            const value = this.props.differenceThreshold;
            this.setState({ value });
            this.render();
        }
    }
    render() {
        const { differenceThreshold, setDifferenceThreshold } = this.props;
        const { value } = this.state;
        const marks = [
            {
                value: 0,
                label: '0',
            },
            {
                value: 0.25,
                label: '0.25',
            },
            {
                value: 0.5,
                label: '0.5',
            },
            {
                value: 0.75,
                label: '0.75',
            },
            {
                value: 1,
                label: '1',
            },
        ];
        return (React.createElement("div", { style: { margin: '0 16px', padding: '0 8px' } },
            React.createElement(material_1.Typography, { id: "range-slider", align: "center" }, "Filter Threshold"),
            React.createElement(material_1.Slider, { value: value, min: 0.01, max: 1, step: 0.01, marks: marks, "aria-labelledby": "label", onChange: this.handleChange, onChangeCommitted: (_, newValue) => {
                    setDifferenceThreshold(newValue);
                } })));
    }
}
const mapStateToProps = state => ({
    differenceThreshold: state.differenceThreshold
});
const mapDispatchToProps = dispatch => ({
    setDifferenceThreshold: differenceThreshold => dispatch(DifferenceThresholdDuck_1.setDifferenceThreshold(differenceThreshold))
});
const connector = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
exports.DifferenceThresholdSlider = connector(simpleSlider);
