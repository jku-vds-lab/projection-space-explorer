import React = require("react")
import { Box, Button, Checkbox, FormControl, FormControlLabel, FormGroup, IconButton, InputLabel, List, ListItem, ListItemSecondaryAction, ListItemText, MenuItem, Paper, Popover, Select, Slider, Switch, TextField, Typography } from "@mui/material"
import { connect, ConnectedProps } from 'react-redux'
import { ACluster, ICluster } from "../../../model/Cluster"
import { IBook, ABook } from "../../../model/Book"
import { graphLayout, storyLayout, transformIndicesToHandles } from "../../Utility/graphs"
import SettingsIcon from '@material-ui/icons/Settings';
import SaveIcon from '@material-ui/icons/Save';
import { DisplayMode, setDisplayMode } from "../../Ducks/DisplayModeDuck"
import { addStory, removeClusterFromStories, setActiveStory, setStories, StoriesType, StoriesUtil } from "../../Ducks/StoriesDuck"
import { RootState } from "../../Store/Store"
import DeleteIcon from '@material-ui/icons/Delete';
import { StoryPreview } from "./StoryPreview"
import * as backend_utils from "../../../utils/backend-connect";
import { trackPromise } from "react-promise-tracker";
import { useCancellablePromise } from "../../../utils/promise-helpers"
import { setLineUpInput_visibility, setLineUpInput_filter, setLineUpInput_update, updateLineUpInput_filter } from "../../Ducks/LineUpInputDuck"
import { setChannelColor } from "../../Ducks/ChannelColorDuck"
import { replaceClusterLabels } from "../../WebGLView/UtilityFunctions"
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { GroupVisualizationMode, setGroupVisualizationMode } from "../../Ducks/GroupVisualizationMode"
import { selectClusters } from "../../Ducks/AggregationDuck"
import { CategoryOptionsAPI } from "../../WebGLView/CategoryOptions"
import { Dataset } from "../../../model/Dataset"
import { FormHelperText, makeStyles } from "@material-ui/core"

const mapStateToProps = (state: RootState) => ({
    stories: state.stories,
    displayMode: state.displayMode,
    dataset: state.dataset,
    categoryOptions: state.categoryOptions,
    currentAggregation: state.currentAggregation,
    groupVisualizationMode: state.groupVisualizationMode
})

const mapDispatchToProps = dispatch => ({
    setStories: (stories: IBook[]) => dispatch(setStories(stories)),
    setActiveStory: (activeStory: IBook) => dispatch(setActiveStory(activeStory)),
    setDisplayMode: displayMode => dispatch(setDisplayMode(displayMode)),
    addStory: story => dispatch(addStory(story, true)),
    removeClusterFromStories: (cluster: ICluster) => dispatch(removeClusterFromStories(cluster)),
    setChannelColor: col => dispatch(setChannelColor(col)),
    // setLineUpInput_data: input => dispatch(setLineUpInput_data(input)),
    updateLineUpInput_filter: input => dispatch(updateLineUpInput_filter(input)),
    setLineUpInput_update: input => dispatch(setLineUpInput_update(input)),
    setLineUpInput_visibility: input => dispatch(setLineUpInput_visibility(input)),
    setLineUpInput_filter: input => dispatch(setLineUpInput_filter(input)),
    setGroupVisualizationMode: groupVisualizationMode => dispatch(setGroupVisualizationMode(groupVisualizationMode)),
    setSelectedClusters: (clusters: string[], shift: boolean) => dispatch(selectClusters(clusters, shift))
})

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    splitRef
}








export const ClusteringTabPanel = connector(({
    categoryOptions,
    setChannelColor,
    setStories,
    dataset,
    stories,
    setDisplayMode,
    displayMode,
    addStory,
    removeClusterFromStories,
    // selectedClusters,
    // setLineUpInput_data,
    updateLineUpInput_filter,
    setLineUpInput_update,
    setLineUpInput_visibility,
    currentAggregation,
    setLineUpInput_filter,
    splitRef,
    groupVisualizationMode,
    setGroupVisualizationMode,
    setSelectedClusters }: Props) => {



    function toggleClusters() {
        if (dataset.clusters && dataset.clusters.length > 0) {
            let clusters = dataset.clusters

            if (dataset.clusterEdges && dataset.clusterEdges.length > 0) {
                setStories([transformIndicesToHandles(dataset.clusters, dataset.clusterEdges)])
            } else {
                if (dataset.isSequential) {
                    const [edges] = graphLayout(dataset, clusters)

                    if (edges.length > 0) {
                        let stories = storyLayout(clusters, edges)

                        setStories(stories)
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
        trackPromise(
            cancellablePromise(backend_utils.calculate_hdbscan_clusters(points, min_cluster_size, min_cluster_samples, allow_single_cluster)).then(data => {
                const cluster_labels = data["result"];
                const dist_cluster_labels = cluster_labels.filter((value, index, self) => { return self.indexOf(value) === index; }); //return distinct list of clusters

                if (dist_cluster_labels.length <= 1) { //if there are no clusters found, return and give error message
                    alert("No Cluster could be derived. Please, adjust the Clustering Cettings and try again.")
                    return;
                }


                const story: IBook = stories.active !== null ? StoriesUtil.getActive(stories) : StoriesUtil.emptyStory()

                dist_cluster_labels.forEach(cluster_label => {
                    if (cluster_label >= 0) {
                        const current_cluster_vects = data_points.filter((x, i) => cluster_labels[i] == cluster_label);
                        const cluster = ACluster.fromSamples(dataset, current_cluster_vects.map(i => i.__meta__.meshIndex));

                        // Set correct label for cluster
                        cluster.label = cluster_label
                        // clusters.push(cluster)


                        ABook.addCluster(story, cluster)
                    }
                });

                // if(!addClusterToCurrentStory){
                addStory(story)
                // }

                // Update UI, dont know how to right now
                var clusterAttribute = CategoryOptionsAPI.getAttribute(categoryOptions, "color", "groupLabel", "categorical")

                if (clusterAttribute) {
                    setChannelColor(clusterAttribute)
                }
            })
                .catch(error => console.log(error))
            , loading_area);
    }

    const { cancellablePromise } = useCancellablePromise();

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
                set_min_cluster_samples(Math.round(min_clust / 2))
                // set_allow_single_cluster(true);
                set_allow_single_cluster(false);
                break;
            case 1:
                const c_med = 6;
                min_clust = Math.log10(data.length) * c_med;
                // min_clust = Math.max(data.length / 500, 9);
                set_min_cluster_size(Math.round(min_clust));
                set_min_cluster_samples(Math.round(min_clust / 2))
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
    React.useEffect(() => toggleClusters(), [dataset])

    const onCheckItems = (event) => {
        if (event.target.checked) {
            if (displayMode == DisplayMode.OnlyClusters) {
                setDisplayMode(DisplayMode.StatesAndClusters)
            } else {
                setDisplayMode(DisplayMode.OnlyStates)
            }
        } else {
            if (displayMode == DisplayMode.StatesAndClusters) {
                setDisplayMode(DisplayMode.OnlyClusters)
            } else {
                setDisplayMode(DisplayMode.None)
            }
        }
    }

    const onCheckClusters = (event) => {
        if (event.target.checked) {
            if (displayMode == DisplayMode.OnlyStates) {
                setDisplayMode(DisplayMode.StatesAndClusters)
            } else {
                setDisplayMode(DisplayMode.OnlyClusters)
            }
        } else {
            if (displayMode == DisplayMode.StatesAndClusters) {
                setDisplayMode(DisplayMode.OnlyStates)
            } else {
                setDisplayMode(DisplayMode.None)
            }
        }
    }

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box paddingLeft={2} paddingTop={2}>
            <Typography variant="subtitle2" gutterBottom>{'Group Settings'}</Typography>
        </Box>

        <Box paddingLeft={2} paddingRight={2}>
            <FormControlLabel
                control={<Switch color="primary" checked={displayMode != DisplayMode.OnlyClusters && displayMode != DisplayMode.None} onChange={onCheckItems} />}
                label="Show Items"
            />
            <FormControlLabel
                control={<Switch color="primary" checked={displayMode != DisplayMode.OnlyStates && displayMode != DisplayMode.None} onChange={onCheckClusters} />}
                label="Show Group Centers"
            />

            <div style={{ width: '100%' }}>
                <FormControl style={{ width: '100%' }}>
                    <FormHelperText>Group Visualization</FormHelperText>
                    <Select
                        value={groupVisualizationMode}
                        onChange={(event) => {
                            setGroupVisualizationMode(event.target.value)
                        }}
                    >
                        <MenuItem value={GroupVisualizationMode.None}>
                            <em>None</em>
                        </MenuItem>
                        <MenuItem value={GroupVisualizationMode.ConvexHull}>Contour Plot</MenuItem>
                        <MenuItem value={GroupVisualizationMode.StarVisualization}>Star Visualization</MenuItem>
                    </Select>

                </FormControl>
            </div>
        </Box>

        <Box paddingLeft={2} paddingTop={2} paddingRight={2}>
            <Button variant="outlined" fullWidth ref={anchorRef} onClick={() => setOpenClusterPanel(true)}>
                Define Groups by Clustering <ChevronRightIcon></ChevronRightIcon>
            </Button>
        </Box>
        <Popover
            open={openClusterPanel}
            anchorEl={anchorRef.current}
            onClose={() => setOpenClusterPanel(false)}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <Box paddingLeft={2} paddingTop={2} width={300}>
                <Typography variant="subtitle2" gutterBottom>Clustering Settings</Typography>
            </Box>

            <Box paddingLeft={2}>
                <FormControlLabel
                    control={
                        <Switch
                            color="primary"
                            checked={clusterAdvancedMode}
                            onChange={(event, newValue) => { setClusterAdvancedMode(newValue) }}
                            name="advancedClustering"
                        />
                    }
                    label="Advanced"
                />
            </Box>
            {clusterAdvancedMode ?
                <Box paddingLeft={2} paddingRight={2}>
                    <Box>
                        <FormControlLabel
                            control={
                                <Switch
                                    color="primary"
                                    checked={clusterSelectionOnly}
                                    onChange={(event, newValue) => { setClusterSelectionOnly(newValue) }}
                                    name="selectionClustering"
                                />
                            }
                            label="Cluster only Selected Items"
                        />
                    </Box>
                    <Box>
                        <FormControlLabel
                            control={
                                <Switch
                                    color="primary"
                                    checked={addClusterToCurrentStory}
                                    onChange={(event, newValue) => { setAddClusterToCurrentStory(newValue) }}
                                    name="addClusterToCurrentStory"
                                />
                            }
                            label="Add Cluster to current Story"
                        />
                    </Box>
                    <TextField
                        fullWidth
                        label="Min Cluster Size"
                        type="number"
                        InputLabelProps={{
                            shrink: true,

                        }}
                        value={min_cluster_size}
                        onChange={(event) => { set_min_cluster_size(Math.max(parseInt(event.target.value), 2)) }}
                    />
                    <br></br>
                    <TextField
                        fullWidth
                        label="Min Cluster Samples"
                        type="number"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        value={min_cluster_samples}
                        onChange={(event) => { set_min_cluster_samples(Math.max(parseInt(event.target.value), 1)) }}
                    />
                    <br></br>
                    <FormControlLabel
                        control={<Checkbox color="primary" checked={allow_single_cluster} onChange={(event) => { set_allow_single_cluster(event.target.checked) }} />}
                        label="Allow Single Cluster"
                    />
                </Box> :
                <Box paddingLeft={7} paddingRight={7}>
                    <Slider
                        track={false}
                        defaultValue={1}
                        aria-labelledby="discrete-slider-custom"
                        step={1}
                        marks={marks}
                        min={0}
                        max={2}
                        value={clusterSliderValue}
                        onChange={(event, newValue) => handleClusterSliderChange(newValue, clusterSelectionOnly)}
                    />
                </Box>
            }
            <Box p={2}>
                <Button
                    variant="outlined"
                    style={{
                        width: '100%'
                    }}
                    onClick={() => {
                        calc_hdbscan(min_cluster_size, min_cluster_samples, allow_single_cluster, cancellablePromise, clusterSelectionOnly, addClusterToCurrentStory);
                        setOpenClusterPanel(false);
                    }}>
                    Run Clustering{/* Projection-based Clustering */}
                </Button>
            </Box>
        </Popover>



        <Box paddingLeft={2} paddingTop={2}>
            <Typography variant="subtitle2" gutterBottom>{'Groups and Stories'}</Typography>
        </Box>

        <Box paddingLeft={2} paddingRight={2} paddingBottom={2}>
            <StoryPreview></StoryPreview>
        </Box>

        <div style={{ overflowY: 'auto', height: '100px', flex: '1 1 auto' }}>
            <ClusterList
                dataset={dataset}
                removeClusterFromStories={removeClusterFromStories}
                selectedClusters={currentAggregation.selectedClusters}
                stories={stories}
                // setLineUpInput_data={setLineUpInput_data}
                updateLineUpInput_filter={updateLineUpInput_filter}
                setLineUpInput_update={setLineUpInput_update}
                setLineUpInput_visibility={setLineUpInput_visibility}
                setLineUpInput_filter={setLineUpInput_filter}
                splitRef={splitRef}
                setSelectedCluster={setSelectedClusters}
            ></ClusterList>
        </div>
    </div>
})

type ClusterPopoverProps = {
    anchorEl: any
    setAnchorEl: any
    cluster: ICluster
    removeClusterFromStories: any
    // setLineUpInput_data: any
    updateLineUpInput_filter: any
    setLineUpInput_update: any
    setLineUpInput_visibility: any
    setLineUpInput_filter: any
    splitRef: any
    setSelectedCluster: any
    dataset: Dataset
}

function ClusterPopover({
    anchorEl,
    setAnchorEl,
    cluster,
    dataset,
    removeClusterFromStories,
    updateLineUpInput_filter,
    setLineUpInput_visibility,
    setLineUpInput_filter,
    setLineUpInput_update,
    splitRef,
    setSelectedCluster
}: ClusterPopoverProps) {

    if (!cluster) return null;

    const [name, setName] = React.useState(cluster.label)

    const useStyles = makeStyles(theme => ({
        button: {
            margin: theme.spacing(1)
        },
        root: {
            padding: theme.spacing(3, 2)
        }
    }))

    const classes = useStyles()

    React.useEffect(() => {
        if (cluster && anchorEl) {
            setName(cluster.label)
        }
    }, [anchorEl, cluster])

    const onSave = () => {
        updateLineUpInput_filter({ "key": 'groupLabel', 'val_old': cluster.label, 'val_new': name });
        cluster.label = name
        // Rename cluster labels in dataset
        replaceClusterLabels(cluster.indices.map(i => dataset.vectors[i]), cluster.label, name)
        setAnchorEl(null)

        setLineUpInput_update();
    }

    const onDelete = () => {
        setAnchorEl(null)
        removeClusterFromStories(cluster)
    }

    const onLineup = () => {
        setAnchorEl(null)
        // setLineUpInput_data(cluster.vectors)
        setLineUpInput_visibility(true)
        setLineUpInput_filter({ 'groupLabel': cluster.label });
        setSelectedCluster([cluster])

        const curr_sizes = splitRef.current.split.getSizes();
        if (curr_sizes[1] < 2) {
            splitRef.current.split.setSizes([curr_sizes[0], 70])
        }
    }

    return <Popover
        id={"dialog to open"}
        open={anchorEl !== null}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
        transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
        }}
    >
        <div>
            <Paper className={classes.root}>
                {/* <Typography variant="h6" className={classes.button} gutterBottom>Settings</Typography> */}

                <Button
                    className={classes.button}
                    variant="outlined"
                    // color="secondary"
                    onClick={onDelete}
                    startIcon={<DeleteIcon />}
                >
                    Delete Group
                </Button>

                <FormGroup>
                    <TextField
                        className={classes.button}
                        id="option3"
                        label="Group Name"
                        value={name}
                        onChange={(event) => { setName(event.target.value) }}
                        margin="normal"
                    />

                    <div style={{ display: 'flex' }}>
                        <Button
                            color="primary"
                            variant="contained"
                            aria-label="Save"
                            className={classes.button}
                            onClick={onSave}
                            startIcon={<SaveIcon />}
                        >Save
                            {/* Name */}
                        </Button>
                        <Button
                            className={classes.button}
                            onClick={onLineup}
                            variant="outlined"
                        >Show Group in Table</Button>
                    </div>




                </FormGroup>
            </Paper>
        </div>

    </Popover>
}


type ClusterListProps = {
    selectedClusters: string[]
    stories: StoriesType
    removeClusterFromStories
    updateLineUpInput_filter
    setLineUpInput_update
    setLineUpInput_visibility
    setLineUpInput_filter
    splitRef
    setSelectedCluster
    dataset
}



function ClusterList({
    selectedClusters,
    stories,
    dataset,
    removeClusterFromStories,
    // setLineUpInput_data,
    updateLineUpInput_filter,
    setLineUpInput_update,
    setLineUpInput_visibility,
    setLineUpInput_filter,
    splitRef,
    setSelectedCluster
}: ClusterListProps) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [popoverCluster, setPopoverCluster] = React.useState<ICluster>(null)

    const activeStory = stories.stories[stories.active]

    const storyItems = new Array<JSX.Element>()

    if (activeStory) {
        for (const [key, cluster] of Object.entries(activeStory.clusters.byId)) {
            storyItems.push(<ListItem key={key} button selected={selectedClusters.includes(key)} onClick={(event) => {
                setSelectedCluster([key], event.ctrlKey)
            }}>
                <ListItemText
                    primary={ACluster.getTextRepresentation(cluster)}
                    secondary={`${cluster.indices.length} Items`}
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="delete" onClick={(event) => {
                        //removeClusterFromStories(cluster)
                        setPopoverCluster(cluster)
                        setAnchorEl(event.target)
                    }}>
                        <SettingsIcon />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>)
        }
    }

    return <div>
        <ClusterPopover
            anchorEl={anchorEl}
            dataset={dataset}
            setAnchorEl={setAnchorEl}
            cluster={popoverCluster}
            removeClusterFromStories={removeClusterFromStories}
            setLineUpInput_visibility={setLineUpInput_visibility}
            setLineUpInput_filter={setLineUpInput_filter}
            setLineUpInput_update={setLineUpInput_update}
            updateLineUpInput_filter={updateLineUpInput_filter}
            // setLineUpInput_data={setLineUpInput_data}
            splitRef={splitRef}
            setSelectedCluster={setSelectedCluster}
        ></ClusterPopover>

        <List>
            {storyItems}
        </List>
    </div>
}