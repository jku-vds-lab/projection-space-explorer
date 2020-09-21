import './StoryEditor.scss'
import React = require('react')
import { requirePropFactory, Tooltip, Typography } from '@material-ui/core'
import { ToggleButton, ToggleButtonGroup } from '@material-ui/lab'
import ViewListIcon from '@material-ui/icons/ViewList';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import ViewQuiltIcon from '@material-ui/icons/ViewQuilt';
import { Story } from '../../util/Cluster';
const Graph = require('graphology');
import { connect } from 'react-redux'
import { centerOfMass } from '../../WebGLView/UtilityFunctions';
import { GenericFingerprint } from '../../legends/Generic';
import { DatasetType } from '../../util/datasetselector';

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

type StoryEditorState = {
    nodes: any[]
    edges: any[]
    tool: SETool
    dragLine: any
}

enum SETool {
    Draw,
    Delete,
    Edit
}

enum SEAction {
    None,
    MakeEdge,
    MoveNode,
    PreparingMove
}

const mapStateToProps = state => ({
    activeStory: state.activeStory
})


const mapDispatchToProps = dispatch => ({
})

export const StoryEditor = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(class extends React.Component<any, StoryEditorState> {
    svgRef: any = React.createRef()
    pressedElement: any = null
    lastPosition: any
    action: SEAction = SEAction.None

    constructor(props) {
        super(props)

        this.state = {
            nodes: [],
            edges: [],
            tool: SETool.Draw,
            dragLine: null
        }
    }

    addNode(x, y, id) {
        this.state.nodes.push({
            id: id,
            x: x,
            y: y,
            radius: 30,
            cluster: null
        })
        this.setState({
            nodes: this.state.nodes.slice(0)
        })
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
        } else {
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

    onNodeClick(event, node) {
        console.log("click")
        switch (this.state.tool) {
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
                            console.log("creating edge")
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

    onNodeMouseDown(node) {

        console.log(this.action)

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
        console.log("up")

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
            radius: 30,
            id: cluster.label,
            cluster: cluster
        }))

        const edges = story.edges.map(edge => ({
            source: nodes.find(node => node.meshIndex == edge.source.label),
            destination: nodes.find(node => node.meshIndex == edge.destination.label)
        }))

        let worker = new Worker("dist/force.js")

        console.log(nodes)
        console.log(edges)

        let self = this
        worker.onmessage = function (e) {
            switch (e.data.type) {
                case 'progress':
                case 'finish':
                    if (e.data.type == 'finish') {
                        // finish
                        let positions = e.data.positions
                        console.log(positions)

                        rescalePoints(positions, 400, 400)

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
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.activeStory != this.props.activeStory && this.props.activeStory) {
            this.initWithStory(this.props.activeStory)
        }
    }

    render() {
        return <div className="StoryEditorParent">
            <svg className="StoryEditorSVG" ref={this.svgRef}>
                {
                    this.state.edges.map(edge => {
                        let source = edge.source
                        let destination = edge.destination
                        return <line strokeWidth="3" x1={source.x} y1={source.y} x2={destination.x} y2={destination.y} stroke="black" />
                    })
                }

                {this.state.dragLine &&
                    <line strokeWidth="2" x1={this.state.dragLine.node.x} y1={this.state.dragLine.node.y}
                        x2={this.state.dragLine.x2} y2={this.state.dragLine.y2} stroke="black" />}

                {
                    this.state.nodes.map(node => {
                        return <NodeContainer node={node} onNodeChange={(text) => {
                            node.id = text
                            this.setState({
                                nodes: this.state.nodes.slice(0)
                            })
                        }}
                            onMouseDown={() => { this.onNodeMouseDown(node) }}
                            onClick={(event) => { this.onNodeClick(event, node) }}
                            onMouseUp={() => { this.onNodeMouseUp(node) }}
                        />
                    })
                }
            </svg>

            <ToggleButtonGroup className="StoryEditorTools" orientation="vertical" value={this.state.tool} exclusive onChange={(event, newVal) => { this.setState({ tool: newVal }) }}>
                <ToggleButton value={SETool.Draw} aria-label="list">
                    <ViewListIcon />
                </ToggleButton>
                <ToggleButton value={SETool.Delete} aria-label="module">
                    <ViewModuleIcon />
                </ToggleButton>
                <ToggleButton value={SETool.Edit} aria-label="quilt">
                    <ViewQuiltIcon />
                </ToggleButton>
            </ToggleButtonGroup>

        </div>

    }
})



function NodeContainer({ node, onNodeChange, onMouseDown, onClick, onMouseUp }) {
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
            <circle cx={0} cy={0} r={node.radius} stroke="black" strokeWidth="3" fill="white" />
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