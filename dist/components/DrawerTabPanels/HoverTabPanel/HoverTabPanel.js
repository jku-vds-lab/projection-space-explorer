"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const React = require("react");
const react_redux_1 = require("react-redux");
const AggregationDuck_1 = require("../../Ducks/AggregationDuck");
const HoverSettingsDuck_1 = require("../../Ducks/HoverSettingsDuck");
const SelectionClusters_1 = require("../../Overlays/SelectionClusters");
const mapStateToProps = (state) => ({
    hoverSettings: state.hoverSettings,
    currentAggregation: state.currentAggregation,
    dataset: state.dataset
});
const mapDispatchToProps = dispatch => ({
    setHoverWindowMode: value => dispatch(HoverSettingsDuck_1.setHoverWindowMode(value)),
    setAggregation: value => dispatch(AggregationDuck_1.selectVectors(value))
});
const connector = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
exports.HoverTabPanel = connector(({ hoverSettings, setHoverWindowMode, setAggregation, currentAggregation, dataset }) => {
    const handleChange = (_, value) => {
        setHoverWindowMode(value ? HoverSettingsDuck_1.WindowMode.Extern : HoverSettingsDuck_1.WindowMode.Embedded);
    };
    return React.createElement("div", { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
        React.createElement(material_1.Box, { paddingLeft: 2, paddingTop: 2 },
            React.createElement(material_1.Typography, { color: "textSecondary", variant: "body2" },
                "Selected ",
                React.createElement("b", null, currentAggregation.aggregation.length),
                " out of ",
                React.createElement("b", null, dataset && dataset.vectors.length),
                " items"),
            React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { color: "primary", checked: hoverSettings.windowMode == HoverSettingsDuck_1.WindowMode.Extern, onChange: handleChange, name: "checkedA" }), label: "External Selection Summary" }),
            React.createElement(material_1.Button, { variant: "outlined", onClick: () => { setAggregation([]); } }, "Clear Selection")),
        React.createElement(SelectionClusters_1.SelectionClusters, null));
});
