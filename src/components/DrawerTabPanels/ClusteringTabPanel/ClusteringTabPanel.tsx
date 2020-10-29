import { FunctionComponent } from "react"
import { FlexParent } from "../../util/FlexParent"
import React = require("react")
import { Avatar, Button, FormControl, FormControlLabel, FormGroup, FormLabel, IconButton, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, makeStyles, Switch, Typography } from "@material-ui/core"
import { ClusterWindow } from "../../projection/integration"
import { StoryPreview } from "../StoryTabPanel/StoryPreview/StoryPreview"
import { connect, ConnectedProps } from 'react-redux'
import Cluster, { Story } from "../../util/Cluster"
import { graphLayout, Edge } from "../../util/graphs"

import { setSelectedClusters } from "../../Ducks/SelectedClustersDuck"
import { setCurrentClustersAction } from "../../Ducks/CurrentClustersDuck"
import { setActiveStory } from "../../Ducks/ActiveStoryDuck"
import { setClusterEdgesAction } from "../../Ducks/ClusterEdgesDuck"
import { DisplayMode, setDisplayMode } from "../../Ducks/DisplayModeDuck"
import { setStories } from "../../Ducks/StoriesDuck"
import { StoryMode, setStoryMode } from "../../Ducks/StoryModeDuck"
import { RootState } from "../../Store/Store"
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';

var worker = new Worker('dist/cluster.js')

const useStyles = makeStyles((theme) => ({
    title: {
        margin: theme.spacing(4, 0, 2),
    },
    list: {
        maxHeight: 400,
        overflow: 'auto'
    }
}));


function downloadCSV(csv, filename) {
    var csvFile;
    var downloadLink;

    // CSV file
    csvFile = new Blob([csv], { type: "text/plain" });

    // Download link
    downloadLink = document.createElement("a");

    // File name
    downloadLink.download = filename;

    // Create a link to the file
    downloadLink.href = window.URL.createObjectURL(csvFile);

    // Hide download link
    downloadLink.style.display = "none";

    // Add the link to DOM
    document.body.appendChild(downloadLink);

    // Click download link
    downloadLink.click();
}

function arrayToCsv(values: any[]) {
    return values.join(',') + '\n'
}

function vectorAsXml(vectors, segments) {
    var str = ""
    str += vectors[0].pureHeader().join(',') + '\n'
    vectors.map((vector, i) => {
        str += arrayToCsv(vector.pureValues())
    })
    return str
}


const mapStateToProps = (state: RootState) => ({
    currentAggregation: state.currentAggregation,
    stories: state.stories,
    activeStory: state.activeStory,
    storyMode: state.storyMode,
    currentClusters: state.currentClusters,
    displayMode: state.displayMode,
    dataset: state.dataset
})

const mapDispatchToProps = dispatch => ({
    setCurrentClusters: clusters => dispatch(setCurrentClustersAction(clusters)),
    setStories: stories => dispatch(setStories(stories)),
    setActiveStory: activeStory => dispatch(setActiveStory(activeStory)),
    setClusterEdges: clusterEdges => dispatch(setClusterEdgesAction(clusterEdges)),
    setStoryMode: storyMode => dispatch(setStoryMode(storyMode)),
    setDisplayMode: displayMode => dispatch(setDisplayMode(displayMode)),
    setSelectedClusters: value => dispatch(setSelectedClusters(value))
})

const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    open,
    backendRunning,
    clusteringWorker
}

export const ClusteringTabPanel = connector(({ setCurrentClusters,
    setStories, setActiveStory,
    currentAggregation, open, backendRunning, clusteringWorker,
    dataset, stories, setClusterEdges, storyMode, setStoryMode,
    currentClusters, setDisplayMode, displayMode, setSelectedClusters }: Props) => {

    const [clusterId, setClusterId] = React.useState(0)
    const classes = useStyles()

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

        } else {
            setStories(null)
            setActiveStory(null)
            setCurrentClusters(null)
            setSelectedClusters([])
        }
    }





    function onClusteringStartClick() {
        var worker = new Worker('dist/cluster.js')
        worker.onmessage = (e) => {
            // Point clusteruing
            var clusters = []
            Object.keys(e.data).forEach(k => {
                var t = e.data[k]
                var f = new Cluster(t.points, t.bounds, t.hull, t.triangulation)
                f.label = k
                clusters.push(f)
            })


            // Inject cluster attributes
            clusters.forEach(cluster => {
                var vecs = []
                cluster.points.forEach(point => {
                    var label = point.label
                    var probability = point.probability
                    var index = point.meshIndex
                    vecs.push(dataset.vectors[point.meshIndex])

                    dataset.vectors[index]['clusterLabel'] = label

                    if (isNaN(probability)) {
                        dataset.vectors[index]['clusterProbability'] = 0
                    } else {
                        dataset.vectors[index]['clusterProbability'] = probability
                    }
                })
                cluster.vectors = vecs
            })

            var story = new Story(clusters.slice(0, 9), null)
            setCurrentClusters(clusters)
            setStories([story])
            setActiveStory(story)

            
        }
        worker.postMessage({
            type: 'point',
            load: dataset.vectors.map(vector => [vector.x, vector.y])
        })



    }


 

    React.useEffect(() => toggleClusters(), [dataset])

    React.useEffect(() => {
        worker.onmessage = function () {

        }
        worker.postMessage({
            type: 'triangulate',
            message: dataset.vectors.map(vector => [vector.x, vector.y, vector.clusterLabel])
        })
    }, [open])

    return <FlexParent
        alignItems='stretch'
        flexDirection='column'
        margin='0 16px'
        justifyContent=''
    >



        <Button
            variant="outlined"
            style={{
                margin: '8px 0'
            }}
            onClick={() => {
                downloadCSV(vectorAsXml(dataset.vectors, dataset.segments), "output.csv")
            }}>Download Dataset (CSV)</Button>

        <Button
            variant="outlined"
            style={{
                margin: '8px 0'
            }}
            onClick={() => {
                toggleClusters()
            }}>Toggle Clusters</Button>

        <FormControlLabel
            control={<Switch checked={storyMode == StoryMode.Difference} onChange={(event) => {
                setStoryMode(event.target.checked ? StoryMode.Difference : StoryMode.Cluster)
            }} name="test" />}
            label="Show Differences"
        />

        <FormControlLabel
            control={<Switch checked={displayMode == DisplayMode.OnlyClusters} onChange={(event) => {
                setDisplayMode(event.target.checked ? DisplayMode.OnlyClusters : DisplayMode.StatesAndClusters)
            }} name="test" />}
            label="Show Clusters Only"
        />

        <ClusterWindow
            worker={clusteringWorker}
            onClose={() => {
                var worker = clusteringWorker
                if (worker != null) {
                    worker.terminate()
                }

                this.setState({
                    clusteringWorker: null,
                    clusteringOpen: false
                })

            }}
        ></ClusterWindow>


        <Typography variant="h6" className={classes.title}>
            Clusters
        </Typography>
        <div>
            <List className={classes.list}>
                {currentClusters?.map((cluster, index) => {
                    return <ListItem>
                        <ListItemAvatar>
                            <Avatar>
                                <FolderIcon />
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={`Cluster ${index}`}
                            secondary={`${cluster.vectors.length} Samples`}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete">
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                })
                }
            </List>
        </div>



    </FlexParent>

})



