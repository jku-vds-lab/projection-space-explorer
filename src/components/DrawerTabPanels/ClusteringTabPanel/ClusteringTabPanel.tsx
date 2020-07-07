import { FunctionComponent } from "react"
import { FlexParent } from "../../library/grid"
import React = require("react")
import { Button } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { ClusterWindow } from "../../projection/integration"
import { StoryPreview } from "../../clustering/StoryPreview/StoryPreview"
import { connect } from 'react-redux'
import { annotateVectors } from "../../util/tools"
import Cluster, { Story } from "../../library/Cluster"
import { graphLayout, Edge } from "../../util/graphs"

var worker = new Worker('dist/cluster.js')


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




type ClusteringTabPanelProps = {
    backendRunning: boolean
    clusteringWorker: any
    dataset: any
    activeStory?: any
    setActiveStory?: any
    stories?: any
    onClusteringStart?: any
    annotate?: any
    open: boolean
}


const mapStateToProps = state => ({
    currentAggregation: state.currentAggregation,
    stories: state.stories,
    activeStory: state.activeStory
})

const mapDispatchToProps = dispatch => ({
    setCurrentClusters: clusters => dispatch({
        type: 'SET_CURRENT_CLUSTERS',
        currentClusters: clusters
    }),
    setStories: stories => dispatch({
        type: 'SET_STORIES',
        stories: stories
    }),
    setActiveStory: activeStory => dispatch({
        type: 'SET_ACTIVE_STORY',
        activeStory: activeStory
    }),
    setClusterEdges: clusterEdges => dispatch({
        type: 'SET_CLUSTER_EDGES',
        clusterEdges: clusterEdges
    })
})




export const ClusteringTabPanel: FunctionComponent<ClusteringTabPanelProps> = connect(mapStateToProps, mapDispatchToProps)(({ setCurrentClusters,
    setStories, setActiveStory,
    currentAggregation, open, backendRunning, clusteringWorker,
    dataset, stories, setClusterEdges }) => {

    const [clusterId, setClusterId] = React.useState(0)


    function storyLayout(edges: Edge[]) {
        var stories: Story[] = []
        var copy = edges.slice(0)
        // hh
        while (copy.length > 0) {
            var toProcess = [ copy.splice(0, 1)[0] ]

            var clusters = new Set()


            while (toProcess.length > 0) {
                var edge = toProcess.splice(0, 1)[0]
                do {
                    clusters.add(edge.source)
                    clusters.add(edge.destination)
    
                    var idx = copy.findIndex(value => value.destination == edge.source || value.source == edge.destination)
                    if (idx >= 0) {
                        var removed = copy.splice(idx, 1)[0]
                        clusters.add(removed.source)
                        clusters.add(removed.destination)
                        toProcess.push(removed)
                    }
                } while (idx >= 0)
            }


            stories.push(new Story([... clusters]))
        }
        return stories
    }

    function toggleClusters() {
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
                    vecs.push(dataset.vectors[point.meshIndex])
                })
                cluster.vectors = vecs
            })

            const [edges] = graphLayout(clusters)

            setClusterEdges(edges)

            var stories = storyLayout(edges)

            setCurrentClusters(clusters)
            setStories(stories)
            setActiveStory(stories[0])
        }

        worker.postMessage({
            type: 'extract',
            message: dataset.vectors.map(vector => [vector.x, vector.y, vector.clusterLabel])
        })

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


            console.log("set state")
            console.log(clusters)

            var story = new Story(clusters.slice(0, 9))
            setCurrentClusters(clusters)
            setStories([story])
            setActiveStory(story)

            /**this.setState((state, props) => {
                var colorAttribute = state.categoryOptions.json.find(e => e.category == 'color').attributes
                if (!colorAttribute.find(e => e.key == 'clusterLabel')) {
                    colorAttribute.push({
                        "key": 'clusterLabel',
                        "name": 'clusterLabel',
                        "type": "categorical"
                    })
                }



                var transparencyAttribute = state.categoryOptions.json.find(e => e.category == 'transparency').attributes
                if (!transparencyAttribute.find(e => e.key == 'clusterProbability')) {
                    transparencyAttribute.push({
                        "key": 'clusterProbability',
                        "name": 'clusterProbability',
                        "type": "sequential",
                        "values": {
                            "range": [0.2, 1]
                        }
                    })
                }



                this.threeRef.current.createClusters(clusters)

                var story = new Story(clusters.slice(0, 9))

                return {
                    categoryOptions: state.categoryOptions,
                    clusteringOpen: false,
                    clusteringWorker: null,
                    clusters: clusters,
                    stories: [story],
                    activeStory: story
                }
            })**/
        }
        worker.postMessage({
            type: 'point',
            load: dataset.vectors.map(vector => [vector.x, vector.y])
        })


        /**this.setState((state, props) => {
            return {
                clusteringOpen: true,
                clusteringWorker: worker
            }
        })**/
    }





    React.useEffect(() => {
        worker.onmessage = function () {
            console.log("resulted in ...")
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
            variant='outlined'
            style={{
                margin: '8px 0'
            }}
            onClick={() => {
                annotateVectors(currentAggregation, clusterId)
                setClusterId(clusterId + 1)
            }}
        >Annotate Cluster</Button>

        <Button
            variant='outlined'
            style={{
                margin: '8px 0'
            }}
            onClick={() => {
                annotateVectors(dataset.vectors, -1)
            }}
        >Reset Clustering</Button>

        <Button
            variant="outlined"
            disabled={backendRunning == false}
            style={{
                margin: '8px 0'
            }}
            onClick={() => {
                //onClusteringStart()
                onClusteringStartClick()
            }}>Start Clustering</Button>

        <Button
            variant="outlined"
            disabled={backendRunning == false}
            style={{
                margin: '8px 0'
            }}
            onClick={() => {
                this.onSegmentClustering()
            }}>Segment Clustering</Button>

        {backendRunning ? <div></div> : <Alert severity="error">No backend detected!</Alert>}

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

        <StoryPreview type={dataset?.info.type} stories={stories}></StoryPreview>
    </FlexParent>

})



