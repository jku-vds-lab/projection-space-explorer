"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_redux_1 = require("react-redux");
const React = require("react");
const material_1 = require("@mui/material");
const ProjectionControlCard_1 = require("./ProjectionControlCard");
const ProjectionOpenDuck_1 = require("../../Ducks/ProjectionOpenDuck");
const ProjectionWorkerDuck_1 = require("../../Ducks/ProjectionWorkerDuck");
const GenericSettings_1 = require("./GenericSettings");
const ProjectionParamsDuck_1 = require("../../Ducks/ProjectionParamsDuck");
const ProjectionColumnsDuck_1 = require("../../Ducks/ProjectionColumnsDuck");
const TSNEEmbeddingController_1 = require("./TSNEEmbeddingController");
const UMAPEmbeddingController_1 = require("./UMAPEmbeddingController");
const ClusterTrailSettings_1 = require("./ClusterTrailSettings");
const TrailSettingsDuck_1 = require("../../Ducks/TrailSettingsDuck");
const ForceAtlas2EmbeddingController_1 = require("./ForceAtlas2EmbeddingController");
const Embedding_1 = require("../../../model/Embedding");
const Folder_1 = require("@mui/icons-material/Folder");
const Delete_1 = require("@mui/icons-material/Delete");
const ProjectionsDuck_1 = require("../../Ducks/ProjectionsDuck");
const mapStateToProps = (state) => ({
    currentAggregation: state.currentAggregation,
    stories: state.stories,
    projectionWorker: state.projectionWorker,
    projectionOpen: state.projectionOpen,
    dataset: state.dataset,
    projectionParams: state.projectionParams,
    projections: state.projections
});
const mapDispatchToProps = dispatch => ({
    setProjectionOpen: value => dispatch(ProjectionOpenDuck_1.setProjectionOpenAction(value)),
    setProjectionWorker: value => dispatch(ProjectionWorkerDuck_1.setProjectionWorkerAction(value)),
    setProjectionParams: value => dispatch(ProjectionParamsDuck_1.setProjectionParamsAction(value)),
    setProjectionColumns: value => dispatch(ProjectionColumnsDuck_1.setProjectionColumns(value)),
    setTrailVisibility: visibility => dispatch(TrailSettingsDuck_1.setTrailVisibility(visibility)),
    addProjection: embedding => dispatch(ProjectionsDuck_1.addProjectionAction(embedding)),
    deleteProjection: projection => dispatch(ProjectionsDuck_1.deleteProjectionAction(projection))
});
const connector = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
exports.EmbeddingTabPanel = connector((props) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    const [open, setOpen] = React.useState(false);
    const [domainSettings, setDomainSettings] = React.useState('');
    const [controller, setController] = React.useState(null);
    React.useEffect(() => {
        if (controller) {
            controller.terminate();
        }
        setController(null);
        props.setTrailVisibility(false);
    }, [props.dataset]);
    const onSaveProjectionClick = (name) => {
        props.addProjection(new Embedding_1.Embedding(props.dataset.vectors, "Created " + name));
    };
    const onProjectionClick = (projection) => {
        props.webGLView.current.loadProjection(projection);
    };
    const onDeleteProjectionClick = (projection) => {
        props.deleteProjection(projection);
    };
    return React.createElement("div", { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
        React.createElement(material_1.Box, { paddingLeft: 2, paddingTop: 2 },
            React.createElement(material_1.Typography, { variant: "subtitle2", gutterBottom: true }, 'Projection Methods')),
        React.createElement(material_1.Box, { paddingLeft: 2, paddingRight: 2 },
            React.createElement(material_1.Grid, { container: true, direction: "column", spacing: 1 },
                (((_c = (_b = (_a = props.config) === null || _a === void 0 ? void 0 : _a.disableEmbeddings) === null || _b === void 0 ? void 0 : _b.umap) !== null && _c !== void 0 ? _c : false) === false) &&
                    React.createElement(material_1.Grid, { item: true },
                        React.createElement(material_1.Button, { style: {
                                width: '100%'
                            }, variant: "outlined", onClick: () => {
                                setDomainSettings('umap');
                                setOpen(true);
                            } }, 'UMAP')),
                (((_f = (_e = (_d = props.config) === null || _d === void 0 ? void 0 : _d.disableEmbeddings) === null || _e === void 0 ? void 0 : _e.tsne) !== null && _f !== void 0 ? _f : false) === false) &&
                    React.createElement(material_1.Grid, { item: true },
                        React.createElement(material_1.Button, { style: {
                                width: '100%'
                            }, variant: "outlined", onClick: () => {
                                setDomainSettings('tsne');
                                setOpen(true);
                            } }, 't-SNE')),
                (((_j = (_h = (_g = props.config) === null || _g === void 0 ? void 0 : _g.disableEmbeddings) === null || _h === void 0 ? void 0 : _h.forceatlas) !== null && _j !== void 0 ? _j : false) === false) &&
                    React.createElement(material_1.Grid, { item: true },
                        React.createElement(material_1.Button, { style: {
                                width: '100%'
                            }, variant: "outlined", onClick: () => {
                                setDomainSettings('forceatlas2');
                                setOpen(true);
                            } }, 'ForceAtlas2')))),
        React.createElement(material_1.Box, { p: 1 },
            React.createElement(ProjectionControlCard_1.ProjectionControlCard, { controller: controller, onClose: () => {
                    if (controller) {
                        controller.terminate();
                    }
                    setController(null);
                    props.setTrailVisibility(false);
                }, onComputingChanged: (e, newVal) => {
                } })),
        React.createElement(GenericSettings_1.GenericSettings, { projectionParams: props.projectionParams, domainSettings: domainSettings, open: open, onClose: () => setOpen(false), onStart: (params, selection) => {
                const checked_sel = selection.filter(s => s.checked);
                if (checked_sel.length <= 0) {
                    alert("Select at least one feature.");
                    return;
                }
                setOpen(false);
                props.setProjectionColumns(selection);
                props.setProjectionParams(params);
                switch (domainSettings) {
                    case 'tsne': {
                        let controller = new TSNEEmbeddingController_1.TSNEEmbeddingController();
                        controller.init(props.dataset, selection, params);
                        controller.stepper = (Y) => {
                            props.dataset.vectors.forEach((vector, i) => {
                                vector.x = Y[i][0];
                                vector.y = Y[i][1];
                            });
                            props.webGLView.current.updateXY();
                            props.webGLView.current.repositionClusters();
                        };
                        setController(controller);
                        break;
                    }
                    case 'umap': {
                        let controller = new UMAPEmbeddingController_1.UMAPEmbeddingController();
                        let samples = params.useSelection ? props.currentAggregation.aggregation : props.dataset.vectors;
                        controller.init(props.dataset, selection, params, params.useSelection ? samples : undefined);
                        controller.stepper = (Y) => {
                            let source = controller.boundsY(Y);
                            let target = controller.targetBounds;
                            samples.forEach((sample, i) => {
                                if (controller.targetBounds) {
                                    sample.x = target.x + ((Y[i][0] - source.x) / source.width) * target.width;
                                    sample.y = target.y + ((Y[i][1] - source.y) / source.height) * target.height;
                                }
                                else {
                                    sample.x = Y[i][0];
                                    sample.y = Y[i][1];
                                }
                            });
                            props.webGLView.current.updateXY();
                            props.webGLView.current.repositionClusters();
                        };
                        setController(controller);
                        break;
                    }
                    case 'forceatlas2': {
                        let controller = new ForceAtlas2EmbeddingController_1.ForceAtlas2EmbeddingController();
                        controller.init(props.dataset, selection, params);
                        controller.stepper = (Y) => {
                            props.dataset.vectors.forEach((sample, i) => {
                                let idx = controller.nodes[sample.__meta__.duplicateOf].__meta__.meshIndex;
                                sample.x = Y[idx].x;
                                sample.y = Y[idx].y;
                            });
                            props.webGLView.current.updateXY();
                        };
                        setController(controller);
                        break;
                    }
                }
            } }),
        React.createElement(material_1.Box, { paddingLeft: 2, paddingTop: 2 },
            React.createElement(material_1.Typography, { variant: "subtitle2", gutterBottom: true }, 'Projection Settings')),
        React.createElement(material_1.Box, { paddingLeft: 2, paddingRight: 2 },
            React.createElement(ClusterTrailSettings_1.ClusterTrailSettings, null)),
        React.createElement(material_1.Box, { paddingLeft: 2, paddingTop: 2 },
            React.createElement(material_1.Typography, { variant: "subtitle2", gutterBottom: true }, 'Stored Projections')),
        React.createElement(material_1.Box, { paddingLeft: 2, paddingRight: 2 },
            React.createElement(material_1.Button, { onClick: (name) => onSaveProjectionClick(new Date().getHours() + ":" + new Date().getMinutes()), variant: "outlined", size: "small" }, 'Store Projection')),
        React.createElement("div", { style: { overflowY: 'auto', height: '100px', flex: '1 1 auto' } },
            React.createElement(material_1.List, { dense: true }, props.projections.map(projection => {
                return React.createElement(material_1.ListItem, { key: projection.hash, button: true, onClick: () => onProjectionClick(projection) },
                    React.createElement(material_1.ListItemAvatar, null,
                        React.createElement(material_1.Avatar, null,
                            React.createElement(Folder_1.default, null))),
                    React.createElement(material_1.ListItemText, { primary: `${projection.name}`, secondary: `${projection.positions.length} items` }),
                    React.createElement(material_1.ListItemSecondaryAction, null,
                        React.createElement(material_1.IconButton, { onClick: () => onDeleteProjectionClick(projection) },
                            React.createElement(Delete_1.default, null))));
            }))));
});
