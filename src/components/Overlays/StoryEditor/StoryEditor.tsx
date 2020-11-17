import './StoryEditor.scss'
import React = require('react')
import { Paper, Tooltip, Typography } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import Cluster from '../../Utility/Data/Cluster';
import { Story } from "../../Utility/Data/Story";
const Graph = require('graphology');
import { connect, ConnectedProps } from 'react-redux'
import { DatasetType } from "../../Utility/Data/DatasetType";
import { Vect } from "../../Utility/Data/Vect";
import GestureIcon from '@material-ui/icons/Gesture';
import DeleteIcon from '@material-ui/icons/Delete';
import SelectAllIcon from '@material-ui/icons/SelectAll';
import { setAggregationAction } from "../../Ducks/AggregationDuck";
import { GenericFingerprint } from '../../Legends/Generic';
import { RootState } from '../../Store/Store';
import { addEdgeToActive, setActiveTrace } from '../../Ducks/StoriesDuck';
import { Edge } from '../../Utility/graphs';
import { openStoryEditor } from '../../Ducks/StoryEditorDuck';
import { getSyncNodes, VectBase } from '../../NumTs/NumTs';

export function rescalePoints(
    points: { x: number, y: number }[],
    width: number, height: number
) {
    var xAxis = Object.values(points).map(point => point.x)
    var yAxis = Object.values(points).map(point => point.y)

    var minX = Math.min(...xAxis)
    var maxX = Math.max(...xAxis)
    var minY = Math.min(...yAxis)
    var maxY = Math.max(...yAxis)

    let pointCenter = {
        x: (maxX + minX) / 2,
        y: (maxY + minY) / 2
    }

    let boardCenter = {
        x: width / 2,
        y: height / 2
    }

    let factor = {
        x: (width * 0.75) / (maxX - minX),
        y: (height * 0.75) / (maxY - minY)
    }

    Object.keys(points).forEach(pointKey => {
        let point = points[pointKey]
        point.x = boardCenter.x + (point.x - pointCenter.x) * factor.x
        point.y = boardCenter.y + (point.y - pointCenter.y) * factor.y
    })
}



enum SETool {
    Draw,
    Delete,
    Select,
    Dijkstra
}

enum SEAction {
    None,
    MakeEdge,
    MoveNode,
    PreparingMove
}

type StoryEditorState = {
    nodes: any[]
    edges: any[]
    tool: SETool
    dragLine: any
    source: any
    destination: any
}

const mapStateToProps = (state: RootState) => ({
    stories: state.stories,
    currentAggregation: state.currentAggregation,
    webGLView: state.webGLView,
    storyEditor: state.storyEditor
})


const mapDispatchToProps = dispatch => ({
    setCurrentAggregation: id => dispatch(setAggregationAction(id)),
    setActiveTrace: trace => dispatch(setActiveTrace(trace)),
    addEdgeToActive: edge => dispatch(addEdgeToActive(edge)),
    openStoryEditor: visible => dispatch(openStoryEditor(visible))
})

const connector = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
    setCurrentAggregation: any
    currentAggregation: Vect[]
    webGLView: any
}

export const StoryEditor = connector(class extends React.Component<Props, StoryEditorState> {
    svgRef: any = React.createRef()
    pressedElement: any = null
    lastPosition: any
    action: SEAction = SEAction.None

    constructor(props) {
        super(props)

        this.state = {
            nodes: [],
            edges: [],
            tool: SETool.Dijkstra,
            dragLine: null,
            source: null,
            destination: null
        }
    }

    clear() {
        this.pressedElement = null
        this.lastPosition = null
        this.action = SEAction.None

        this.setState({
            nodes: [],
            edges: [],
            tool: SETool.Dijkstra,
            dragLine: null,
            source: null,
            destination: null
        })
    }

    addNode(x, y, id) {
        let node = {
            id: id,
            x: x,
            y: y,
            radius: 20,
            cluster: null
        }
        this.state.nodes.push(node)
        this.setState({
            nodes: this.state.nodes.slice(0)
        })
        return node
    }

    onMouseDown(event) {

    }

    onMouseMove(event) {
        let x = event.offsetX, y = event.offsetY
        switch (this.action) {
            case SEAction.PreparingMove:
                this.action = SEAction.MoveNode
            case SEAction.MoveNode:
                if (this.pressedElement) {
                    this.pressedElement.x += x - this.lastPosition.x
                    this.pressedElement.y += y - this.lastPosition.y

                    this.lastPosition = { x: x, y: y }

                    this.setState(state => ({
                        nodes: state.nodes.slice(0)
                    }))
                }
                break;
            case SEAction.MakeEdge:
                this.setState({
                    dragLine: {
                        node: this.state.dragLine.node,
                        x2: x,
                        y2: y
                    }
                })
                break;
        }
    }

    onMouseUp(event) {

    }

    onMouseLeave(event) {
        if (this.pressedElement) {
            this.pressedElement = null
        }
    }

    onMouseClick(event) {

        let node = this.state.nodes.find(node => node.id == event.target.parentNode.id)



        if (node) {
            //this.onNodeClick(event, node)
        } else if (this.state.tool == SETool.Draw) {
            switch (this.action) {
                case SEAction.None:
                    let x = event.offsetX, y = event.offsetY

                    if (event.target.classList.contains('StoryEditorSVG')) {
                        this.addNode(x, y, Math.floor(Math.random() * 100))
                    }
                    break;
                case SEAction.MakeEdge:
                    this.action = SEAction.None
                    this.setState({
                        dragLine: null
                    })
                    break;
            }
        }

    }

    toGraph(story: Story) {
        let graph = new Graph()

        story.clusters.forEach(cluster => {
            graph.addNode(cluster.label)
        })
        story.edges.forEach(edge => {
            graph.addDirectedEdge(edge.source.label, edge.destination.label)
        })

        return graph
    }

    onNodeClick(event, node) {
        switch (this.state.tool) {
            case SETool.Delete:
                const nodes = this.state.nodes.slice(0)
                nodes.splice(nodes.findIndex(node), 1)
                this.setState({
                    nodes: nodes
                })
                break;
            case SETool.Select:
                this.props.setCurrentAggregation(node.cluster.vectors)
                this.props.webGLView.current.setZoomTarget(node.cluster.vectors, 1)
                break;
            case SETool.Dijkstra:
                if (!this.state.source) {
                    this.setState({
                        source: node
                    })
                } else {
                    if (!this.state.destination) {
                        this.setState({
                            destination: node
                        })

                        function DFS(graph, source, target) {
                            let visited = {}
                            let pathList = [source]
                            let output = []

                            DFS_iter(source, target, visited, pathList)

                            function DFS_iter(source, target, visited, pathList: any[]) {
                                if (source == target) {
                                    output.push(pathList.slice(0))
                                    return;
                                }

                                visited[source] = true

                                graph.outNeighbors(source).forEach(neighbor => {
                                    if (!visited[neighbor]) {
                                        pathList.push(neighbor)

                                        DFS_iter(neighbor, target, visited, pathList)

                                        pathList.pop()
                                    }
                                })

                                visited[source] = false
                            }

                            return output.sort((a, b) => a.length - b.length)
                        }



                        let g = this.toGraph(this.props.stories.active)
                        const paths = DFS(g, this.state.source.cluster.label, node.cluster.label)


                        if (paths.length > 0) {
                            let mainPath = paths[0].map(id => this.state.nodes.find(e => e.cluster.label == id).cluster)
                            let mainEdges = mainPath.slice(1).map((item, index) => {
                                return this.props.stories.active.edges.find(edge => edge.source == mainPath[index] && edge.destination == item)
                            })
                            this.props.setActiveTrace({
                                mainPath: mainPath,
                                mainEdges: mainEdges,
                                sidePaths: paths.slice(1).map(ids => {
                                    let path = ids.map(id => this.state.nodes.find(e => e.cluster.label == id).cluster)
                                    let edges = path.slice(1).map((item, index) => {
                                        return this.props.stories.active.edges.find(edge => edge.source == path[index] && edge.destination == item)
                                    })
                                    return {
                                        nodes: path,
                                        edges: edges,
                                        syncNodes: getSyncNodes({ nodes: mainPath, edges: mainEdges }, { nodes: path, edges: edges })
                                    }
                                })
                            })

                            this.props.openStoryEditor(false)
                        }

                        this.setState({
                            source: null,
                            destination: null
                        })


                    }
                }
                break;
            case SETool.Draw:
                switch (this.action) {
                    case SEAction.None:
                        this.pressedElement = node
                        this.action = SEAction.MakeEdge
                        this.setState({
                            dragLine: { node: node, x2: node.x, y2: node.y }
                        })
                        break;
                    case SEAction.MakeEdge:
                        // Creating edge and other node is different
                        if (node != this.pressedElement) {
                            let edges = this.state.edges.slice(0)
                            edges.push({
                                source: this.state.dragLine.node,
                                destination: node
                            })
                            this.setState({
                                edges: edges,
                                dragLine: null
                            })
                            this.action = SEAction.None
                            this.pressedElement = null

                            this.props.addEdgeToActive(new Edge(this.state.dragLine.node.cluster, node.cluster, null))
                        } else {
                            this.action = SEAction.None
                            this.pressedElement = null
                            this.setState({
                                dragLine: null
                            })
                        }
                        break;
                }
                break;
        }
    }



    onNodeMouseDown(node) {
        switch (this.state.tool) {
            case SETool.Draw:
                switch (this.action) {
                    case SEAction.None:
                        this.lastPosition = { x: node.x, y: node.y }
                        this.pressedElement = node
                        this.action = SEAction.PreparingMove
                        break;
                }
                break;
        }
    }

    onNodeMouseUp(node) {
        switch (this.action) {
            case SEAction.PreparingMove:
                this.pressedElement = null
                this.action = SEAction.None
                break;
            case SEAction.MoveNode:
                this.action = SEAction.None
                this.pressedElement = null
                break;
        }
    }


    initWithStory(story: Story) {
        const nodes = story.clusters.map(cluster => ({
            meshIndex: cluster.label,
            x: Math.random(),
            y: Math.random(),
            radius: 20,
            id: cluster.label,
            cluster: cluster
        }))

        if (story.clusters.length > 1) {
            const edges = story.edges.map(edge => ({
                source: nodes.find(node => node.meshIndex == edge.source.label),
                destination: nodes.find(node => node.meshIndex == edge.destination.label)
            }))

            let worker = new Worker("dist/forceatlas2.js")

            let self = this
            worker.onmessage = function (e) {
                switch (e.data.type) {
                    case 'progress':
                    case 'finish':
                        if (e.data.type == 'finish') {
                            // finish
                            const positions = e.data.positions

                            const rect = self.svgRef.current.getBoundingClientRect()
                            rescalePoints(positions, rect.width, rect.height)

                            nodes.forEach(node => {
                                node.x = positions[node.meshIndex].x
                                node.y = positions[node.meshIndex].y
                            })

                            self.setState({
                                nodes: nodes,
                                edges: edges
                            })
                        }
                        break
                }

            }
            worker.postMessage({
                nodes: nodes.map(node => ({ meshIndex: node.meshIndex, x: node.x, y: node.y })),
                edges: edges.map(edge => ({ source: edge.source.meshIndex, destination: edge.destination.meshIndex })),
                params: { iterations: 1000 }
            })
        } else {
            nodes[0].x = 100
            nodes[0].y = 100

            this.setState({
                nodes: nodes,
                edges: []
            })
        }
    }

    onDrop(event) {
        let rect = this.svgRef.current.getBoundingClientRect()

        let node = this.addNode(
            event.clientX - rect.x,
            event.clientY - rect.y,
            Math.floor(Math.random() * 100)
        )

        node.cluster = Cluster.fromSamples(this.props.currentAggregation)
    }

    componentDidMount() {
        this.onMouseDown = this.onMouseDown.bind(this)
        this.onMouseUp = this.onMouseUp.bind(this)
        this.onMouseMove = this.onMouseMove.bind(this)
        this.onMouseLeave = this.onMouseLeave.bind(this)
        this.onMouseClick = this.onMouseClick.bind(this)

        let svg = this.svgRef.current as SVGElement

        svg.addEventListener('mousedown', this.onMouseDown)
        svg.addEventListener('mouseup', this.onMouseUp)
        svg.addEventListener('mousemove', this.onMouseMove)
        svg.addEventListener('mouseleave', this.onMouseLeave)
        svg.addEventListener('click', this.onMouseClick)
    }

    componentDidUpdate(prevProps, prevState) {

        if (prevProps.storyEditor.visible != this.props.storyEditor.visible) {
            if (this.props.storyEditor.visible) {
                if (this.props.stories.active) {
                    this.initWithStory(this.props.stories.active)
                }
            } else {
                this.clear()
            }
        }
        if (prevProps.stories.active != this.props.stories.active && this.props.storyEditor.visible) {
            if (this.props.stories.active) {
                this.initWithStory(this.props.stories.active)
            } else {
                this.clear()
            }
        }
    }

    render() {
        return <div hidden={!this.props.stories.active || !this.props.storyEditor.visible} className="StoryEditorParent">
            <Paper
                elevation={3}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%',
                    height: '100%',
                    padding: '8px',
                    boxSizing: 'border-box'
                }}>
                <strong className="StoryEditorStrong">Story Editor</strong>
                <div
                    style={{ width: '100%', flexGrow: 1, position: 'relative' }}
                    onDragOver={(event) => {
                        event.persist()
                        event.preventDefault()
                    }}
                    onDrop={(event) => {
                        event.persist()

                        this.onDrop(event)
                    }}
                >


                    <svg className="StoryEditorSVG" ref={this.svgRef}>
                        <defs>
                            <marker id="arrowhead" markerWidth="5" markerHeight="4"
                                refX="0" refY="2" orient="auto">
                                <polygon points="0 0, 5 2, 0 4" />
                            </marker>
                        </defs>

                        {
                            this.state.edges.map(edge => {
                                const source = edge.source
                                const destination = edge.destination

                                const vecA = new VectBase(source.x, source.y)
                                const vecB = new VectBase(destination.x, destination.y)

                                const dir = VectBase.subtract(vecB, vecA).normalize()
                                dir.multiplyScalar(35)

                                let p2 = VectBase.subtract(vecB, dir)

                                return <line strokeWidth="3" x1={source.x} y1={source.y}
                                    x2={p2.x} y2={p2.y} stroke="black"
                                    markerEnd="url(#arrowhead)" />
                            })
                        }

                        {
                            this.state.dragLine &&
                            <line strokeWidth="2" x1={this.state.dragLine.node.x} y1={this.state.dragLine.node.y}
                                x2={this.state.dragLine.x2} y2={this.state.dragLine.y2} stroke="black"
                                markerEnd="url(#arrowhead)" />
                        }

                        {
                            this.state.nodes.map(node => {
                                return <NodeContainer node={node} onNodeChange={(text) => {
                                    node.id = text
                                    this.setState({
                                        nodes: this.state.nodes.slice(0)
                                    })
                                }}
                                    destination={this.state.destination}
                                    source={this.state.source}
                                    onMouseDown={() => { this.onNodeMouseDown(node) }}
                                    onClick={(event) => { this.onNodeClick(event, node) }}
                                    onMouseUp={() => { this.onNodeMouseUp(node) }}
                                />
                            })
                        }
                    </svg>


                    <div className="StoryEditorTools">
                        <ToggleButtonGroup size="small" orientation="vertical" value={this.state.tool} exclusive onChange={(event, newVal) => { this.setState({ tool: newVal }) }}>
                            <ToggleButton value={SETool.Draw} aria-label="list">
                                <GestureIcon />
                            </ToggleButton>
                            <ToggleButton value={SETool.Delete} aria-label="module">
                                <DeleteIcon />
                            </ToggleButton>
                            <ToggleButton value={SETool.Select} aria-label="quilt">
                                <SelectAllIcon />
                            </ToggleButton>
                            <ToggleButton value={SETool.Dijkstra}>
                                <SelectAllIcon></SelectAllIcon>
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                </div>
            </Paper>
        </div>
    }
})



function NodeContainer({ node, onNodeChange, onMouseDown, onClick, onMouseUp, destination, source }) {
    const [edit, setEdit] = React.useState(false)
    const [initial, setInitial] = React.useState(node.id)

    return <g id={node.id}
        onMouseDown={() => onMouseDown()}
        onClick={(event) => { event.persist(); onClick(event) }}
        onDoubleClick={() => {
            setEdit(true)
        }}
        onMouseUp={(event) => {
            event.persist()
            onMouseUp()
        }}

        className="StoryEditorDraggable" transform={`translate(${node.x} ${node.y})`} >

        <Tooltip enterDelay={1000} title={
            <React.Fragment>
                {
                    node.cluster && <GenericFingerprint type={DatasetType.Rubik} scale={1} vectors={node.cluster.vectors}></GenericFingerprint>
                }

            </React.Fragment>
        }>
            <circle cx={0} cy={0} r={node.radius} stroke="black" strokeWidth="3" fill={node == source || node == destination ? 'yellow' : 'white'} />
        </Tooltip>


        <foreignObject style={{ pointerEvents: edit ? 'auto' : 'none' }} x={- node.radius / 2} y={- node.radius / 2} width={100} height={32}>
            {
                edit ?
                    <input autoFocus type="text" value={initial} onBlur={() => {
                        setEdit(false)
                        onNodeChange(initial)
                    }} onChange={(event) => {
                        setInitial(event.target.value)
                    }} onKeyPress={(event) => {
                        if (event.key == 'Enter') {
                            setEdit(false)
                            onNodeChange(initial)
                        }
                    }} /> :
                    <Typography style={{ pointerEvents: 'none', userSelect: 'none' }}>{node.id}</Typography>
            }
        </foreignObject>
    </g>
}

function arcedLine() {
    return <path d="M 10 80 Q 95 10 180 80" stroke="black" fill="transparent" />
}