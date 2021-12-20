"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const React = require("react");
const react_redux_1 = require("react-redux");
const GenericFingerprintAttributesDuck_1 = require("../../Ducks/GenericFingerprintAttributesDuck");
const HoverSettingsDuck_1 = require("../../Ducks/HoverSettingsDuck");
const HoverStateOrientationDuck_1 = require("../../Ducks/HoverStateOrientationDuck");
const SelectionClusters_1 = require("../../Overlays/SelectionClusters");
const VirtualTable_1 = require("../../UI/VirtualTable");
const AggregationDuck_1 = require("../../Ducks/AggregationDuck");
const mapStateToProps = (state) => {
    var _a;
    return ({
        hoverSettings: state.hoverSettings,
        currentAggregation: state.currentAggregation,
        dataset: state.dataset,
        hoverStateOrientation: state.hoverStateOrientation,
        activeStorybook: (_a = state.stories) === null || _a === void 0 ? void 0 : _a.stories[state.stories.active]
    });
};
const mapDispatchToProps = dispatch => ({
    setHoverWindowMode: value => dispatch(HoverSettingsDuck_1.setHoverWindowMode(value)),
    setAggregation: value => dispatch(AggregationDuck_1.selectVectors(value, false)),
    setHoverStateOrientation: value => dispatch(HoverStateOrientationDuck_1.setHoverStateOrientation(value))
});
const connector = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
exports.DetailsTabPanel = connector(({ hoverSettings, setHoverWindowMode, setAggregation, currentAggregation, dataset, hoverStateOrientation, setHoverStateOrientation, activeStorybook }) => {
    const handleChange = (_, value) => {
        setHoverWindowMode(value ? HoverSettingsDuck_1.WindowMode.Extern : HoverSettingsDuck_1.WindowMode.Embedded);
    };
    return React.createElement("div", { style: { display: 'flex', flexDirection: 'column', height: '100%', paddingBottom: 1 } },
        React.createElement(material_1.Box, { paddingX: 2, paddingTop: 1 }, currentAggregation.selectedClusters && currentAggregation.selectedClusters.length > 0 ?
            React.createElement(material_1.Typography, { color: "textSecondary", variant: "body2" },
                "Selected ",
                React.createElement("b", null, currentAggregation.selectedClusters.length),
                " out of ",
                React.createElement("b", null, activeStorybook === null || activeStorybook === void 0 ? void 0 : activeStorybook.clusters.allIds.length),
                " groups")
            : React.createElement(material_1.Typography, { color: "textSecondary", variant: "body2" },
                "Selected ",
                React.createElement("b", null, currentAggregation.aggregation.length),
                " out of ",
                React.createElement("b", null, dataset === null || dataset === void 0 ? void 0 : dataset.vectors.length),
                " items")),
        React.createElement(material_1.Box, { paddingX: 2, paddingTop: 1 },
            React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { color: "primary", checked: hoverSettings.windowMode == HoverSettingsDuck_1.WindowMode.Extern, onChange: handleChange, name: "checkedA" }), label: "External Summary" })),
        React.createElement(material_1.Box, { paddingX: 2, paddingTop: 1 },
            React.createElement(material_1.Button, { variant: "outlined", style: { width: '100%' }, onClick: () => { setAggregation([]); } }, "Clear Selection")),
        React.createElement(material_1.Box, { paddingX: 2, paddingTop: 1 },
            React.createElement(AttributeTable, null)),
        React.createElement(material_1.Box, { paddingX: 2, paddingTop: 1 },
            React.createElement("div", { style: { width: '100%' } },
                React.createElement(material_1.FormControl, { style: { width: '100%' } },
                    React.createElement(material_1.FormHelperText, null, "Hover Position"),
                    React.createElement(material_1.Select, { displayEmpty: true, size: 'small', value: hoverStateOrientation, onChange: (event) => {
                            setHoverStateOrientation(event.target.value);
                        } },
                        React.createElement(material_1.MenuItem, { value: HoverStateOrientationDuck_1.HoverStateOrientation.NorthEast }, "North East"),
                        React.createElement(material_1.MenuItem, { value: HoverStateOrientationDuck_1.HoverStateOrientation.SouthWest }, "South West"))))),
        React.createElement(material_1.Box, { paddingY: 2 },
            React.createElement(material_1.Divider, { orientation: "horizontal" })),
        React.createElement(SelectionClusters_1.SelectionClusters, null));
});
const attributeConnector = react_redux_1.connect((state) => ({
    genericFingerprintAttributes: state.genericFingerprintAttributes
}), dispatch => ({
    setGenericFingerprintAttributes: genericFingerprintAttributes => dispatch(GenericFingerprintAttributesDuck_1.setGenericFingerprintAttributes(genericFingerprintAttributes)),
}), null, { forwardRef: true });
const AttributeTable = attributeConnector(({ genericFingerprintAttributes, setGenericFingerprintAttributes }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const fingerprintAttributes = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setGenericFingerprintAttributes([...localAttributes]);
    };
    const [localAttributes, setLocalAttributes] = React.useState([]);
    React.useEffect(() => {
        setLocalAttributes(genericFingerprintAttributes);
    }, [genericFingerprintAttributes]);
    const booleanRenderer = (row) => {
        return React.createElement(material_1.Checkbox, { color: "primary", disableRipple: true, checked: row['show'], onChange: (event) => {
                row['show'] = event.target.checked;
                setLocalAttributes([...localAttributes]);
            } });
    };
    return React.createElement("div", null,
        React.createElement(material_1.Button, { style: { width: '100%' }, variant: "outlined", onClick: fingerprintAttributes }, "Summary Attributes"),
        React.createElement(material_1.Popover, { open: Boolean(anchorEl), anchorEl: anchorEl, onClose: handleClose, anchorOrigin: {
                vertical: 'bottom',
                horizontal: 'center',
            }, transformOrigin: {
                vertical: 'top',
                horizontal: 'center',
            } },
            React.createElement(material_1.Box, { margin: 2 },
                React.createElement(VirtualTable_1.VirtualTable, { rows: localAttributes, rowHeight: 42, tableHeight: 300 },
                    React.createElement(VirtualTable_1.VirtualColumn, { width: 300, name: "Feature", renderer: (row) => strrenderer("feature", row) }),
                    React.createElement(VirtualTable_1.VirtualColumn, { width: 50, name: "Show", renderer: (row) => booleanRenderer(row) })))));
});
const strrenderer = (name, row) => {
    return React.createElement(React.Fragment, null, row[name]);
};
