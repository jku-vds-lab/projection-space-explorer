import * as sigma from 'graphology-layout-forceatlas2'
import React = require('react');
import { Button, Box, LinearProgress, Typography } from '@material-ui/core';
import { Dataset, DataLine, Vect } from '../../../util/datasetselector';
import { connect } from 'react-redux'
const Graph = require('graphology');
import * as FA2Layout from 'graphology-layout-forceatlas2/worker';

console.log(FA2Layout)

console.log(sigma)
type ForceEmbeddingProps = {
    webGLView: any
    dataset: Dataset
}

const mapStateToProps = state => ({
    webGLView: state.webGLView,
    dataset: state.dataset
})

function buildGraph(segments: DataLine[]) {
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
    console.log(dups)
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

export var ForceEmbedding = connect(mapStateToProps)(class extends React.Component<ForceEmbeddingProps> {
    constructor(props) {
        super(props)

        this.state = {
            progress: 0
        }
    }

    force() {
        let graph = new Graph()

        const [nodes, edges] = buildGraph(this.props.dataset.segments)

        nodes.forEach(node => {
            graph.addNode(node.view.meshIndex, {
                x: node.x,
                y: node.y
            })
        })
        edges.forEach(edge => {
            graph.addEdge(edge.source, edge.destination)
        })


        let worker = new Worker("dist/force.js")
        let self = this
        worker.onmessage = function (e) {
            switch (e.data.type) {
                case 'progress':
                    self.setState({
                        progress: e.data.progress
                    })
                    break
                case 'finish':
                    self.setState({
                        progress: 100
                    })
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
            params: { iterations: 300 }
        })
    }

    render() {
        return <div><Button onClick={() => {
            this.force()
        }}>Force</Button>

            <LinearProgressWithLabel value={this.state.progress} /></div>
    }
})