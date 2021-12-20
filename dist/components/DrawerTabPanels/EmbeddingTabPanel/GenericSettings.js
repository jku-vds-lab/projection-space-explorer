"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const material_1 = require("@mui/material");
const React = require("react");
const react_redux_1 = require("react-redux");
const FeaturePicker_1 = require("./FeaturePicker");
const clone = require("fast-clone");
const mapState = (state) => ({
    projectionColumns: state.projectionColumns
});
const mapDispatch = dispatch => ({});
const connector = react_redux_1.connect(mapState, mapDispatch);
const TSNESettings = ({ learningRate, setLearningRate, perplexity, setPerplexity }) => {
    return React.createElement(material_1.FormGroup, null,
        React.createElement(material_1.TextField, { size: 'small', id: "textPerplexity", label: "Perplexity", type: "number", value: perplexity, onChange: (event) => {
                setPerplexity(event.target.value);
            } }),
        React.createElement(material_1.TextField, { size: 'small', id: "textLearningRate", label: "Learning Rate", type: "number", value: learningRate, onChange: (event) => {
                setLearningRate(event.target.value);
            } }));
};
const UMAPSettings = ({ nNeighbors, setNNeighbors }) => {
    return React.createElement(material_1.FormGroup, null,
        React.createElement(material_1.TextField, { size: 'small', id: "textNNeighbors", label: "n Neighbors", type: "number", value: nNeighbors, onChange: (event) => {
                setNNeighbors(event.target.value);
            } }));
};
const GenericSettingsComp = ({ domainSettings, open, onClose, onStart, projectionParams, projectionColumns }) => {
    const [perplexity, setPerplexity] = React.useState(projectionParams.perplexity);
    const [learningRate, setLearningRate] = React.useState(projectionParams.learningRate);
    const [nNeighbors, setNNeighbors] = React.useState(projectionParams.nNeighbors);
    const [iterations, setIterations] = React.useState(projectionParams.iterations);
    const [seeded, setSeeded] = React.useState(projectionParams.seeded);
    const [useSelection, setUseSelection] = React.useState(projectionParams.useSelection);
    const [distanceMetric, setDistanceMetric] = React.useState(projectionParams.distanceMetric);
    const cloneColumns = (projectionColumns) => {
        return projectionColumns.map(val => {
            return clone(val);
        });
    };
    const [selection, setSelection] = React.useState(cloneColumns(projectionColumns));
    React.useEffect(() => {
        if (open) {
            setSelection(cloneColumns(projectionColumns));
        }
    }, [projectionColumns, open]);
    return React.createElement(material_1.Dialog, { maxWidth: 'lg', open: open, onClose: onClose },
        React.createElement(material_1.DialogContent, null,
            React.createElement(material_1.Container, null,
                domainSettings != 'forceatlas2' && React.createElement(FeaturePicker_1.default, { selection: selection, setSelection: setSelection }),
                React.createElement(material_1.Grid, { container: true, justifyContent: "center", style: { width: '100%' }, spacing: 3 },
                    React.createElement(material_1.Grid, { item: true },
                        React.createElement(material_1.FormControl, null,
                            React.createElement(material_1.FormLabel, { component: "legend" }, "Projection Parameters"),
                            domainSettings == 'umap' && React.createElement(UMAPSettings, { nNeighbors: nNeighbors, setNNeighbors: setNNeighbors }),
                            domainSettings == 'tsne' && React.createElement(TSNESettings, { learningRate: learningRate, setLearningRate: setLearningRate, perplexity: perplexity, setPerplexity: setPerplexity }))),
                    React.createElement(material_1.Grid, { item: true },
                        React.createElement(material_1.FormControl, null,
                            React.createElement(material_1.FormLabel, { component: "legend" }, "General Parameters"),
                            React.createElement(material_1.FormGroup, null,
                                React.createElement(material_1.TextField, { size: 'small', id: "textIterations", label: "Iterations", type: "number", value: iterations, onChange: (event) => {
                                        setIterations(event.target.value);
                                    } }),
                                React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Checkbox, { color: "primary", checked: seeded, onChange: (_, checked) => setSeeded(checked), name: "jason" }), label: "Seed Position" }),
                                React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Checkbox, { color: "primary", checked: useSelection, onChange: (_, checked) => setUseSelection(checked) }), label: "Project Selection Only" }),
                                (domainSettings == 'tsne' || domainSettings == 'umap') && React.createElement(material_1.FormControl, null,
                                    React.createElement(material_1.FormHelperText, null, "Distance Metric"),
                                    React.createElement(material_1.Select, { displayEmpty: true, size: 'small', id: "demo-controlled-open-select", value: distanceMetric, onChange: (event) => { setDistanceMetric(event.target.value); } },
                                        React.createElement(material_1.MenuItem, { value: 'euclidean' }, "Euclidean"),
                                        React.createElement(material_1.MenuItem, { value: 'jaccard' }, "Jaccard"))))))))),
        React.createElement(material_1.DialogActions, null,
            React.createElement(material_1.Button, { color: "primary", onClick: onClose }, "Cancel"),
            React.createElement(material_1.Button, { color: "primary", onClick: () => {
                    onStart({
                        iterations: iterations,
                        perplexity: perplexity,
                        learningRate: learningRate,
                        seeded: seeded,
                        nNeighbors: nNeighbors,
                        method: domainSettings,
                        useSelection: useSelection,
                        distanceMetric: distanceMetric
                    }, selection);
                } }, "Start")));
};
exports.GenericSettings = connector(GenericSettingsComp);
