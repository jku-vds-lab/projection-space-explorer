import React = require("react")
import { Avatar, Box, Button, Checkbox, FormGroup, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, makeStyles, Paper, Popover, Switch, TextField, Typography } from "@material-ui/core"
import { connect, ConnectedProps } from 'react-redux'
import Cluster from "../../Utility/Data/Cluster"
import { Story } from "../../Utility/Data/Story"
import { graphLayout, Edge } from "../../Utility/graphs"
import SettingsIcon from '@material-ui/icons/Settings';
import { setSelectedClusters } from "../../Ducks/SelectedClustersDuck"
import { setClusterEdgesAction } from "../../Ducks/ClusterEdgesDuck"
import { DisplayMode, setDisplayMode } from "../../Ducks/DisplayModeDuck"
import { addClusterToStory, addStory, removeClusterFromStories, setActiveStory, setStories } from "../../Ducks/StoriesDuck"
import { RootState } from "../../Store/Store"
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import { StoryPreview } from "./StoryPreview"
import * as backend_utils from "../../../utils/backend-connect";
import * as frontend_utils from "../../../utils/frontend-connect";
import Slider from '@material-ui/core/Slider';
import { trackPromise } from "react-promise-tracker";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import { setLineUpInput_data, setLineUpInput_visibility } from "../../Ducks/LineUpInputDuck"
import { setChannelColor } from "../../Ducks/ChannelColorDuck"
const d3 = require("d3")

const mapStateToProps = (state: RootState) => ({
    currentAggregation: state.currentAggregation,
    stories: state.stories,
    displayMode: state.displayMode,
    dataset: state.dataset,
    webGLView: state.webGLView,
    selectedClusters: state.selectedClusters,
    categoryOptions: state.categoryOptions
})

const mapDispatchToProps = dispatch => ({
    setStories: stories => dispatch(setStories(stories)),
    setActiveStory: (activeStory: Story) => dispatch(setActiveStory(activeStory)),
    setClusterEdges: clusterEdges => dispatch(setClusterEdgesAction(clusterEdges)),
    setDisplayMode: displayMode => dispatch(setDisplayMode(displayMode)),
    setSelectedClusters: value => dispatch(setSelectedClusters(value)),
    addClusterToStory: cluster => dispatch(addClusterToStory(cluster)),
    addStory: story => dispatch(addStory(story)),
    removeClusterFromStories: cluster => dispatch(removeClusterFromStories(cluster)),
    setChannelColor: col => dispatch(setChannelColor(col)),
    setLineUpInput_data: input => dispatch(setLineUpInput_data(input)),
    setLineUpInput_visibility: input => dispatch(setLineUpInput_visibility(input)),
})

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    open,
    backendRunning,
    clusteringWorker
}








export const ClusteringTabPanel = connector(({
    categoryOptions,
    setChannelColor,
    setStories,
    setActiveStory,
    currentAggregation,
    clusteringWorker,
    dataset,
    stories,
    setClusterEdges,
    setDisplayMode,
    displayMode,
    setSelectedClusters,
    addStory,
    addClusterToStory,
    removeClusterFromStories,
    webGLView,
    selectedClusters,
    setLineUpInput_data,
    setLineUpInput_visibility }: Props) => {


    function storyLayout(edges: Edge[]) {
        var stories: Story[] = []
        var copy = edges.slice(0)
        // hh
        while (copy.length > 0) {
            var toProcess = [copy.splice(0, 1)[0]]

            var clusters = new Set()
            var storyEdges = new Set()


            while (toProcess.length > 0) {
                var edge = toProcess.splice(0, 1)[0]
                do {
                    clusters.add(edge.source)
                    clusters.add(edge.destination)
                    storyEdges.add(edge)

                    var idx = copy.findIndex(value => value.destination == edge.source || value.source == edge.destination)
                    if (idx >= 0) {
                        var removed = copy.splice(idx, 1)[0]
                        clusters.add(removed.source)
                        clusters.add(removed.destination)
                        storyEdges.add(removed)
                        toProcess.push(removed)
                    }
                } while (idx >= 0)
            }


            stories.push(new Story([...clusters], [...storyEdges]))
        }
        return stories
    }

    function toggleClusters() {
        if (null == null) {
            if (dataset.clusters && dataset.clusters.length > 0) {
                let clusters = dataset.clusters

                if (dataset.clusterEdges && dataset.clusterEdges.length > 0) {
                    setClusterEdges(dataset.clusterEdges)

                    //let stories = storyLayout(dataset.clusterEdges)

                    //setStories(stories)
                    setStories([new Story(dataset.clusters, dataset.clusterEdges)])

                    //setActiveStory(stories[0])
                } else {
                    if (dataset.isSequential) {
                        const [edges] = graphLayout(clusters)

                        setClusterEdges(edges)

                        if (edges.length > 0) {
                            let stories = storyLayout(edges)

                            setStories(stories)
                            //setActiveStory(stories[0])
                        }
                    }
                }
            } else {
                let worker = new Worker(frontend_utils.BASE_PATH + 'cluster.js') //dist/

                worker.onmessage = (e) => {
                    // Point clusteruing
                    let clusters = []
                    Object.keys(e.data).forEach(k => {
                        let t = e.data[k]
                        let f = new Cluster(t.points, t.bounds, t.hull, t.triangulation)
                        f.label = k
                        clusters.push(f)
                    })


                    // Inject cluster attributes
                    clusters.forEach(cluster => {
                        let vecs = []
                        cluster.points.forEach(point => {
                            vecs.push(dataset.vectors[point.meshIndex])
                        })
                        cluster.vectors = vecs
                        cluster.points = cluster.vectors
                    })

                    if (dataset.clusterEdges && dataset.clusterEdges.length > 0) {
                        setClusterEdges(dataset.clusterEdges)

                        let stories = storyLayout(dataset.clusterEdges)

                        setStories(stories)


                        //setActiveStory(stories[0])
                    } else {
                        if (dataset.isSequential) {
                            const [edges] = graphLayout(clusters)

                            setClusterEdges(edges)

                            if (edges.length > 0) {
                                let stories = storyLayout(edges)

                                setStories(stories)
                                //setActiveStory(stories[0])
                            }
                        }
                    }
                }

                worker.postMessage({
                    type: 'extract',
                    message: dataset.vectors.map(vector => [vector.x, vector.y, vector.clusterLabel])
                })
            }
        }
    }


    function calc_hdbscan(min_cluster_size, min_cluster_samples, allow_single_cluster) {
        const points = dataset.vectors.map(point => [point.x, point.y]);
        trackPromise(
            backend_utils.calculate_hdbscan_clusters(points, min_cluster_size, min_cluster_samples, allow_single_cluster).then(data => {
                const cluster_labels = data["result"];
                const dist_cluster_labels = cluster_labels.filter((value, index, self) => { return self.indexOf(value) === index; }); //return distinct list of clusters

                let story = new Story([], []);
                let clusters = []


                dist_cluster_labels.forEach(cluster_label => {
                    if (cluster_label >= 0) {
                        const current_cluster_vects = dataset.vectors.filter((x, i) => cluster_labels[i] == cluster_label);
                        const cluster = Cluster.fromSamples(current_cluster_vects);

                        // Set correct label for cluster
                        cluster.label = cluster_label
                        clusters.push(cluster)

                        story.clusters.push(cluster)
                    }
                });

                addStory(story)
                setActiveStory(story)

                // Update UI, dont know how to right now
                var clusterAttribute = categoryOptions.getAttribute("color", "clusterLabel", "categorical")

                if (clusterAttribute) {
                    setChannelColor(clusterAttribute)
                }

                let c =
                d3.contourDensity()
                    .x(d => d.x)
                    .y(d => d.y)
                    .size([500, 500])
                    .bandwidth(30)
                    .thresholds(30)
                    (dataset.vectors.map(vect => ({x: vect.x, y: vect.y})))

                console.log(c)
            })
        );
    }

    const [clusterAdvancedMode, setClusterAdvancedMode] = React.useState(false);
    const [clusterSliderValue, setClusterSliderValue] = React.useState(2);
    const [min_cluster_size, set_min_cluster_size] = React.useState(5);
    const [min_cluster_samples, set_min_cluster_samples] = React.useState(1);
    const [allow_single_cluster, set_allow_single_cluster] = React.useState(false);

    const handleClusterSliderChange = (event, newValue) => {
        switch (newValue) {
            case 0:
                set_min_cluster_size(Math.max(dataset.vectors.length / 100, 20));
                set_min_cluster_samples(Math.round(min_cluster_size / 2))
                set_allow_single_cluster(true);
                break;
            case 1:
                set_min_cluster_size(Math.max(dataset.vectors.length / 100, 9));
                set_min_cluster_samples(Math.round(min_cluster_size / 2))
                set_allow_single_cluster(false);
                break;
            case 2:
                set_min_cluster_size(5);
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

        <Box paddingLeft={2}>
            <FormControlLabel
                control={<Switch checked={displayMode != DisplayMode.OnlyClusters && displayMode != DisplayMode.None} onChange={onCheckItems} />}
                label="Show Items"
            />
            <FormControlLabel
                control={<Switch checked={displayMode != DisplayMode.OnlyStates && displayMode != DisplayMode.None} onChange={onCheckClusters} />}
                label="Show Clusters"
            />
        </Box>

        <Box paddingLeft={2} paddingTop={2}>
            <Typography variant="subtitle2" gutterBottom>{'Cluster Settings'}</Typography>
        </Box>
        <Box paddingLeft={2}>
            <FormControlLabel
                control={
                    <Switch
                        checked={clusterAdvancedMode}
                        onChange={(event, newValue) => { setClusterAdvancedMode(newValue) }}
                        name="advancedClustering"
                    />
                }
                label="Advanced"
            />
        </Box>
        {clusterAdvancedMode ?
            <Box paddingLeft={2}>
                <TextField
                    label="min Cluster Size"
                    type="number"
                    InputLabelProps={{
                        shrink: true,

                    }}
                    value={min_cluster_size}
                    onChange={(event) => { set_min_cluster_size(Math.max(parseInt(event.target.value), 2)) }}
                />
                <TextField
                    label="min Cluster Samples"
                    type="number"
                    InputLabelProps={{
                        shrink: true,
                    }}
                    value={min_cluster_samples}
                    onChange={(event) => { set_min_cluster_samples(Math.max(parseInt(event.target.value), 1)) }}
                />
                <FormControlLabel
                    control={<Checkbox checked={allow_single_cluster} onChange={(event) => { set_allow_single_cluster(event.target.checked) }} />}
                    label="Allow Single Cluster"
                />
            </Box> :
            <Box paddingLeft={7} paddingRight={7}>
                <Slider
                    defaultValue={2}
                    aria-labelledby="discrete-slider-custom"
                    step={1}
                    marks={marks}
                    min={0}
                    max={2}
                    value={clusterSliderValue}
                    onChange={handleClusterSliderChange}
                />
            </Box>
        }
        <Box p={2}>
            <Button
                variant="outlined"
                style={{
                    width: '100%'
                }}
                onClick={() => { calc_hdbscan(min_cluster_size, min_cluster_samples, allow_single_cluster) }}>Projection-based Clustering</Button>
        </Box>

        <Box paddingLeft={2} paddingTop={2}>
            <Typography variant="subtitle2" gutterBottom>{'Groups and Stories'}</Typography>
        </Box>

        <Box paddingLeft={2} paddingRight={2} paddingBottom={2}>
            <StoryPreview></StoryPreview>
        </Box>

        <div style={{ overflowY: 'auto', height: '100px', flex: '1 1 auto' }}>
            <ClusterList
                removeClusterFromStories={removeClusterFromStories}
                selectedClusters={selectedClusters}
                webGLView={webGLView}
                stories={stories}
                setLineUpInput_data={setLineUpInput_data}
                setLineUpInput_visibility={setLineUpInput_visibility}
            ></ClusterList>
        </div>
    </div>
})

type ClusterPopoverProps = {
    anchorEl: any
    setAnchorEl: any
    cluster: Cluster
    removeClusterFromStories: any
    setLineUpInput_data: any
    setLineUpInput_visibility: any
}

function ClusterPopover({
    anchorEl,
    setAnchorEl,
    cluster,
    removeClusterFromStories,
    setLineUpInput_data,
    setLineUpInput_visibility
}: ClusterPopoverProps) {

    if (!cluster) return null;

    const [name, setName] = React.useState(cluster.name)

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
            setName(cluster.getTextRepresentation())

        }
    }, [anchorEl, cluster])

    const onSave = () => {
        cluster.name = name
        setAnchorEl(null)
    }

    const onDelete = () => {
        setAnchorEl(null)
        removeClusterFromStories(cluster)
    }

    const onLineup = () => {
        setAnchorEl(null)
        setLineUpInput_data(cluster.vectors)
        setLineUpInput_visibility(true)
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
                <Typography variant="h6" className={classes.button} gutterBottom>Settings</Typography>

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
                            className={classes.button}
                            onClick={onLineup}
                            variant="outlined"
                        >LineUp</Button>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="secondary"
                            onClick={onDelete}
                            startIcon={<DeleteIcon />}
                        >
                            Delete
                    </Button>
                    </div>



                    <Button
                        className={classes.button}
                        onClick={onSave}
                        variant="outlined"
                    >Save</Button>
                </FormGroup>
            </Paper>
        </div>

    </Popover>
}

function ClusterList({
    selectedClusters,
    webGLView,
    stories,
    removeClusterFromStories,
    setLineUpInput_data,
    setLineUpInput_visibility
}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [popoverCluster, setPopoverCluster] = React.useState(null)

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };



    return <div>
        <ClusterPopover
            anchorEl={anchorEl}
            setAnchorEl={setAnchorEl}
            cluster={popoverCluster}
            removeClusterFromStories={removeClusterFromStories}
            setLineUpInput_visibility={setLineUpInput_visibility}
            setLineUpInput_data={setLineUpInput_data}
        ></ClusterPopover>

        <List>
            {stories.active?.clusters.map((cluster, key) => {
                return <ListItem key={key} button selected={selectedClusters.includes(cluster)} onClick={(event) => {
                    webGLView.current.onClusterClicked(cluster, event.shiftKey)
                }}>
                    <ListItemAvatar>
                        <Avatar>
                            <FolderIcon />
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={cluster.getTextRepresentation()}
                        secondary={`${cluster.vectors.length} Samples`}
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
                </ListItem>
            })
            }
        </List>
    </div>
}