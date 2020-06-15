import { FunctionComponent } from "react"
import { FlexParent } from "../../library/grid"
import React = require("react")
import { Button } from "@material-ui/core"
import Alert from "@material-ui/lab/Alert"
import { ClusterWindow } from "../../projection/integration"
import { StoryPreview } from "../../clustering/StoryPreview/StoryPreview"
import { connect } from 'react-redux'
import { annotateVectors } from "../../util/tools"

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
    activeStory: any
    setActiveStory: any
    stories: any
    onClusteringStart: any
    annotate: any
    open: boolean
}


const mapStateToProps = state => ({
    currentAggregation: state.currentAggregation
})


export const ClusteringTabPanel: FunctionComponent<ClusteringTabPanelProps> = connect(mapStateToProps)(({ currentAggregation, open, backendRunning, clusteringWorker, dataset, activeStory, setActiveStory, stories, onClusteringStart }) => {
    const [clusterId, setClusterId] = React.useState(0)

    React.useEffect(() => {
        worker.onmessage = function() {
            console.log("resulted in ...")
        }
        worker.postMessage({
            type: 'triangulate',
            message: dataset.vectors.map(vector => [vector.x, vector.y, vector.clusterLabel]
        })
    }, [open])

    return <FlexParent
        alignItems='stretch'
        flexDirection='column'
        margin='0 16px'
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
            variant="outlined"
            disabled={backendRunning == false}
            style={{
                margin: '8px 0'
            }}
            onClick={() => {
                onClusteringStart()
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
            }}>TraClus download</Button>

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

        <StoryPreview type={dataset?.info.type} stories={stories} activeStory={activeStory} onChange={setActiveStory}></StoryPreview>
    </FlexParent>

})



