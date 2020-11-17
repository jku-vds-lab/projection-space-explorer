import React = require("react")
import { Avatar, Box, Button, FormControlLabel, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Switch, Typography } from "@material-ui/core"
import { connect, ConnectedProps } from 'react-redux'
import Cluster from "../../Utility/Data/Cluster"
import { Story } from "../../Utility/Data/Story"
import { graphLayout, Edge } from "../../Utility/graphs"

import { setSelectedClusters } from "../../Ducks/SelectedClustersDuck"
import { addCluster, removeCluster, setCurrentClustersAction } from "../../Ducks/CurrentClustersDuck"
import { setClusterEdgesAction } from "../../Ducks/ClusterEdgesDuck"
import { DisplayMode, setDisplayMode } from "../../Ducks/DisplayModeDuck"
import { addClusterToStory, addStory, removeClusterFromStories, setActiveStory, setStories } from "../../Ducks/StoriesDuck"
import { RootState } from "../../Store/Store"
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';


const mapStateToProps = (state: RootState) => ({
    currentAggregation: state.currentAggregation,
    stories: state.stories,
    currentClusters: state.currentClusters,
    displayMode: state.displayMode,
    dataset: state.dataset,
    webGLView: state.webGLView,
    selectedClusters: state.selectedClusters
})

const mapDispatchToProps = dispatch => ({
    setCurrentClusters: clusters => dispatch(setCurrentClustersAction(clusters)),
    setStories: stories => dispatch(setStories(stories)),
    setActiveStory: (activeStory: Story) => dispatch(setActiveStory(activeStory)),
    setClusterEdges: clusterEdges => dispatch(setClusterEdgesAction(clusterEdges)),
    setDisplayMode: displayMode => dispatch(setDisplayMode(displayMode)),
    setSelectedClusters: value => dispatch(setSelectedClusters(value)),
    addCluster: cluster => dispatch(addCluster(cluster)),
    addClusterToStory: cluster => dispatch(addClusterToStory(cluster)),
    removeCluster: cluster => dispatch(removeCluster(cluster)),
    addStory: story => dispatch(addStory(story)),
    removeClusterFromStories: cluster => dispatch(removeClusterFromStories(cluster))
})

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    open,
    backendRunning,
    clusteringWorker
}

export const ClusteringTabPanel = connector(({ setCurrentClusters,
    setStories,
    setActiveStory,
    currentAggregation,
    clusteringWorker,
    dataset,
    stories,
    setClusterEdges,
    currentClusters,
    setDisplayMode,
    displayMode,
    setSelectedClusters,
    addCluster,
    removeCluster,
    addStory,
    addClusterToStory,
    removeClusterFromStories,
    webGLView,
    selectedClusters }: Props) => {


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
        if (currentClusters == null) {
            if (dataset.clusters && dataset.clusters.length > 0) {
                let clusters = dataset.clusters

                setCurrentClusters(clusters)

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
            } else {
                let worker = new Worker('dist/cluster.js')

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


                    setCurrentClusters(clusters)

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
        } else {
            setStories(stories)
            setActiveStory(null)
            setCurrentClusters(null)
            setSelectedClusters([])
        }
    }


    React.useEffect(() => toggleClusters(), [dataset])

    return <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Box p={2}>
            <FormControlLabel
                control={<Switch checked={displayMode == DisplayMode.OnlyClusters} onChange={(event) => {
                    setDisplayMode(event.target.checked ? DisplayMode.OnlyClusters : DisplayMode.StatesAndClusters)
                }} name="test" />}
                label="Show Clusters Only"
            />


        </Box>


        <Box p={2}>
            <Typography variant="h6">
                Clusters
            </Typography>
        </Box>

        <Box paddingLeft={2} paddingRight={2}>
            <Button
                variant="outlined"
                style={{
                    width: '100%'
                }}
                onClick={() => {
                    if (currentAggregation.length > 0) {
                        let cluster = Cluster.fromSamples(currentAggregation)
                        addCluster(cluster)
                        if (!stories.active) {
                            let story = new Story([cluster], [])
                            addStory(story)
                            setActiveStory(story)
                        } else {
                            addClusterToStory(cluster)
                        }
                    }
                }}>Add From Selection</Button>
        </Box>

        <div style={{ overflowY: 'auto', height: '100px', flex: '1 1 auto' }}>
            <List>
                {currentClusters?.map((cluster, key) => {
                    return <ListItem key={key} button selected={selectedClusters.includes(cluster)} onClick={() => {
                        webGLView.current.onClusterClicked(cluster)
                    }}>
                        <ListItemAvatar>
                            <Avatar>
                                <FolderIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`Cluster ${cluster.label}`}
                            secondary={`${cluster.vectors.length} Samples`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" onClick={() => {
                                removeClusterFromStories(cluster)
                                removeCluster(cluster)
                            }}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                })
                }
            </List>
        </div>
    </div>
})