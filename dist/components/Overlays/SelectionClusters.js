"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_1 = require("@mui/material");
const Generic_1 = require("../legends/Generic");
const react_redux_1 = require("react-redux");
const ReactDOM = require("react-dom");
const HoverSettingsDuck_1 = require("../Ducks/HoverSettingsDuck");
const WindowPortal_1 = require("./WindowPortal");
const Vector_1 = require("../../model/Vector");
function HoverItemPortal(props) {
    return ReactDOM.createPortal(props.children, document.getElementById("HoverItemDiv"));
}
const mapStateToProps = (state) => ({
    currentAggregation: state.currentAggregation,
    hoverState: state.hoverState,
    dataset: state.dataset,
    hoverSettings: state.hoverSettings,
});
const mapDispatchToProps = dispatch => ({
    setHoverWindowMode: value => dispatch(HoverSettingsDuck_1.setHoverWindowMode(value)),
});
const connector = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
const SelectionClustersFull = function ({ dataset, currentAggregation, hoverState, hoverSettings, setHoverWindowMode }) {
    if (!dataset) {
        return null;
    }
    const [vectors, setVectors] = React.useState(currentAggregation.aggregation.map(i => dataset.vectors[i]));
    React.useEffect(() => {
        setVectors(currentAggregation.aggregation.map(i => dataset.vectors[i]));
    }, [currentAggregation]);
    const genericAggregateLegend = currentAggregation.aggregation && currentAggregation.aggregation.length > 0 ?
        React.createElement(Generic_1.GenericLegend, { aggregate: true, type: dataset.type, vectors: vectors }) :
        React.createElement(material_1.Box, { paddingLeft: 2 },
            React.createElement(material_1.Typography, { color: "textSecondary" }, "Select Points in the Embedding Space to show a Summary Visualization."));
    return React.createElement("div", { style: {
            width: '18rem',
            height: '100px',
            flex: '1 1 auto'
        } },
        hoverState && hoverState.data && Vector_1.isVector(hoverState.data) && React.createElement(HoverItemPortal, null,
            React.createElement(material_1.Card, { elevation: 24, style: {
                    width: 300,
                    maxHeight: '50vh',
                    minHeight: 300,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                } },
                React.createElement(Generic_1.GenericLegend, { aggregate: false, type: dataset.type, vectors: [hoverState.data] }))),
        hoverSettings.windowMode == HoverSettingsDuck_1.WindowMode.Extern ?
            React.createElement(WindowPortal_1.MyWindowPortal, { onClose: () => {
                    setHoverWindowMode(HoverSettingsDuck_1.WindowMode.Embedded);
                } },
                React.createElement("div", { className: "portalSummary", style: { display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' } }, genericAggregateLegend))
            :
                React.createElement("div", { style: {
                        display: 'flex',
                        flexShrink: 0,
                        justifyContent: 'center',
                        height: '100%'
                    } }, genericAggregateLegend));
};
exports.SelectionClusters = connector(SelectionClustersFull);
