import React = require('react');
import { Button, Box, LinearProgress, Typography, Checkbox, FormControlLabel, TextField, Paper, Tooltip, Grid } from '@material-ui/core';
import { DataLine } from '../../../util/datasetselector';
import { Dataset } from "../../../util/Data/Dataset";
import { connect } from 'react-redux'
const Graph = require('graphology');
import Modal from '@material-ui/core/Modal';
import './ForceEmbedding.scss'
import Alert from '@material-ui/lab/Alert';
import { FlexParent } from '../../../util/FlexParent';

type ForceEmbeddingProps = {
    webGLView: any
    dataset: Dataset
}

const mapStateToProps = state => ({
    webGLView: state.webGLView,
    dataset: state.dataset
})

function buildGraph(segments: DataLine[], reuse) {
    let nodes = []
    let edges = []

    let dups = []
    segments.forEach(segment => {
        let prev = null
        let prevWasDuplicate = false

        segment.vectors.forEach((sample, i) => {
            let fIdx = nodes.findIndex(e => e.x == sample.x && e.y == sample.y)
            let isDuplicate = fIdx >= 0

            if (isDuplicate) {
                dups.push(sample)
                // If we have a duplicate, add edge only
                if (!prevWasDuplicate && i != 0) {
                    edges.push({ source: prev.view.meshIndex, destination: nodes[fIdx].view.meshIndex })
                }
                sample.view.duplicateOf = fIdx
            } else {
                nodes.push(sample)
                if (i != 0) {
                    edges.push({ source: prev.view.meshIndex, destination: sample.view.meshIndex })
                }
                sample.view.duplicateOf = nodes.length - 1
            }

            prevWasDuplicate = isDuplicate
            prev = isDuplicate ? nodes[fIdx] : sample
        })
    })
    return [nodes, edges]
}

function LinearProgressWithLabel(props) {
    return (
        <Box display="flex" alignItems="center">
            <Box width="100%" mr={1}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box minWidth={35}>
                <Typography variant="body2" color="textSecondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

export var ForceEmbedding = connect(mapStateToProps)(class extends React.Component<ForceEmbeddingProps, any> {
    constructor(props) {
        super(props)

        this.state = {
            progress: 0,
            reusePositions: true,
            openModal: false,
            iterations: 1000,
            worker: null
        }
    }

    force() {
        let graph = new Graph()

        const [nodes, edges] = buildGraph(this.props.dataset.segments, this.state.reusePositions)

        nodes.forEach(node => {
            if (!this.state.reusePositions) {
                node.x = Math.random()
                node.y = Math.random()
            }
            graph.addNode(node.view.meshIndex, {
                x: this.state.reusePositions ? node.x : Math.random(),
                y: this.state.reusePositions ? node.y : Math.random()
            })
        })
        edges.forEach(edge => {
            graph.addEdge(edge.source, edge.destination)
        })


        let worker = new Worker("dist/forceatlas2.js")
        this.setState({
            worker: worker
        })

        let self = this
        worker.onmessage = function (e) {
            switch (e.data.type) {
                case 'progress':
                case 'finish':
                    if (e.data.type == 'finish') {
                        self.setState({
                            progress: e.data.progress,
                            worker: null
                        })
                    } else {
                        self.setState({
                            progress: e.data.progress
                        })
                    }

                    let positions = e.data.positions

                    self.props.dataset.vectors.forEach((sample, i) => {
                        let idx = nodes[sample.view.duplicateOf].view.meshIndex
                        sample.x = positions[idx].x
                        sample.y = positions[idx].y
                    })
                    self.props.webGLView.current.updateXY()
                    break
            }

        }
        worker.postMessage({
            nodes: nodes.map(e => ({ x: e.x, y: e.y, meshIndex: e.view.meshIndex })),
            edges: edges,
            params: { iterations: self.state.iterations }
        })
    }

    handleClose() {
        this.setState({
            openModal: false
        })
    }

    isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    render() {
        return <FlexParent
            alignItems='stretch'
            flexDirection='column'
            justifyContent=''>
            {
                this.props.dataset && !this.props.dataset.isSequential && <Alert severity="info">Force Embedding is only available with a valid line attribute!</Alert>
            }
            <Button
                variant="outlined" disabled={!this.props.dataset?.isSequential} onClick={() => {
                    if (this.state.worker) {
                        this.state.worker.terminate()
                        this.setState({
                            worker: null
                        })
                    } else {
                        this.setState({
                            openModal: true
                        })
                    }

                }}>{this.state.worker ? "Stop Force Embedding" : "ForceAtlas2"}</Button>


            <Modal
                open={this.state.openModal}
                onClose={() => this.handleClose()}
                aria-labelledby="simple-modal-title"
                aria-describedby="simple-modal-description"
            >
                <Paper className="ForceEmbeddingModal">
                    <h2 id="simple-modal-title">ForceAtlas2</h2>
                    <div>
                        <TextField
                            id="standard-number"
                            label="Iterations"
                            type="number"
                            value={this.state.iterations}
                            onChange={(event) => {
                                if (this.isNumeric(event.target.value) && parseFloat(event.target.value) > 0) {
                                    this.setState({
                                        iterations: parseFloat(event.target.value)
                                    })
                                }
                            }}
                        />
                    </div>

                    <div>
                        <Tooltip title="If this is checked, the embedding will be initialized with the current positions. Otherwise it will be initialized with random positions." aria-label="add">
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={this.state.reusePositions}
                                        onChange={(e, newVal) => {
                                            this.setState({
                                                reusePositions: newVal
                                            })
                                        }}
                                        name="checkedB"
                                        color="primary"
                                    />
                                }
                                label="Initialize with sample positions"
                            />
                        </Tooltip>

                    </div>

                    <div>
                        <Button onClick={() => {
                            this.setState({
                                openModal: false
                            })
                            this.force()
                        }}>Start</Button>
                    </div>
                </Paper>
            </Modal>


            {this.state.worker && <LinearProgressWithLabel value={this.state.progress} />}
        </FlexParent>
    }
})