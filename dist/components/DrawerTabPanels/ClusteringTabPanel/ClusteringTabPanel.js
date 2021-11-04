"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_1 = require("@mui/material");
const react_redux_1 = require("react-redux");
const Cluster_1 = require("../../../model/Cluster");
const Book_1 = require("../../../model/Book");
const graphs_1 = require("../../Utility/graphs");
const Settings_1 = require("@mui/icons-material/Settings");
const Save_1 = require("@mui/icons-material/Save");
const DisplayModeDuck_1 = require("../../Ducks/DisplayModeDuck");
const StoriesDuck_1 = require("../../Ducks/StoriesDuck");
const Delete_1 = require("@mui/icons-material/Delete");
const StoryPreview_1 = require("./StoryPreview");
const backend_utils = require("../../../utils/backend-connect");
const react_promise_tracker_1 = require("react-promise-tracker");
const promise_helpers_1 = require("../../../utils/promise-helpers");
const ChannelColorDuck_1 = require("../../Ducks/ChannelColorDuck");
const UtilityFunctions_1 = require("../../WebGLView/UtilityFunctions");
const ChevronRight_1 = require("@mui/icons-material/ChevronRight");
const GroupVisualizationMode_1 = require("../../Ducks/GroupVisualizationMode");
const AggregationDuck_1 = require("../../Ducks/AggregationDuck");
const CategoryOptions_1 = require("../../WebGLView/CategoryOptions");
const material_2 = require("@mui/material");
const styles_1 = require("@mui/styles");
const mapStateToProps = (state) => ({
    stories: state.stories,
    displayMode: state.displayMode,
    dataset: state.dataset,
    categoryOptions: state.categoryOptions,
    currentAggregation: state.currentAggregation,
    groupVisualizationMode: state.groupVisualizationMode
});
const mapDispatchToProps = dispatch => ({
    setStories: (stories) => dispatch(StoriesDuck_1.setStories(stories)),
    setActiveStory: (activeStory) => dispatch(StoriesDuck_1.setActiveStory(activeStory)),
    setDisplayMode: displayMode => dispatch(DisplayModeDuck_1.setDisplayMode(displayMode)),
    addStory: story => dispatch(StoriesDuck_1.addStory(story, true)),
    removeClusterFromStories: (cluster) => dispatch(StoriesDuck_1.removeClusterFromStories(cluster)),
    setChannelColor: col => dispatch(ChannelColorDuck_1.setChannelColor(col)),
    //updateLineUpInput_filter: input => dispatch(updateLineUpInput_filter(input)),
    //setLineUpInput_update: input => dispatch(setLineUpInput_update(input)),
    //setLineUpInput_visibility: input => dispatch(setLineUpInput_visibility(input)),
    //setLineUpInput_filter: input => dispatch(setLineUpInput_filter(input)),
    setGroupVisualizationMode: groupVisualizationMode => dispatch(GroupVisualizationMode_1.setGroupVisualizationMode(groupVisualizationMode)),
    setSelectedClusters: (clusters, shift) => dispatch(AggregationDuck_1.selectClusters(clusters, shift))
});
const connector = react_redux_1.connect(mapStateToProps, mapDispatchToProps);
const ContextPaper = material_1.styled(material_1.Paper) `
  padding: 10px;
`;
exports.ClusteringTabPanel = connector(({ categoryOptions, setChannelColor, setStories, dataset, stories, setDisplayMode, displayMode, addStory, removeClusterFromStories, 
//updateLineUpInput_filter,
//setLineUpInput_update,
//setLineUpInput_visibility,
//setLineUpInput_filter,
currentAggregation, splitRef, groupVisualizationMode, setGroupVisualizationMode, setSelectedClusters }) => {
    function toggleClusters() {
        if (dataset.clusters && dataset.clusters.length > 0) {
            let clusters = dataset.clusters;
            if (dataset.clusterEdges && dataset.clusterEdges.length > 0) {
                setStories([graphs_1.transformIndicesToHandles(dataset.clusters, dataset.clusterEdges)]);
            }
            else {
                if (dataset.isSequential) {
                    const [edges] = graphs_1.graphLayout(dataset, clusters);
                    if (edges.length > 0) {
                        let stories = graphs_1.storyLayout(clusters, edges);
                        setStories(stories);
                        //setActiveStory(stories[0])
                    }
                }
            }
        }
    }
    function calc_hdbscan(min_cluster_size, min_cluster_samples, allow_single_cluster, cancellablePromise, clusterSelectionOnly, addClusterToCurrentStory) {
        const loading_area = "global_loading_indicator";
        let data_points = clusterSelectionOnly && currentAggregation.aggregation && currentAggregation.aggregation.length > 0 ? currentAggregation.aggregation.map(i => dataset.vectors[i]) : dataset.vectors;
        const points = data_points.map(point => [point.x, point.y]);
        react_promise_tracker_1.trackPromise(cancellablePromise(backend_utils.calculate_hdbscan_clusters(points, min_cluster_size, min_cluster_samples, allow_single_cluster)).then(data => {
            const cluster_labels = data["result"];
            const dist_cluster_labels = cluster_labels.filter((value, index, self) => { return self.indexOf(value) === index; }); //return distinct list of clusters
            if (dist_cluster_labels.length <= 1) { //if there are no clusters found, return and give error message
                alert("No Cluster could be derived. Please, adjust the Clustering Cettings and try again.");
                return;
            }
            const story = stories.active !== null ? StoriesDuck_1.StoriesUtil.getActive(stories) : StoriesDuck_1.StoriesUtil.emptyStory();
            dist_cluster_labels.forEach(cluster_label => {
                if (cluster_label >= 0) {
                    const current_cluster_vects = data_points.filter((x, i) => cluster_labels[i] == cluster_label);
                    const cluster = Cluster_1.ACluster.fromSamples(dataset, current_cluster_vects.map(i => i.__meta__.meshIndex));
                    // Set correct label for cluster
                    cluster.label = cluster_label;
                    // clusters.push(cluster)
                    Book_1.ABook.addCluster(story, cluster);
                }
            });
            // if(!addClusterToCurrentStory){
            addStory(story);
            // }
            // Update UI, dont know how to right now
            var clusterAttribute = CategoryOptions_1.CategoryOptionsAPI.getAttribute(categoryOptions, "color", "groupLabel", "categorical");
            if (clusterAttribute) {
                setChannelColor(clusterAttribute);
            }
        })
            .catch(error => console.log(error)), loading_area);
    }
    const { cancellablePromise } = promise_helpers_1.useCancellablePromise();
    const [openClusterPanel, setOpenClusterPanel] = React.useState(false);
    const anchorRef = React.useRef();
    const [clusterSelectionOnly, setClusterSelectionOnly] = React.useState(false);
    const [addClusterToCurrentStory, setAddClusterToCurrentStory] = React.useState(false);
    const [clusterAdvancedMode, setClusterAdvancedMode] = React.useState(false);
    const [clusterSliderValue, setClusterSliderValue] = React.useState(2);
    const [min_cluster_size, set_min_cluster_size] = React.useState(5);
    const [min_cluster_samples, set_min_cluster_samples] = React.useState(1);
    const [allow_single_cluster, set_allow_single_cluster] = React.useState(false);
    React.useEffect(() => {
        handleClusterSliderChange(clusterSliderValue, clusterSelectionOnly);
    }, [dataset.info.path, currentAggregation, clusterSelectionOnly]);
    const handleClusterSliderChange = (newValue, clusterSelectionOnly) => {
        let data = clusterSelectionOnly && currentAggregation.aggregation && currentAggregation.aggregation.length > 0 ? currentAggregation.aggregation : dataset.vectors;
        let min_clust = 0;
        switch (newValue) {
            case 0:
                const c_few = 11;
                min_clust = Math.log10(data.length) * c_few;
                // min_clust = Math.max(data.length / 200, 20);
                set_min_cluster_size(Math.round(min_clust));
                set_min_cluster_samples(Math.round(min_clust / 2));
                // set_allow_single_cluster(true);
                set_allow_single_cluster(false);
                break;
            case 1:
                const c_med = 6;
                min_clust = Math.log10(data.length) * c_med;
                // min_clust = Math.max(data.length / 500, 9);
                set_min_cluster_size(Math.round(min_clust));
                set_min_cluster_samples(Math.round(min_clust / 2));
                set_allow_single_cluster(false);
                break;
            case 2:
                const c_many = 3;
                min_clust = Math.log10(data.length) * c_many;
                // min_clust = Math.max(data.length / 700, 5);
                set_min_cluster_size(Math.round(min_clust));
                set_min_cluster_samples(Math.round(min_clust / 5));
                set_allow_single_cluster(false);
                break;
        }
        setClusterSliderValue(newValue);
    };
    const marks = [
        {
            value: 0,
            label: 'Few Clusters',
        },
        {
            value: 2,
            label: 'Many Clusters',
        }
    ];
    React.useEffect(() => toggleClusters(), [dataset]);
    const onCheckItems = (event) => {
        if (event.target.checked) {
            if (displayMode == DisplayModeDuck_1.DisplayMode.OnlyClusters) {
                setDisplayMode(DisplayModeDuck_1.DisplayMode.StatesAndClusters);
            }
            else {
                setDisplayMode(DisplayModeDuck_1.DisplayMode.OnlyStates);
            }
        }
        else {
            if (displayMode == DisplayModeDuck_1.DisplayMode.StatesAndClusters) {
                setDisplayMode(DisplayModeDuck_1.DisplayMode.OnlyClusters);
            }
            else {
                setDisplayMode(DisplayModeDuck_1.DisplayMode.None);
            }
        }
    };
    const onCheckClusters = (event) => {
        if (event.target.checked) {
            if (displayMode == DisplayModeDuck_1.DisplayMode.OnlyStates) {
                setDisplayMode(DisplayModeDuck_1.DisplayMode.StatesAndClusters);
            }
            else {
                setDisplayMode(DisplayModeDuck_1.DisplayMode.OnlyClusters);
            }
        }
        else {
            if (displayMode == DisplayModeDuck_1.DisplayMode.StatesAndClusters) {
                setDisplayMode(DisplayModeDuck_1.DisplayMode.OnlyStates);
            }
            else {
                setDisplayMode(DisplayModeDuck_1.DisplayMode.None);
            }
        }
    };
    return React.createElement("div", { style: { display: 'flex', flexDirection: 'column', height: '100%' } },
        React.createElement(material_1.Box, { paddingLeft: 2, paddingTop: 2 },
            React.createElement(material_1.Typography, { variant: "subtitle2", gutterBottom: true }, 'Group Settings')),
        React.createElement(material_1.Box, { paddingLeft: 2, paddingRight: 2 },
            React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { color: "primary", checked: displayMode != DisplayModeDuck_1.DisplayMode.OnlyClusters && displayMode != DisplayModeDuck_1.DisplayMode.None, onChange: onCheckItems }), label: "Show Items" }),
            React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { color: "primary", checked: displayMode != DisplayModeDuck_1.DisplayMode.OnlyStates && displayMode != DisplayModeDuck_1.DisplayMode.None, onChange: onCheckClusters }), label: "Show Group Centers" }),
            React.createElement("div", { style: { width: '100%' } },
                React.createElement(material_1.FormControl, { style: { width: '100%' } },
                    React.createElement(material_2.FormHelperText, null, "Group Visualization"),
                    React.createElement(material_1.Select, { value: groupVisualizationMode, onChange: (event) => {
                            setGroupVisualizationMode(event.target.value);
                        }, displayEmpty: true, size: 'small' },
                        React.createElement(material_1.MenuItem, { value: GroupVisualizationMode_1.GroupVisualizationMode.None },
                            React.createElement("em", null, "None")),
                        React.createElement(material_1.MenuItem, { value: GroupVisualizationMode_1.GroupVisualizationMode.ConvexHull }, "Contour Plot"),
                        React.createElement(material_1.MenuItem, { value: GroupVisualizationMode_1.GroupVisualizationMode.StarVisualization }, "Star Visualization"))))),
        React.createElement(material_1.Box, { paddingLeft: 2, paddingTop: 2, paddingRight: 2 },
            React.createElement(material_1.Button, { variant: "outlined", fullWidth: true, ref: anchorRef, onClick: () => setOpenClusterPanel(true) },
                "Define Groups by Clustering ",
                React.createElement(ChevronRight_1.default, null))),
        React.createElement(material_1.Popover, { open: openClusterPanel, anchorEl: anchorRef.current, onClose: () => setOpenClusterPanel(false), anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
            }, transformOrigin: {
                vertical: 'top',
                horizontal: 'left',
            } },
            React.createElement(material_1.Box, { paddingLeft: 2, paddingTop: 2, width: 300 },
                React.createElement(material_1.Typography, { variant: "subtitle2", gutterBottom: true }, "Clustering Settings")),
            React.createElement(material_1.Box, { paddingLeft: 2 },
                React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { color: "primary", checked: clusterAdvancedMode, onChange: (event, newValue) => { setClusterAdvancedMode(newValue); }, name: "advancedClustering" }), label: "Advanced" })),
            clusterAdvancedMode ?
                React.createElement(material_1.Box, { paddingLeft: 2, paddingRight: 2 },
                    React.createElement(material_1.Box, null,
                        React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { color: "primary", checked: clusterSelectionOnly, onChange: (event, newValue) => { setClusterSelectionOnly(newValue); }, name: "selectionClustering" }), label: "Cluster only Selected Items" })),
                    React.createElement(material_1.Box, null,
                        React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Switch, { color: "primary", checked: addClusterToCurrentStory, onChange: (event, newValue) => { setAddClusterToCurrentStory(newValue); }, name: "addClusterToCurrentStory" }), label: "Add Cluster to current Story" })),
                    React.createElement(material_1.TextField, { fullWidth: true, label: "Min Cluster Size", type: "number", InputLabelProps: {
                            shrink: true,
                        }, value: min_cluster_size, onChange: (event) => { set_min_cluster_size(Math.max(parseInt(event.target.value), 2)); } }),
                    React.createElement("br", null),
                    React.createElement(material_1.TextField, { fullWidth: true, label: "Min Cluster Samples", type: "number", InputLabelProps: {
                            shrink: true,
                        }, value: min_cluster_samples, onChange: (event) => { set_min_cluster_samples(Math.max(parseInt(event.target.value), 1)); } }),
                    React.createElement("br", null),
                    React.createElement(material_1.FormControlLabel, { control: React.createElement(material_1.Checkbox, { color: "primary", checked: allow_single_cluster, onChange: (event) => { set_allow_single_cluster(event.target.checked); } }), label: "Allow Single Cluster" })) :
                React.createElement(material_1.Box, { paddingLeft: 7, paddingRight: 7 },
                    React.createElement(material_1.Slider, { track: false, defaultValue: 1, "aria-labelledby": "discrete-slider-custom", step: 1, marks: marks, min: 0, max: 2, value: clusterSliderValue, onChange: (event, newValue) => handleClusterSliderChange(newValue, clusterSelectionOnly) })),
            React.createElement(material_1.Box, { p: 2 },
                React.createElement(material_1.Button, { variant: "outlined", style: {
                        width: '100%'
                    }, onClick: () => {
                        calc_hdbscan(min_cluster_size, min_cluster_samples, allow_single_cluster, cancellablePromise, clusterSelectionOnly, addClusterToCurrentStory);
                        setOpenClusterPanel(false);
                    } }, "Run Clustering"))),
        React.createElement(material_1.Box, { paddingLeft: 2, paddingTop: 2 },
            React.createElement(material_1.Typography, { variant: "subtitle2", gutterBottom: true }, 'Groups and Stories')),
        React.createElement(material_1.Box, { paddingLeft: 2, paddingRight: 2, paddingBottom: 2 },
            React.createElement(StoryPreview_1.StoryPreview, null)),
        React.createElement("div", { style: { overflowY: 'auto', height: '100px', flex: '1 1 auto' } },
            React.createElement(ClusterList, { dataset: dataset, removeClusterFromStories: removeClusterFromStories, selectedClusters: currentAggregation.selectedClusters, stories: stories, 
                //updateLineUpInput_filter={updateLineUpInput_filter}
                //setLineUpInput_update={setLineUpInput_update}
                //setLineUpInput_visibility={setLineUpInput_visibility}
                //setLineUpInput_filter={setLineUpInput_filter}
                splitRef: splitRef, setSelectedCluster: setSelectedClusters })));
});
function ClusterPopover({ anchorEl, setAnchorEl, cluster, dataset, removeClusterFromStories, splitRef, setSelectedCluster }) {
    if (!cluster)
        return null;
    const [name, setName] = React.useState(cluster.label);
    const useStyles = styles_1.makeStyles(theme => ({
        button: {
        //margin: theme.spacing(1)
        },
        root: {
        //padding: theme.spacing(3, 2)
        }
    }));
    const classes = useStyles();
    React.useEffect(() => {
        if (cluster && anchorEl) {
            setName(cluster.label);
        }
    }, [anchorEl, cluster]);
    const onSave = () => {
        // TODO
        //updateLineUpInput_filter({ "key": 'groupLabel', 'val_old': cluster.label, 'val_new': name });
        cluster.label = name;
        // Rename cluster labels in dataset
        UtilityFunctions_1.replaceClusterLabels(cluster.indices.map(i => dataset.vectors[i]), cluster.label, name);
        setAnchorEl(null);
        // TODO
        //setLineUpInput_update();
    };
    const onDelete = () => {
        setAnchorEl(null);
        removeClusterFromStories(cluster);
    };
    const onLineup = () => {
        setAnchorEl(null);
        // TODO
        //setLineUpInput_visibility(true)
        //setLineUpInput_filter({ 'groupLabel': cluster.label });
        //setSelectedCluster([cluster])
        const curr_sizes = splitRef.current.split.getSizes();
        if (curr_sizes[1] < 2) {
            splitRef.current.split.setSizes([curr_sizes[0], 70]);
        }
    };
    return React.createElement(material_1.Popover, { id: "dialog to open", open: anchorEl !== null, anchorEl: anchorEl, onClose: () => setAnchorEl(null), anchorOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
        }, transformOrigin: {
            vertical: 'bottom',
            horizontal: 'center',
        } },
        React.createElement("div", null,
            React.createElement(ContextPaper, null,
                React.createElement(material_1.Button, { className: classes.button, variant: "outlined", 
                    // color="secondary"
                    onClick: onDelete, startIcon: React.createElement(Delete_1.default, null) }, "Delete Group"),
                React.createElement(material_1.FormGroup, null,
                    React.createElement(material_1.TextField, { className: classes.button, id: "option3", label: "Group Name", value: name, onChange: (event) => { setName(event.target.value); }, margin: "normal" }),
                    React.createElement("div", { style: { display: 'flex' } },
                        React.createElement(material_1.Button, { color: "primary", variant: "contained", "aria-label": "Save", className: classes.button, onClick: onSave, startIcon: React.createElement(Save_1.default, null) }, "Save"),
                        React.createElement(material_1.Button, { className: classes.button, onClick: onLineup, variant: "outlined" }, "Show Group in Table"))))));
}
function ClusterList({ selectedClusters, stories, dataset, removeClusterFromStories, 
//updateLineUpInput_filter,
//setLineUpInput_update,
//setLineUpInput_visibility,
//setLineUpInput_filter,
splitRef, setSelectedCluster }) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [popoverCluster, setPopoverCluster] = React.useState(null);
    const activeStory = stories.stories[stories.active];
    const storyItems = new Array();
    if (activeStory) {
        for (const [key, cluster] of Object.entries(activeStory.clusters.byId)) {
            storyItems.push(React.createElement(material_1.ListItem, { key: key, button: true, selected: selectedClusters.includes(key), onClick: (event) => {
                    setSelectedCluster([key], event.ctrlKey);
                } },
                React.createElement(material_1.ListItemText, { primary: Cluster_1.ACluster.getTextRepresentation(cluster), secondary: `${cluster.indices.length} Items` }),
                React.createElement(material_1.ListItemSecondaryAction, null,
                    React.createElement(material_1.IconButton, { edge: "end", "aria-label": "delete", onClick: (event) => {
                            //removeClusterFromStories(cluster)
                            setPopoverCluster(cluster);
                            setAnchorEl(event.target);
                        } },
                        React.createElement(Settings_1.default, null)))));
        }
    }
    return React.createElement("div", null,
        React.createElement(ClusterPopover, { anchorEl: anchorEl, dataset: dataset, setAnchorEl: setAnchorEl, cluster: popoverCluster, removeClusterFromStories: removeClusterFromStories, splitRef: splitRef, setSelectedCluster: setSelectedCluster }),
        React.createElement(material_1.List, null, storyItems));
}
