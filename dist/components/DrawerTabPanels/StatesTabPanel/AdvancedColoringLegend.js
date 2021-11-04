"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const Mapping_1 = require("../../Utility/Colors/Mapping");
const React = require("react");
const material_1 = require("@mui/material");
const AdvancedColoringSelectionDuck_1 = require("../../Ducks/AdvancedColoringSelectionDuck");
const mapStateToProps = state => ({
    advancedColoringSelection: state.advancedColoringSelection,
    mapping: state.pointColorMapping
});
const mapDispatchToProps = dispatch => ({
    setAdvancedColoringSelection: advancedColoringSelection => dispatch(AdvancedColoringSelectionDuck_1.setAdvancedColoringSelectionAction(advancedColoringSelection))
});
exports.AdvancedColoringLegendFull = ({ mapping, advancedColoringSelection, setAdvancedColoringSelection }) => {
    if (mapping == undefined || mapping == null) {
        return React.createElement("div", null);
    }
    if (mapping instanceof Mapping_1.DiscreteMapping) {
        return React.createElement(material_1.Grid, { container: true, direction: "column", style: { padding: '12px 0px', minWidth: 300 } }, mapping.values.map((value, index) => {
            var color = mapping.map(value);
            return React.createElement(material_1.FormControlLabel, { key: index, style: { margin: '0 8px' }, control: React.createElement(material_1.Checkbox, { style: { padding: '3px 9px' }, disableRipple: true, color: "primary", size: 'small', checked: advancedColoringSelection[index], onChange: (event) => {
                        var values = advancedColoringSelection.splice(0);
                        values[event.target.value] = event.target.checked;
                        setAdvancedColoringSelection(values);
                    }, value: index }), label: React.createElement(material_1.Typography, { style: { color: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})` } }, toLabel(value)) });
        }));
    }
    return React.createElement("div", null);
};
function toLabel(value) {
    if (value === '') {
        return '<Empty String>';
    }
    if (value === null) {
        return '<Null>';
    }
    if (value === undefined) {
        return '<Undefined>';
    }
    return value;
}
exports.AdvancedColoringLegend = react_redux_1.connect(mapStateToProps, mapDispatchToProps)(exports.AdvancedColoringLegendFull);
