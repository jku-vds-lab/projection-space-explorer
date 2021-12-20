"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
require("regenerator-runtime/runtime");
const WebGLView_1 = require("./components/WebGLView/WebGLView");
const material_1 = require("@mui/material");
const DatasetDatabase_1 = require("./components/Utility/Data/DatasetDatabase");
const Dataset_1 = require("./model/Dataset");
const LineTreePopover_1 = require("./components/DrawerTabPanels/StatesTabPanel/LineTreePopover");
const React = require("react");
const Storytelling_1 = require("./components/Overlays/Storytelling");
const ClusteringTabPanel_1 = require("./components/DrawerTabPanels/ClusteringTabPanel/ClusteringTabPanel");
const react_redux_1 = require("react-redux");
const StatesTabPanel_1 = require("./components/DrawerTabPanels/StatesTabPanel/StatesTabPanel");
const StateSequenceDrawer_1 = require("./components/Overlays/StateSequenceDrawer");
const ProjectionOpenDuck_1 = require("./components/Ducks/ProjectionOpenDuck");
const DatasetDuck_1 = require("./components/Ducks/DatasetDuck");
const OpenTabDuck_1 = require("./components/Ducks/OpenTabDuck");
const ClusterModeDuck_1 = require("./components/Ducks/ClusterModeDuck");
const AdvancedColoringSelectionDuck_1 = require("./components/Ducks/AdvancedColoringSelectionDuck");
const CategoryOptions_1 = require("./components/WebGLView/CategoryOptions");
const ProjectionColumnsDuck_1 = require("./components/Ducks/ProjectionColumnsDuck");
const EmbeddingTabPanel_1 = require("./components/DrawerTabPanels/EmbeddingTabPanel/EmbeddingTabPanel");
const CSVLoader_1 = require("./components/Utility/Loaders/CSVLoader");
const ActiveLineDuck_1 = require("./components/Ducks/ActiveLineDuck");
const PathLengthRange_1 = require("./components/Ducks/PathLengthRange");
const CategoryOptionsDuck_1 = require("./components/Ducks/CategoryOptionsDuck");
const ChannelSize_1 = require("./components/Ducks/ChannelSize");
const GlobalPointSizeDuck_1 = require("./components/Ducks/GlobalPointSizeDuck");
const ChannelColorDuck_1 = require("./components/Ducks/ChannelColorDuck");
const DatasetTabPanel_1 = require("./components/DrawerTabPanels/DatasetTabPanel/DatasetTabPanel");
const DetailsTabPanel_1 = require("./components/DrawerTabPanels/DetailsTabPanel/DetailsTabPanel");
const ProjectionsDuck_1 = require("./components/Ducks/ProjectionsDuck");
const Embedding_1 = require("./model/Embedding");
const StoriesDuck_1 = require("./components/Ducks/StoriesDuck");
const react_split_1 = require("react-split");
const SelectedLineByDuck_1 = require("./components/Ducks/SelectedLineByDuck");
const GlobalPointBrightnessDuck_1 = require("./components/Ducks/GlobalPointBrightnessDuck");
const ChannelBrightnessDuck_1 = require("./components/Ducks/ChannelBrightnessDuck");
const GenericFingerprintAttributesDuck_1 = require("./components/Ducks/GenericFingerprintAttributesDuck");
const GroupVisualizationMode_1 = require("./components/Ducks/GroupVisualizationMode");
const HoverStateOrientationDuck_1 = require("./components/Ducks/HoverStateOrientationDuck");
const PluginScript_1 = require("./components/Store/PluginScript");
const RubikPlugin_1 = require("./plugins/Rubik/RubikPlugin");
const ChessPlugin_1 = require("./plugins/Chess/ChessPlugin");
const GoPlugin_1 = require("./plugins/Go/GoPlugin");
const PseAppBar_1 = require("./components/PseAppBar");
const DetailViewDuck_1 = require("./components/Ducks/DetailViewDuck");
const PSEIcons_1 = require("./utils/PSEIcons");
// @ts-ignore
const vds_lab_logo_notext_svg_1 = require("../textures/vds-lab-logo-notext.svg");
const CoralPlugin_1 = require("./plugins/Coral/CoralPlugin");
/**
 * A TabPanel with a fixed height of 100vh which is needed for content with a scrollbar to work.
 */
function FixedHeightTabPanel(props) {
    const { children, value, index } = props, other = __rest(props, ["children", "value", "index"]);
    return (React.createElement(material_1.Typography, Object.assign({ component: "div", role: "tabpanel", hidden: value !== index, id: `simple-tabpanel-${index}`, "aria-labelledby": `simple-tab-${index}` }, other), React.createElement(material_1.Paper, { style: { overflow: 'hidden', height: '100vh' } }, children)));
}
const mapStateToProps = (state) => ({
    openTab: state.openTab,
    dataset: state.dataset,
    categoryOptions: state.categoryOptions,
    channelSize: state.channelSize,
    channelColor: state.channelColor,
    channelBrightness: state.channelBrightness,
    hoverStateOrientation: state.hoverStateOrientation
});
const mapDispatchToProps = dispatch => ({
    addStory: story => dispatch(StoriesDuck_1.addStory(story)),
    setActiveStory: (activeStory) => dispatch(StoriesDuck_1.setActiveStory(activeStory)),
    setOpenTab: openTab => dispatch(OpenTabDuck_1.setOpenTabAction(openTab)),
    setDataset: dataset => dispatch(DatasetDuck_1.setDatasetAction(dataset)),
    setAdvancedColoringSelection: value => dispatch(AdvancedColoringSelectionDuck_1.setAdvancedColoringSelectionAction(value)),
    setActiveLine: value => dispatch(ActiveLineDuck_1.setActiveLine(value)),
    setProjectionColumns: projectionColumns => dispatch(ProjectionColumnsDuck_1.setProjectionColumns(projectionColumns)),
    setProjectionOpen: projectionOpen => dispatch(ProjectionOpenDuck_1.setProjectionOpenAction(projectionOpen)),
    setClusterMode: clusterMode => dispatch(ClusterModeDuck_1.setClusterModeAction(clusterMode)),
    setPathLengthMaximum: maximum => dispatch(PathLengthRange_1.setPathLengthMaximum(maximum)),
    setPathLengthRange: range => dispatch(PathLengthRange_1.setPathLengthRange(range)),
    setCategoryOptions: categoryOptions => dispatch(CategoryOptionsDuck_1.setCategoryOptions(categoryOptions)),
    setChannelSize: channelSize => dispatch(ChannelSize_1.setChannelSize(channelSize)),
    setGlobalPointSize: size => dispatch(GlobalPointSizeDuck_1.setGlobalPointSize(size)),
    wipeState: () => dispatch({ type: 'RESET_APP' }),
    setChannelColor: channelColor => dispatch(ChannelColorDuck_1.setChannelColor(channelColor)),
    setChannelBrightness: channelBrightness => dispatch(ChannelBrightnessDuck_1.setChannelBrightnessSelection(channelBrightness)),
    saveProjection: embedding => dispatch(ProjectionsDuck_1.addProjectionAction(embedding)),
    setVectors: vectors => dispatch(StoriesDuck_1.setVectors(vectors)),
    setLineByOptions: options => dispatch(SelectedLineByDuck_1.setLineByOptions(options)),
    setGlobalPointBrightness: value => dispatch(GlobalPointBrightnessDuck_1.setGlobalPointBrightness(value)),
    setGenericFingerprintAttributes: value => dispatch(GenericFingerprintAttributesDuck_1.setGenericFingerprintAttributes(value)),
    setGroupVisualizationMode: value => dispatch(GroupVisualizationMode_1.setGroupVisualizationMode(value)),
    setLineUpInput_visibility: open => dispatch(DetailViewDuck_1.setDetailVisibility(open))
});
/**
 * Factory method which is declared here so we can get a static type in 'ConnectedProps'
 */
const connector = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
/**
 * Main application that contains all other components.
 */
exports.Application = connector(class extends React.Component {
    constructor(props) {
        super(props);
        this.threeRef = React.createRef();
        this.splitRef = React.createRef();
        this.onLineSelect = this.onLineSelect.bind(this);
        this.onDataSelected = this.onDataSelected.bind(this);
    }
    componentDidMount() {
        var _a, _b, _c;
        var url = new URL(window.location.toString());
        var set = url.searchParams.get("set");
        if ((_c = (_b = (_a = this.props.config) === null || _a === void 0 ? void 0 : _a.preselect) === null || _b === void 0 ? void 0 : _b.initOnMount) !== null && _c !== void 0 ? _c : true) {
            var preselect = "datasets/rubik/cube10x2_different_origins.csv";
            var loader = new CSVLoader_1.CSVLoader();
            if (set != null) {
                if (set == "neural") {
                    preselect = "datasets/neural/learning_confmat.csv";
                    loader = new CSVLoader_1.CSVLoader();
                }
                else if (set == "rubik") {
                    preselect = "datasets/rubik/cube10x2_different_origins.csv";
                    loader = new CSVLoader_1.CSVLoader();
                }
                else if (set == "chess") {
                    preselect = "datasets/chess/chess16k.csv";
                    loader = new CSVLoader_1.CSVLoader();
                }
                else if (set == "reaction") {
                    preselect = "datasets/chemvis/domain_5000_all_predictions.csv";
                    loader = new CSVLoader_1.CSVLoader();
                }
                loader.resolvePath(new DatasetDatabase_1.DatasetDatabase().getByPath(preselect), (dataset) => { this.onDataSelected(dataset); });
            }
            else {
                loader.resolvePath(new DatasetDatabase_1.DatasetDatabase().getByPath(preselect), (dataset) => { this.onDataSelected(dataset); });
            }
        }
    }
    /**
     * Main callback when the dataset changes
     * @param dataset
     * @param json
     */
    onDataSelected(dataset) {
        // Wipe old state
        this.props.wipeState();
        // Dispose old view
        this.threeRef.current.disposeScene();
        this.props.setClusterMode(dataset.multivariateLabels ? ClusterModeDuck_1.ClusterMode.Multivariate : ClusterModeDuck_1.ClusterMode.Univariate);
        // if(!frontend_utils.CHEM_PROJECT)
        this.props.setGroupVisualizationMode(dataset.multivariateLabels ? GroupVisualizationMode_1.GroupVisualizationMode.StarVisualization : GroupVisualizationMode_1.GroupVisualizationMode.ConvexHull);
        // Set new dataset as variable
        this.props.setDataset(dataset);
        this.finite(dataset);
        this.props.setVectors(dataset.vectors);
        this.props.setLineByOptions(Dataset_1.DatasetUtil.getColumns(dataset));
        setTimeout(() => this.threeRef.current.requestRender(), 500);
    }
    finite(dataset) {
        var algos = LineTreePopover_1.LineSelectionTree_GenAlgos(this.props.dataset.vectors);
        var selLines = LineTreePopover_1.LineSelectionTree_GetChecks(algos);
        // Update shape legend
        this.setState({
            selectedLines: selLines,
            selectedLineAlgos: algos
        });
        const co = new CategoryOptions_1.CategoryOptions(this.props.dataset.vectors, this.props.dataset.categories);
        CategoryOptions_1.CategoryOptionsAPI.init(co);
        this.props.setCategoryOptions(co);
        this.props.setPathLengthMaximum(Dataset_1.SegmentFN.getMaxPathLength(dataset));
        this.props.setPathLengthRange([0, Dataset_1.SegmentFN.getMaxPathLength(dataset)]);
        this.props.saveProjection(new Embedding_1.Embedding(dataset.vectors, "Initial Projection"));
        this.props.setGenericFingerprintAttributes(Dataset_1.DatasetUtil.getColumns(dataset, true).map(column => ({
            feature: column,
            show: dataset.columns[column].project
        })));
        const formatRange = range => {
            try {
                return `${range.min.toFixed(2)} - ${range.max.toFixed(2)}`;
            }
            catch (_a) {
                return 'unknown';
            }
        };
        this.props.setProjectionColumns(Dataset_1.DatasetUtil.getColumns(dataset, true).map(column => ({
            name: column,
            checked: dataset.columns[column].project,
            normalized: true,
            range: dataset.columns[column].range ? formatRange(dataset.columns[column].range) : "unknown",
            featureLabel: dataset.columns[column].featureLabel
        })));
        this.initializeEncodings(dataset);
    }
    initializeEncodings(dataset) {
        this.threeRef.current.particles.shapeCat(null);
        var defaultSizeAttribute = CategoryOptions_1.CategoryOptionsAPI.getAttribute(this.props.categoryOptions, 'size', 'multiplicity', 'sequential');
        if (defaultSizeAttribute) {
            this.props.setGlobalPointSize([1, 2]);
            this.props.setChannelSize(defaultSizeAttribute);
            this.threeRef.current.particles.sizeCat(defaultSizeAttribute, [1, 2]);
        }
        else {
            this.props.setGlobalPointSize([1]);
            this.props.setChannelSize(null);
            this.threeRef.current.particles.sizeCat(defaultSizeAttribute, [1]);
        }
        var defaultColorAttribute = CategoryOptions_1.CategoryOptionsAPI.getAttribute(this.props.categoryOptions, "color", "algo", "categorical");
        if (defaultColorAttribute) {
            this.props.setChannelColor(defaultColorAttribute);
        }
        else {
            this.props.setChannelColor(null);
        }
        var defaultBrightnessAttribute = CategoryOptions_1.CategoryOptionsAPI.getAttribute(this.props.categoryOptions, "transparency", "age", "sequential");
        if (defaultBrightnessAttribute) {
            this.props.setGlobalPointBrightness([0.25, 1]);
            this.props.setChannelBrightness(defaultBrightnessAttribute);
            this.threeRef.current.particles.transparencyCat(defaultBrightnessAttribute, [0.25, 1]);
        }
        else {
            this.props.setGlobalPointBrightness([1]);
            this.props.setChannelBrightness(null);
            this.threeRef.current.particles.transparencyCat(defaultBrightnessAttribute, [1]);
        }
    }
    onLineSelect(algo, show) {
        this.threeRef.current.filterLines(algo, show);
        this.threeRef.current.requestRender();
    }
    onChangeTab(newTab) {
        if (newTab === this.props.openTab) {
            this.props.setOpenTab(false);
        }
        else {
            this.props.setOpenTab(newTab);
        }
    }
    render() {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        return React.createElement("div", { style: {
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'stretch',
                overflow: 'hidden'
            } },
            React.createElement(material_1.Drawer, { variant: "permanent", style: {
                    width: 88
                }, PaperProps: { style: { position: 'relative', overflow: 'hidden', border: 'none' } } },
                React.createElement(material_1.Divider, null),
                React.createElement(material_1.Tabs, { style: {
                        width: 88
                    }, value: this.props.openTab, orientation: "vertical", indicatorColor: "primary", textColor: "primary", onChange: (e, newTab) => this.onChangeTab(newTab), "aria-label": "disabled tabs example" },
                    React.createElement(material_1.Tooltip, { placement: "right", title: React.createElement(React.Fragment, null,
                            React.createElement(material_1.Typography, { variant: "subtitle2" }, "Load Dataset"),
                            React.createElement(material_1.Typography, { variant: "body2" }, "Upload a new dataset or choose a predefined one.")) },
                        React.createElement(material_1.Tab, { value: 0, icon: React.createElement(material_1.SvgIcon, { style: { fontSize: 64 }, viewBox: "0 0 18.521 18.521", component: PSEIcons_1.PSEIcons.Dataset }), style: { minWidth: 0, flexGrow: 1, padding: 12, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' } })),
                    React.createElement(material_1.Tooltip, { placement: "right", title: React.createElement(React.Fragment, null,
                            React.createElement(material_1.Typography, { variant: "subtitle2" }, "Embedding and Projection"),
                            React.createElement(material_1.Typography, { variant: "body2" }, "Perform projection techniques like t-SNE, UMAP, or a force-directly layout with your data.")) },
                        React.createElement(material_1.Tab, { value: 1, icon: React.createElement(material_1.SvgIcon, { style: { fontSize: 64 }, viewBox: "0 0 18.521 18.521", component: PSEIcons_1.PSEIcons.Project }), style: { minWidth: 0, flexGrow: 1, padding: 12, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' } })),
                    React.createElement(material_1.Tooltip, { placement: "right", title: React.createElement(React.Fragment, null,
                            React.createElement(material_1.Typography, { variant: "subtitle2" }, "Point and Line Channels"),
                            React.createElement(material_1.Typography, { variant: "body2" }, "Contains settings that let you map different channels like brightness and color on point and line attributes.")) },
                        React.createElement(material_1.Tab, { value: 2, icon: React.createElement(material_1.SvgIcon, { style: { fontSize: 64 }, viewBox: "0 0 18.521 18.521", component: PSEIcons_1.PSEIcons.Encoding }), style: { minWidth: 0, flexGrow: 1, padding: 12, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' } })),
                    React.createElement(material_1.Tooltip, { placement: "right", title: React.createElement(React.Fragment, null,
                            React.createElement(material_1.Typography, { variant: "subtitle2" }, "Groups"),
                            React.createElement(material_1.Typography, { variant: "body2" }, "Contains options for displaying and navigating groups in the dataset.")) },
                        React.createElement(material_1.Tab, { value: 3, icon: React.createElement(material_1.SvgIcon, { style: { fontSize: 64 }, viewBox: "0 0 18.521 18.521", component: PSEIcons_1.PSEIcons.Clusters }), style: { minWidth: 0, flexGrow: 1, padding: 12, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' } })),
                    React.createElement(material_1.Tooltip, { placement: "right", title: React.createElement(React.Fragment, null,
                            React.createElement(material_1.Typography, { variant: "subtitle2" }, "Hover Item and Selection Summary"),
                            React.createElement(material_1.Typography, { variant: "body2" }, "Contains information about the currently hovered item and the currently selected summary.")) },
                        React.createElement(material_1.Tab, { value: 4, icon: React.createElement(material_1.SvgIcon, { style: { fontSize: 64 }, viewBox: "0 0 18.521 18.521", component: PSEIcons_1.PSEIcons.Details }), style: { minWidth: 0, flexGrow: 1, padding: 12, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' } })), (_b = (_a = this.props.overrideComponents) === null || _a === void 0 ? void 0 : _a.tabs) === null || _b === void 0 ? void 0 :
                    _b.map((tab, i) => {
                        return React.createElement(material_1.Tooltip, { key: `tooltip${tab.name}`, placement: "right", title: React.createElement(React.Fragment, null,
                                React.createElement(material_1.Typography, { variant: "subtitle2" }, tab.title),
                                React.createElement(material_1.Typography, { variant: "body2" }, tab.description)) },
                            React.createElement(material_1.Tab, { value: 5 + i, icon: React.createElement(material_1.SvgIcon, { style: { fontSize: 64 }, viewBox: "0 0 18.521 18.521", component: tab.icon }), style: { minWidth: 0, flexGrow: 1, paddingTop: 16, paddingBottom: 16 } }));
                    }))),
            React.createElement(material_1.Box, { style: {
                    flexShrink: 0,
                    width: this.props.openTab === false ? '0rem' : "18rem",
                    height: '100%',
                    overflowX: 'hidden',
                    overflowY: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid rgba(0, 0, 0, 0.12)'
                } },
                React.createElement("div", { style: {
                        flexGrow: 1,
                        overflowY: 'hidden',
                        overflowX: 'hidden'
                    } },
                    React.createElement(material_1.Grid, { container: true, justifyContent: "center", alignItems: "stretch", direction: "column" },
                        React.createElement(FixedHeightTabPanel, { value: this.props.openTab, index: 0 }, 
                        /** predefined dataset */
                        ((_c = this.props.overrideComponents) === null || _c === void 0 ? void 0 : _c.datasetTab) ? React.createElement((_d = this.props.overrideComponents) === null || _d === void 0 ? void 0 : _d.datasetTab, { onDataSelected: this.onDataSelected }) : React.createElement(DatasetTabPanel_1.DatasetTabPanel, { onDataSelected: this.onDataSelected })),
                        React.createElement(FixedHeightTabPanel, { value: this.props.openTab, index: 1 },
                            React.createElement(EmbeddingTabPanel_1.EmbeddingTabPanel, { config: this.props.features, webGLView: this.threeRef })),
                        React.createElement(FixedHeightTabPanel, { value: this.props.openTab, index: 2 },
                            React.createElement(StatesTabPanel_1.StatesTabPanel, { webGLView: this.threeRef })),
                        React.createElement(FixedHeightTabPanel, { value: this.props.openTab, index: 3 }, this.props.dataset != null ?
                            React.createElement(ClusteringTabPanel_1.ClusteringTabPanel, { splitRef: this.splitRef }) : React.createElement("div", null)),
                        React.createElement(FixedHeightTabPanel, { value: this.props.openTab, index: 4 },
                            React.createElement(DetailsTabPanel_1.DetailsTabPanel, null)), (_f = (_e = this.props.overrideComponents) === null || _e === void 0 ? void 0 : _e.tabs) === null || _f === void 0 ? void 0 :
                        _f.map((tab, i) => {
                            return React.createElement(FixedHeightTabPanel, { key: `fixed${tab.name}`, value: this.props.openTab, index: 5 + i }, React.createElement(tab.tab, { splitRef: this.splitRef }));
                        })))),
            React.createElement("div", { style: {
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    flexGrow: 1
                } },
                ((_g = this.props.overrideComponents) === null || _g === void 0 ? void 0 : _g.appBar) ? React.createElement((_h = this.props.overrideComponents) === null || _h === void 0 ? void 0 : _h.appBar) :
                    React.createElement(PseAppBar_1.PseAppBar, null,
                        React.createElement("a", { href: "https://jku-vds-lab.at", target: "_blank" },
                            React.createElement(vds_lab_logo_notext_svg_1.default, { style: { height: 48, width: 48 } })),
                        React.createElement(material_1.Typography, { variant: "h6", style: { marginLeft: 48, color: "rgba(0, 0, 0, 0.54)" } }, "Projection Space Explorer")),
                React.createElement(react_split_1.default, { style: { display: 'flex', flexDirection: 'column', height: '100%' }, ref: this.splitRef, sizes: [100, 0], minSize: 0, expandToMin: false, gutterSize: 12, gutterAlign: "center", snapOffset: 30, dragInterval: 1, direction: "vertical", cursor: "ns-resize", onDragStart: () => {
                        this.props.setLineUpInput_visibility(false);
                    }, onDragEnd: (sizes) => {
                        if (sizes[0] > 90) {
                            this.props.setLineUpInput_visibility(false);
                        }
                        else {
                            this.props.setLineUpInput_visibility(true);
                        }
                    } },
                    React.createElement("div", { style: { flexGrow: 0.9 } },
                        React.createElement(WebGLView_1.WebGLView, { ref: this.threeRef })),
                    React.createElement("div", { style: { flexGrow: 0.1 } }, React.createElement(this.props.overrideComponents.detailViews[0].view, {})))),
            React.createElement(StateSequenceDrawer_1.StateSequenceDrawerRedux, null),
            React.createElement(Storytelling_1.Storytelling, null),
            this.props.hoverStateOrientation == HoverStateOrientationDuck_1.HoverStateOrientation.SouthWest && React.createElement("div", { id: "HoverItemDiv", style: {
                    position: 'absolute',
                    left: '0px',
                    bottom: '0px',
                    zIndex: 10000,
                    padding: 8
                } }),
            this.props.hoverStateOrientation == HoverStateOrientationDuck_1.HoverStateOrientation.NorthEast && React.createElement("div", { id: "HoverItemDiv", style: {
                    position: 'absolute',
                    right: '0px',
                    top: '0px',
                    zIndex: 10000,
                    padding: 8
                } }));
    }
});
const onClick = (content) => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const handle = yield window.showSaveFilePicker({
        suggestedName: 'session.pse',
        types: [{
                description: 'PSE Session',
                accept: {
                    'text/plain': ['.pse'],
                },
            }],
    });
    const writable = yield handle.createWritable();
    writable.write(content);
    yield writable.close();
    return handle;
});
const loo = () => __awaiter(void 0, void 0, void 0, function* () {
    // @ts-ignore
    const [fileHandle] = yield window.showOpenFilePicker();
    const file = yield fileHandle.getFile();
    const contents = yield file.text();
    return contents;
});
PluginScript_1.PluginRegistry.getInstance().registerPlugin(new RubikPlugin_1.RubikPlugin());
PluginScript_1.PluginRegistry.getInstance().registerPlugin(new ChessPlugin_1.ChessPlugin());
PluginScript_1.PluginRegistry.getInstance().registerPlugin(new GoPlugin_1.GoPlugin());
PluginScript_1.PluginRegistry.getInstance().registerPlugin(new CoralPlugin_1.CoralPlugin());
