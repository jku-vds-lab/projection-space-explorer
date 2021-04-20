
import { getDefaultZoom, arraysEqual, normalizeWheel, centerOfMass, interpolateLinear, generateZoomForSet } from './UtilityFunctions';
import { LassoSelection } from './tools'
import * as React from "react";
import * as THREE from 'three'
import { LassoLayer } from './LassoLayer/LassoLayer';
import Cluster from '../Utility/Data/Cluster';
import { connect, ConnectedProps } from 'react-redux'
import { Tool, getToolCursor } from '../Overlays/ToolSelection/ToolSelection';
import { Vect } from "../Utility/Data/Vect";
import { setClusterEdgesAction } from "../Ducks/ClusterEdgesDuck";
import { setViewTransform } from "../Ducks/ViewTransformDuck";
import { aggSelectCluster, setAggregationAction, toggleAggregationAction } from "../Ducks/AggregationDuck";
import { CameraTransformations } from './CameraTransformations'
import { Camera } from 'three';
import { LineVisualization, PointVisualization } from './meshes';
import { MultivariateClustering } from './Visualizations/MultivariateClustering';
import { DisplayMode, displayModeSupportsStates } from '../Ducks/DisplayModeDuck';
import { setActiveLine } from '../Ducks/ActiveLineDuck';
import { mappingFromScale } from '../Utility/Colors/colors';
import { setPointColorMapping } from '../Ducks/PointColorMappingDuck';
import { RootState } from '../Store/Store';
import { Menu, MenuItem } from '@material-ui/core';
import * as nt from '../NumTs/NumTs'
import { MouseController } from './MouseController';
import { addClusterToStory, addEdgeToActive, addStory, removeClusterFromStories, removeEdgeFromActive, setActiveStory, setActiveTrace } from '../Ducks/StoriesDuck';
import { setLineUpInput_visibility, setLineUpInput_dump, setLineUpInput_filter } from '../Ducks/LineUpInputDuck';
import { Storybook } from '../Utility/Data/Storybook';
import { RenderingContextEx } from '../Utility/RenderingContextEx';
import { Edge } from '../Utility/graphs';
import { getSyncNodesAlt } from '../NumTs/NumTs';
import { ClusterDragTool } from './Tools/ClusterDragTool';
import { TraceSelectTool } from './Tools/TraceSelectTool';
import { Embedding } from '../Utility/Data/Embedding';
import { setOpenTabAction } from '../Ducks/OpenTabDuck';
import { setHoverState } from '../Ducks/HoverStateDuck';
import './WebGl.scss'
import { pointInHull } from '../Utility/Geometry/Intersection';

type ViewState = {
    displayClusters: any
    camera: Camera
    menuX: number
    menuY: number
    menuTarget: any
}

const mapStateToProps = (state: RootState) => ({
    currentTool: state.currentTool,
    currentAggregation: state.currentAggregation,
    vectorByShape: state.vectorByShape,
    checkedShapes: state.checkedShapes,
    dataset: state.dataset,
    highlightedSequence: state.highlightedSequence,
    activeLine: state.activeLine,
    advancedColoringSelection: state.advancedColoringSelection,
    clusterMode: state.clusterMode,
    displayMode: state.displayMode,
    lineBrightness: state.lineBrightness,
    pathLengthRange: state.pathLengthRange,
    globalPointSize: state.globalPointSize,
    globalPointBrightness: state.globalPointBrightness,
    channelSize: state.channelSize,
    channelColor: state.channelColor,
    channelBrightness: state.channelBrightness,
    pointColorScale: state.pointColorScale,
    stories: state.stories,
    trailSettings: state.trailSettings,
})


const mapDispatchToProps = dispatch => ({
    setCurrentAggregation: id => dispatch(setAggregationAction(id)),
    setClusterEdges: clusterEdges => dispatch(setClusterEdgesAction(clusterEdges)),
    setActiveLine: activeLine => dispatch(setActiveLine(activeLine)),
    setViewTransform: (camera, width, height) => dispatch(setViewTransform(camera, width, height)),
    toggleAggregation: aggregation => dispatch(toggleAggregationAction(aggregation)),
    setHoverState: (hoverState, updater) => dispatch(setHoverState(hoverState, updater)),
    setPointColorMapping: mapping => dispatch(setPointColorMapping(mapping)),
    removeClusterFromStories: cluster => dispatch(removeClusterFromStories(cluster)),
    // setSelectedClusters: clusters => dispatch(setSelectedClusters(clusters)),
    // setLineUpInput_data: input => dispatch(setLineUpInput_data(input)),
    // setLineUpInput_columns: input => dispatch(setLineUpInput_columns(input)),
    setLineUpInput_visibility: input => dispatch(setLineUpInput_visibility(input)),
    setLineUpInput_dump: input => dispatch(setLineUpInput_dump(input)),
    setLineUpInput_filter: input => dispatch(setLineUpInput_filter(input)),
    addStory: story => dispatch(addStory(story)),
    addClusterToStory: cluster => dispatch(addClusterToStory(cluster)),
    setActiveStory: story => dispatch(setActiveStory(story)),
    addEdgeToActive: edge => dispatch(addEdgeToActive(edge)),
    setActiveTrace: trace => dispatch(setActiveTrace(trace)),
    setOpenTab: tab => dispatch(setOpenTabAction(tab)),
    setSelectedCluster: (cluster, shiftKey) => dispatch(aggSelectCluster(cluster, shiftKey)),
    removeEdgeFromActive: (edge) => dispatch(removeEdgeFromActive(edge))
})


const connector = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux



const UPDATER = "scatter";


export const WebGLView = connector(class extends React.Component<Props, ViewState> {
    lasso: LassoSelection
    clusterDrag: ClusterDragTool
    traceSelect: TraceSelectTool
    particles: PointVisualization
    containerRef: any
    selectionRef: any
    mouseDown: any
    physicsRef: any
    mouse: any
    mouseDownPosition: any
    initialMousePosition: any;
    currentHover: any;
    currentAggregation: Vect[];
    camera: any;
    vectors: Vect[];
    renderer: any;
    lines: LineVisualization;
    scene: THREE.Scene;
    dataset: any;
    lineColorScheme: any;
    segments: any;
    pointScene: THREE.Scene;
    vectorColorScheme: any;
    prevTime: number;
    sourcePosition: any;
    targetPosition: { x: number; y: number; };
    sourceZoom: any;
    targetZoom: number;
    transitionTime: number;
    trees: any[];
    edgeClusters: any;
    lastTime: number;
    mouseMoveListener: any;
    mouseDownListener: any;
    mouseLeaveListener: any;
    keyDownListener: any;
    wheelListener: any;
    mouseUpListener: any;
    infoTimeout: any
    multivariateClusterView: any = React.createRef()
    invalidated: boolean

    mouseController: MouseController = new MouseController()

    constructor(props) {
        super(props)

        this.containerRef = React.createRef()
        this.selectionRef = React.createRef()
        this.physicsRef = React.createRef()

        this.initMouseController()

        this.mouse = { x: 0, y: 0 }

        this.currentHover = null

        this.state = {
            // clusters to display using force-directed layout
            displayClusters: [],
            camera: null,
            menuX: null,
            menuY: null,
            menuTarget: null
        }

    }


    lineupFilterUpdate() {
        this.particles.update()
        this.requestRender()
    }

    async hoverUpdate(hover_item, updater) {
        let idx = -1;
        if (hover_item && hover_item["__meta__"]) {
            idx = hover_item["__meta__"]["view"]["meshIndex"];
        }
        this.particles.highlight(idx);
        if (this.props.dataset.isSequential) {
            if (idx >= 0) {
                this.lines.highlight([this.props.dataset.vectors[idx].view.segment.lineKey], this.getWidth(), this.getHeight(), this.scene)
            } else {
                this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene)
            }
        }
        if (idx >= 0) {
            if (this.currentHover != this.props.dataset.vectors[idx]) {
                this.currentHover = this.props.dataset.vectors[idx]
                this.props.setHoverState(this.props.dataset.vectors[idx], updater)
                this.requestRender()
            }
        } else {
            if (this.currentHover) {
                this.currentHover = null
                this.props.setHoverState(null, updater)
                this.requestRender()
            }
        }
    }


    /**
     * Initializes the callbacks for the MouseController.
     */
    initMouseController() {
        this.mouseController.onMouseLeave = (event: MouseEvent) => {
            if (this.infoTimeout != null) {
                clearTimeout(this.infoTimeout)
            }

            this.particles?.highlight(null)

            if (this.props.dataset?.isSequential) {
                this.lines?.highlight([], this.getWidth(), this.getHeight(), this.scene)
            }

            if (this.currentHover) {
                this.currentHover = null
                this.props.setHoverState(null, UPDATER)
                this.requestRender()
            }
        }


        this.mouseController.onDragStart = (event: MouseEvent, button: number, initial: nt.VectorType) => {
            switch (button) {
                case 0:
                    switch (this.props.currentTool) {
                        case Tool.Default:
                            // Check if we have dragged from a cluster
                            let cluster = this.chooseCluster(initial)
                            if (cluster) {
                                // Initiate action to let user drag an arrow to other cluster
                                this.clusterDrag = new ClusterDragTool(cluster)
                            } else {
                                // Initiate lasso selection
                                let initialWorld = CameraTransformations.screenToWorld(initial, this.createTransform())

                                this.lasso = new LassoSelection()
                                this.lasso.mouseDown(true, initialWorld.x, initialWorld.y)
                            }
                            break;
                    }
                    break;
            }
        }


        this.mouseController.onDragEnd = (event: MouseEvent, button: number) => {
            switch (button) {
                case 0:
                    switch (this.props.currentTool) {
                        case Tool.Default:
                            let coords = CameraTransformations.screenToWorld({ x: event.offsetX, y: event.offsetY }, this.createTransform())

                            // In case we dragged a cluster... connect them
                            if (this.clusterDrag) {
                                let cluster = this.chooseCluster({ x: event.offsetX, y: event.offsetY })
                                if (cluster) {
                                    this.props.addEdgeToActive(new Edge(this.clusterDrag.cluster, cluster, null))
                                }

                                this.clusterDrag = null
                            }

                            // In case we have a lasso, select states
                            if (this.lasso) {
                                // If there is an active lasso, process it
                                var wasDrawing = this.lasso.drawing

                                this.lasso.mouseUp(coords.x, coords.y)

                                var indices = this.lasso.selection(this.props.dataset.vectors, (vector) => this.particles.isPointVisible(vector))
                                if (indices.length > 0 && wasDrawing && displayModeSupportsStates(this.props.displayMode)) {
                                    var selected = indices.map(index => this.props.dataset.vectors[index])

                                    if (event.ctrlKey) {
                                        this.props.toggleAggregation(selected)
                                    } else {
                                        this.props.setCurrentAggregation(selected)
                                    }

                                    this.props.setOpenTab(4)

                                } else if (wasDrawing) {
                                    this.clearSelection()
                                }

                                this.lasso = null
                            }
                            break;
                    }
                    break;
            }
        }

        this.mouseController.onDragMove = (event: MouseEvent, button: number) => {

            switch (button) {
                case 0:
                    switch (this.props.currentTool) {
                        case Tool.Default:
                            let coords = CameraTransformations.screenToWorld({ x: event.offsetX, y: event.offsetY }, this.createTransform())
                            this.lasso?.mouseMove(coords.x, coords.y)
                            break;
                        case Tool.Move:
                            this.camera.position.x = this.camera.position.x - CameraTransformations.pixelToWorldCoordinates(event.movementX, this.createTransform())
                            this.camera.position.y = this.camera.position.y + CameraTransformations.pixelToWorldCoordinates(event.movementY, this.createTransform())

                            this.camera.updateProjectionMatrix()
                            this.props.setViewTransform(this.camera, this.getWidth(), this.getHeight())

                            this.requestRender()
                            break;
                    }
                    break;
                case 2:
                    this.camera.position.x = this.camera.position.x - CameraTransformations.pixelToWorldCoordinates(event.movementX, this.createTransform())
                    this.camera.position.y = this.camera.position.y + CameraTransformations.pixelToWorldCoordinates(event.movementY, this.createTransform())

                    this.camera.updateProjectionMatrix()
                    this.props.setViewTransform(this.camera, this.getWidth(), this.getHeight())

                    this.requestRender()
                    break;
            }
        }

        this.mouseController.onContext = (event: MouseEvent, button: number) => {

            if (this.props.currentTool == Tool.Default) {
                switch (button) {
                    case 0:
                        if (this.props.activeLine) {
                            break;
                        }




                        if (this.traceSelect) {
                            let target = this.chooseCluster({ x: event.offsetX, y: event.offsetY })

                            if (target) {
                                // We want to select a trace between 2 clusters
                                let paths = Storybook.depthFirstSearch(this.props.stories.active.toGraph(), this.traceSelect.cluster.label, target.label)

                                if (paths.length > 0) {
                                    let mainPath = paths[0].map(id => this.props.stories.active.clusters.find(e => e.label == id))
                                    let mainEdges = mainPath.slice(1).map((item, index) => {
                                        return this.props.stories.active.edges.find(edge => edge.source == mainPath[index] && edge.destination == item)
                                    })
                                    this.props.setActiveTrace({
                                        mainPath: mainPath,
                                        mainEdges: mainEdges,
                                        sidePaths: paths.slice(1).map(ids => {
                                            let path = ids.map(id => this.props.stories.active.clusters.find(e => e.label == id))
                                            let edges = path.slice(1).map((item, index) => {
                                                return this.props.stories.active.edges.find(edge => edge.source == path[index] && edge.destination == item)
                                            })
                                            return {
                                                nodes: path,
                                                edges: edges,
                                                syncNodes: getSyncNodesAlt(mainPath, path)
                                            }
                                        })
                                    })
                                }
                            }

                            this.traceSelect = null
                        } else if (this.currentHover && this.currentHover instanceof Vect) {
                            // We click on a hover target
                            if (event.ctrlKey) {
                                // There is a hover target ... select it
                                this.props.toggleAggregation([this.currentHover])
                            } else {
                                this.props.setCurrentAggregation([this.currentHover])
                            }
                        } else if (this.currentHover && this.currentHover instanceof Cluster) {
                            this.props.setSelectedCluster(this.currentHover, event.ctrlKey)
                        }


                        break;
                    case 2:
                        let cluster = this.chooseCluster({ x: event.offsetX, y: event.offsetY })

                        if (cluster) {
                            this.setState({
                                menuX: event.clientX,
                                menuY: event.clientY,
                                menuTarget: cluster
                            })
                        } else {
                            let edge = this.chooseEdge(this.mouseController.currentMousePosition)
                            if (edge) {
                                this.setState({
                                    menuX: event.clientX,
                                    menuY: event.clientY,
                                    menuTarget: edge
                                })
                            } else {
                                this.setState({
                                    menuX: event.clientX,
                                    menuY: event.clientY,
                                    menuTarget: null
                                })
                            }
                        }

                        break;
                }
            }
        }

        this.mouseController.onMouseUp = (event: MouseEvent) => {

        }


        this.mouseController.onMouseMove = (event: MouseEvent) => {
            switch (this.props.currentTool) {
                case Tool.Default:
                    if (this.props.displayMode == DisplayMode.OnlyClusters) {
                        break;
                    }

                    // In case we have a line in the sequence UI
                    if (this.props.activeLine) {
                        break;
                    }

                    if (this.infoTimeout != null) {
                        clearTimeout(this.infoTimeout)
                    }

                    this.infoTimeout = setTimeout(() => {
                        this.infoTimeout = null

                        let cluster = this.chooseCluster(this.mouseController.currentMousePosition)
                        if (cluster) {
                            if (this.currentHover != cluster) {
                                this.currentHover = cluster
                                this.props.setHoverState(cluster, UPDATER)

                                if (this.props.dataset.isSequential) {
                                    this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene)
                                }
                                this.particles.highlight(-1)

                                this.requestRender()
                            }
                        } else {
                            let coords = CameraTransformations.screenToWorld(this.mouseController.currentMousePosition, this.createTransform())

                            let edge = this.chooseEdge(this.mouseController.currentMousePosition)
                            if (edge) {
                                console.log("edge")
                                if (this.currentHover !== edge) {
                                    this.currentHover = edge
                                    this.props.setHoverState(edge, UPDATER)
                                }
                            } else {
                                // Get index of selected node
                                var idx = this.choose(coords)
                                this.particles.highlight(idx)

                                if (this.props.dataset.isSequential) {
                                    if (idx >= 0) {
                                        this.lines.highlight([this.props.dataset.vectors[idx].view.segment.lineKey], this.getWidth(), this.getHeight(), this.scene)
                                    } else {
                                        this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene)
                                    }
                                }



                                if (idx >= 0) {
                                    if (this.currentHover != this.props.dataset.vectors[idx]) {
                                        this.currentHover = this.props.dataset.vectors[idx]

                                        this.props.setHoverState(this.props.dataset.vectors[idx], UPDATER)
                                        this.requestRender()
                                    }
                                } else {
                                    if (this.currentHover) {
                                        this.currentHover = null
                                        this.props.setHoverState(null, UPDATER)
                                        this.requestRender()
                                    }
                                }
                            }
                        }
                    }, 10);

                    break;
            }

        }
    }




    /**
     * Creates the line visualization for given attribute key, e. g. line or algo
     * 
     * @param attribute The attribute key
     */
    recreateLines(attribute: string) {
        const dataset = this.props.dataset
        const segments = dataset.getSegs(attribute)

        dataset.segments = segments


        this.lines?.dispose(this.scene)
        this.lines = null

        this.lines = new LineVisualization(segments, this.lineColorScheme)
        this.lines.createMesh(this.props.lineBrightness)
        this.lines.setZoom(this.camera.zoom)

        // First add lines, then particles
        this.lines.meshes.forEach(line => this.scene.add(line.line))

        this.pointScene.remove(this.particles?.mesh)
        this.particles = new PointVisualization(this.vectorColorScheme, this.props.dataset, window.devicePixelRatio * 8, this.lines?.grayedLayerSystem)
        this.particles.createMesh(this.props.dataset.vectors, segments)
        this.particles.zoom(this.camera.zoom)
        this.particles.updateColor()
        this.particles.update()


        //this.scene.add(this.particles.mesh);
        this.pointScene.add(this.particles.mesh)

        this.requestRender()
    }









    chooseCluster(screenPosition: { x: number, y: number }) {
        let nearest = null
        let min = Number.MAX_SAFE_INTEGER

        this.props.stories.active?.clusters.forEach(cluster => {
            let clusterScreen = CameraTransformations.worldToScreen(new THREE.Vector2(cluster.getCenter().x, cluster.getCenter().y), this.createTransform())
            let dist = nt.euclideanDistance(screenPosition.x, screenPosition.y, clusterScreen.x, clusterScreen.y)

            if (dist < min && dist < 16) {
                nearest = cluster
                min = dist
            }
        })

        return nearest
    }



    chooseEdge(position) {
        if (!this.props.stories.active) {
            return null
        }

        position = CameraTransformations.screenToWorld(position, this.createTransform())

        for (let i = 0; i < this.props.stories.active.edges.length; i++) {
            const edge = this.props.stories.active.edges[i]

            const a = edge.source.getCenterAsVector2()
            const b = edge.destination.getCenterAsVector2()
            const dir = b.clone().sub(a.clone()).normalize()
            const l = new THREE.Vector2(-dir.y, dir.x).multiplyScalar(0.5)
            const r = new THREE.Vector2(dir.y, -dir.x).multiplyScalar(0.5)

            let hull = [a.clone().add(l), b.clone().add(l), b.clone().add(r), a.clone().add(r)]

            if (pointInHull(position, hull)) {
                return edge
            }
        }

        return null
    }



    /**
     * Gives the index of the nearest sample.
     * 
     * @param position - The position to pick a sample from
     * @returns The index of a sample
     */
    choose(position) {
        var best = 30 / (this.camera.zoom * 2.0)
        var res = -1

        for (var index = 0; index < this.props.dataset.vectors.length; index++) {
            var value = this.props.dataset.vectors[index]

            // Skip points matching some criteria
            if (!this.particles.isPointVisible(value)) {
                continue
            }

            var d = nt.euclideanDistance(position.x, position.y, value.x, value.y)

            if (d < best) {
                best = d
                res = index
            }
        }
        return res
    }



    /**
     * Converts mouse coordinates to world coordinates.
     * @param {*} event a dom mouse event.
     */
    relativeMousePosition(event) {
        const rect = this.containerRef.current.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left),
            y: (event.clientY - rect.top)
        }
    }

    componentDidMount() {
        this.setupRenderer()
        this.startRendering()
    }

    normaliseMouse(event) {
        var vec = {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: - (event.clientY / window.innerHeight) * 2 + 1
        }
        return vec
    }

    resize(width, height) {
        this.camera.left = width / -2


        this.camera.right = width / 2
        this.camera.top = height / 2
        this.camera.bottom = height / -2

        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)

        this.props.setViewTransform(this.camera, width, height)


        this.requestRender()
    }




    onKeyDown(event) {
    }

    onMouseLeave(event) {
        event.preventDefault()
        this.mouseController.mouseLeave(event)
    }

    onMouseDown(event) {
        event.preventDefault()
        this.mouseController.mouseDown(event)
    }

    onMouseMove(event) {
        event.preventDefault();
        this.mouseController.mouseMove(event)
    }

    onMouseUp(event: MouseEvent) {
        event.preventDefault()
        this.mouseController.mouseUp(event)
    }


    clearSelection() {
        this.lasso = null

        if (this.props.dataset.isSequential) {
            this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene)

            this.lines.groupHighlight([])
        } else {
            this.particles.groupHighlight([])
        }

        this.props.dataset.vectors.forEach((vector, index) => {
            vector.view.selected = false
        })

        this.props.setCurrentAggregation([])

        this.particles?.updateColor()
    }


    onWheel(event) {
        event.preventDefault()

        var normalized = normalizeWheel(event)

        // Store world position under mouse
        var bounds = this.containerRef.current.getBoundingClientRect()
        let worldBefore = CameraTransformations.screenToWorld({ x: event.clientX - bounds.left, y: event.clientY - bounds.top }, this.createTransform())
        var screenBefore = this.relativeMousePosition(event)

        var newZoom = this.camera.zoom - (normalized.pixelY * 0.013) / this.props.dataset.bounds.scaleFactor
        if (newZoom < 1.0 / this.props.dataset.bounds.scaleFactor) {
            this.camera.zoom = 1.0 / this.props.dataset.bounds.scaleFactor
        } else {
            this.camera.zoom = newZoom
        }

        // Restore camera position
        this.restoreCamera(worldBefore, screenBefore)

        // Adjust mesh zoom levels
        this.particles.zoom(this.camera.zoom);

        if (this.props.dataset.isSequential) {
            this.lines.setZoom(this.camera.zoom)
        }

        // Update projection matrix
        this.camera.updateProjectionMatrix();

        this.props.setViewTransform(this.camera, this.getWidth(), this.getHeight())

        this.requestRender()

    }

    restoreCamera(world, screen) {
        this.camera.position.x = world.x - ((screen.x - this.getWidth() / 2) / this.camera.zoom)
        this.camera.position.y = (world.y + ((screen.y - this.getHeight() / 2) / this.camera.zoom))
    }


    getWidth() {
        return this.containerRef.current?.offsetWidth
    }

    getHeight() {
        return this.containerRef.current?.offsetHeight
    }



    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.autoClear = true
        this.renderer.autoClearColor = false

        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.getWidth(), this.getHeight());
        this.renderer.setClearColor(0xf9f9f9, 1);
        this.renderer.sortObjects = false;

        this.camera = new THREE.OrthographicCamera(this.getWidth() / - 2, this.getWidth() / 2, this.getHeight() / 2, this.getHeight() / - 2, 1, 1000);
        this.camera.position.z = 1;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.updateProjectionMatrix();


        this.containerRef.current.appendChild(this.renderer.domElement);


        this.scene = new THREE.Scene()

        this.props.setViewTransform(this.camera, this.getWidth(), this.getHeight())

        this.prevTime = performance.now()

    }

    createVisualization(dataset, lineColorScheme, vectorColorScheme) {
        this.scene = new THREE.Scene()
        this.pointScene = new THREE.Scene()
        this.segments = dataset.segments
        this.lineColorScheme = lineColorScheme
        this.vectorColorScheme = vectorColorScheme


        // Update camera zoom to fit the problem
        this.camera.zoom = getDefaultZoom(this.props.dataset.vectors, this.getWidth(), this.getHeight())
        this.camera.position.x = 0.0
        this.camera.position.y = 0.0
        this.camera.updateProjectionMatrix()

        this.setState({
            camera: this.camera
        })


        if (this.props.dataset.isSequential) {
            this.lines = new LineVisualization(this.segments, this.lineColorScheme)
            this.lines.createMesh(this.props.lineBrightness)
            this.lines.setZoom(this.camera.zoom)

            // First add lines, then particles
            this.lines.meshes.forEach(line => this.scene.add(line.line))
        }

        this.particles = new PointVisualization(this.vectorColorScheme, this.props.dataset, window.devicePixelRatio * 8, this.lines?.grayedLayerSystem)
        this.particles.createMesh(this.props.dataset.vectors, this.segments)
        this.particles.zoom(this.camera.zoom)
        this.particles.update()


        //this.scene.add(this.particles.mesh);
        this.pointScene.add(this.particles.mesh)


        var container = this.containerRef.current
        // Remove old listeners
        container.removeEventListener('mousemove', this.mouseMoveListener)
        container.removeEventListener('mousedown', this.mouseDownListener)
        container.removeEventListener('mouseup', this.mouseUpListener)
        container.removeEventListener('keydown', this.keyDownListener)
        container.removeEventListener('wheel', this.wheelListener)

        // Store new listeners
        this.wheelListener = event => this.onWheel(event)
        this.mouseDownListener = event => this.onMouseDown(event)
        this.mouseMoveListener = event => this.onMouseMove(event)
        this.mouseUpListener = event => this.onMouseUp(event)
        this.keyDownListener = event => this.onKeyDown(event)

        // Add new listeners
        container.addEventListener('mousemove', this.mouseMoveListener, false);
        container.addEventListener('mousedown', this.mouseDownListener, false);
        container.addEventListener('mouseup', this.mouseUpListener, false);
        container.addEventListener('keydown', this.keyDownListener)
        container.addEventListener('wheel', this.wheelListener, false)

        // @ts-ignore
        new ResizeObserver(() => {
            this.resize(container.offsetWidth, container.offsetHeight)
        }).observe(container)
    }


    filterLines(algo, show) {

        this.segments.forEach((segment) => {
            if (segment.vectors[0].algo == algo) {
                segment.view.globalVisible = show


                segment.vectors.forEach((vector) => {
                    vector.view.visible = show
                })
            }
        })

        this.lines.update()
        this.particles.update()
    }



    /**
     * 
     * @param checked 
     */
    setLineFilter(checked) {
        this.segments.forEach((segment) => {
            var show = checked[segment.vectors[0].line]
            segment.view.detailVisible = show
        })
        this.lines.update()
        this.particles.update()
    }


    /**
     * Updates the x,y coordinates of the visualization only. This will also
     * recalculate the optimal camera zoom level.
     */
    updateXY() {
        this.particles.updatePosition()
        if (this.props.dataset.isSequential) {
            this.lines.updatePosition()
        }
        this.props.dataset.calculateBounds()
        this.camera.zoom = getDefaultZoom(this.props.dataset.vectors, this.getWidth(), this.getHeight())
        this.camera.position.x = 0.0
        this.camera.position.y = 0.0
        this.camera.updateProjectionMatrix();



        this.requestRender()
    }


    /**
     * This functions sets the zoom target for a given set of points.
     * This function only needs to be called once to set the target, the view
     * will then slowly adjust the zoom value and position of the camera depending on
     * the speed value supplied.
     */
    setZoomTarget(vectors, speed) {
        // Store current camera zoom and position for linear interpolation
        this.sourcePosition = this.camera.position.clone()
        this.sourceZoom = this.camera.zoom

        // Set target position to the center of mass of the vectors
        this.targetPosition = centerOfMass(vectors)

        // Set target zoom the bounds in which all points appear
        this.targetZoom = generateZoomForSet(vectors, this.getWidth(), this.getHeight())

        // Reset transition time
        this.transitionTime = 0
    }


    filterPoints(checkboxes) {
        this.particles.showSymbols = checkboxes
        this.particles.update()
    }

    disposeScene() {
        this.currentHover = null

        this.setState({
            displayClusters: []
        })

        if (this.lines != null) {
            this.lines.dispose(this.scene)
            this.lines = null
        }

        if (this.particles != null) {
            this.scene.remove(this.particles.mesh)
            this.particles.dispose()
            this.particles = null
        }

        if (this.renderer != null) {
            this.renderer.renderLists.dispose()
        }
    }


    /**
     * Starts the render loop
     */
    startRendering() {
        requestAnimationFrame(() => this.startRendering());

        try {
            this.renderLoop()
        } catch { }
    }



    updateZoom(deltaTime) {
        if (this.targetPosition != null && this.targetZoom != null) {
            // Update transition time, maxing at 1
            this.transitionTime = Math.min(this.transitionTime + deltaTime, 1)

            // Update zoom level and position
            this.camera.position.x = interpolateLinear(this.sourcePosition.x, this.targetPosition.x, this.transitionTime)
            this.camera.position.y = interpolateLinear(this.sourcePosition.y, this.targetPosition.y, this.transitionTime)
            //this.camera.zoom = interpolateLinear(this.sourceZoom, this.targetZoom, this.transitionTime)
            this.camera.updateProjectionMatrix()

            this.requestRender()

            // End transition
            if (this.transitionTime == 1) {
                this.sourcePosition = null
                this.sourceZoom = null
                this.targetPosition = null
                this.targetZoom = null
                this.transitionTime = 0
            }
        }
    }



    /**
     * Render function that gets called with the display refresh rate.
     * Only render overlays here like the lasso selection etc.
     * The rendering of the states + lines and stuff that does not need to be
     * re-rendered for animations should be put in 'requestRender'
     */
    renderLoop() {
        var ctx = this.selectionRef.current.getContext() as CanvasRenderingContext2D
        let extended = new RenderingContextEx(ctx, window.devicePixelRatio)
        ctx.clearRect(0, 0, this.getWidth(), this.getHeight());

        this.selectionRef.current.setDimensions(this.getWidth() * window.devicePixelRatio,
            this.getHeight() * window.devicePixelRatio)

        this.renderLasso(ctx)

        if (this.clusterDrag) {
            this.clusterDrag.renderToContext(extended, CameraTransformations.worldToScreen(this.clusterDrag.cluster.getCenter(), this.createTransform()), this.mouseController.currentMousePosition)
        }

        if (this.traceSelect) {
            this.traceSelect.viewTransform = this.createTransform()
            this.traceSelect.mousePosition = this.mouseController.currentMousePosition
            this.traceSelect.renderToContext(extended)
        }

        if (this.props.highlightedSequence != null) {
            this.selectionRef.current.renderHighlightedSequence(ctx, this.props.highlightedSequence)
        }
    }

    onClusterClicked(cluster: Cluster, shiftKey: boolean = false) {
        this.props.setSelectedCluster(cluster, shiftKey)
    }


    renderFrame() {
        this.invalidated = false

        // Calculate delta time
        var nextTime = performance.now()
        var deltaTime = (nextTime - this.lastTime) / 1000
        this.lastTime = nextTime

        // Update zoom in case a target has been set
        this.updateZoom(deltaTime)

        try {
            let camera = new THREE.OrthographicCamera(this.getWidth() / - 2, this.getWidth() / 2, this.getHeight() / 2, this.getHeight() / - 2, 1, 1000);
            camera.lookAt(0, 0, 0)
            camera.position.z = 1;
            camera.position.x = this.camera.position.x * this.camera.zoom
            camera.position.y = this.camera.position.y * this.camera.zoom
            camera.updateProjectionMatrix();

            this.renderer.clear()
            this.renderer.render(this.scene, this.camera)

            if (this.multivariateClusterView.current) {
                this.multivariateClusterView.current.updatePositions(this.camera.zoom)
                this.multivariateClusterView.current.updateArrows(this.camera.zoom, this.props.stories.active)
                this.multivariateClusterView.current.updateTrail(this.camera.zoom)

                if (this.multivariateClusterView.current.scene) {
                    this.renderer.render(this.multivariateClusterView.current.scene, camera)
                }
                if (this.multivariateClusterView.current.scalingScene) {
                    this.renderer.render(this.multivariateClusterView.current.scalingScene, this.camera)
                }
            }

            if (this.pointScene) {
                this.renderer.render(this.pointScene, this.camera)
            }

            if (this.multivariateClusterView.current) {
                if (this.multivariateClusterView.current.clusterScene) {
                    this.renderer.render(this.multivariateClusterView.current.clusterScene, camera)
                }
            }
        } catch (e) {
        }
    }

    private updateItemClusterDisplay() {
        switch (this.props.displayMode) {
            case DisplayMode.StatesAndClusters:
            case DisplayMode.OnlyStates:
                if (this.props.dataset.isSequential) {
                    this.lines.meshes.forEach(line => {
                        this.scene.remove(line.line)
                        this.scene.add(line.line)
                    })
                }

                this.pointScene.remove(this.particles.mesh)
                this.pointScene.add(this.particles.mesh)
                break;
            case DisplayMode.OnlyClusters:
            case DisplayMode.None:
                if (this.props.dataset.isSequential) {
                    this.lines.meshes.forEach(line => {
                        this.scene.remove(line.line)
                    })
                }

                this.pointScene.remove(this.particles.mesh)
                break;
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.pointColorScale != this.props.pointColorScale || prevProps.stories != this.props.stories) {
            if (this.props.channelColor && this.props.pointColorScale) {
                let mapping = mappingFromScale(this.props.pointColorScale, this.props.channelColor, this.props.dataset)
                this.props.setPointColorMapping(mapping)
                this.particles.colorCat(this.props.channelColor, mapping)
            } else {
                this.props.setPointColorMapping(null)
                this.particles?.colorCat(null, null)
            }
        }

        if (prevProps.stories != this.props.stories) {
            if (this.props.stories.active) {
                this.particles?.storyTelling(this.props.stories)

                this.lines?.storyTelling(this.props.stories)
                this.lines?.update()

                this.particles?.update()
                this.particles?.updateColor()
            } else {
                this.particles?.storyTelling(null)

                this.lines?.storyTelling(this.props.stories)
                this.lines?.update()

                this.particles?.update()
                this.particles?.updateColor()
            }
        }

        if (prevProps.globalPointSize != this.props.globalPointSize && this.particles) {
            this.particles.sizeCat(this.props.channelSize, this.props.globalPointSize)
            this.particles.updateSize()
        }

        if (prevProps.globalPointBrightness != this.props.globalPointBrightness && this.particles) {
            this.particles.transparencyCat(this.props.channelBrightness, this.props.globalPointBrightness)
            this.particles.updateColor()
            this.particles.update()
        }


        if (prevProps.lineBrightness != this.props.lineBrightness) {
            this.lines?.setBrightness(this.props.lineBrightness)
        }

        if (prevProps.displayMode != this.props.displayMode) {
            this.updateItemClusterDisplay();
        }


        if (!arraysEqual(prevProps.currentAggregation.aggregation, this.props.currentAggregation.aggregation)) {
            if (this.props.dataset.isSequential) {
                var uniqueIndices = [...new Set(this.props.currentAggregation.aggregation.map(vector => vector.view.segment.lineKey))]

                this.lines.groupHighlight(uniqueIndices)
            } else {
                this.particles.groupHighlight(this.props.currentAggregation.aggregation)
            }

            this.props.dataset.vectors.forEach(sample => sample.view.selected = false)
            this.props.currentAggregation.aggregation.forEach(sample => {
                sample.view.selected = true
            })

            this.particles.update()
            this.particles.updateColor()
        }





        // Path length range has changed, update view accordingly
        if (this.props.dataset && this.props.dataset.isSequential && prevProps.pathLengthRange !== this.props.pathLengthRange) {
            // Set path length range on all segment views, and update them
            this.segments.forEach(segment => {
                segment.view.pathLengthRange = this.props.pathLengthRange.range
            })

            this.lines.update()
            this.particles.update()
            this.particles.updateColor()
        }

        if (prevProps.vectorByShape != this.props.vectorByShape && this.particles) {
            this.filterPoints({ 'star': true, 'cross': true, 'circle': true, 'square': true })
            this.particles.shapeCat(this.props.vectorByShape)
        }

        if (prevProps.checkedShapes != this.props.checkedShapes && this.particles) {
            this.filterPoints(this.props.checkedShapes)
        }

        if (prevProps.activeLine != this.props.activeLine) {
            if (this.props.activeLine != null) {
                this.lines.highlight([this.props.activeLine.lineKey], this.getWidth(), this.getHeight(), this.scene, true)
            } else {
                this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene, true)
                this.particles.update()
                this.particles.updateColor()
            }
        }

        if (prevProps.advancedColoringSelection != this.props.advancedColoringSelection && this.particles) {
            this.particles.colorFilter(this.props.advancedColoringSelection)
        }

        this.requestRender()
    }

    requestRender() {
        if (this.invalidated) {
            return;
        }
        this.invalidated = true
        requestAnimationFrame(() => this.renderFrame())
    }

    createTransform() {
        return {
            camera: this.camera,
            width: this.getWidth(),
            height: this.getHeight()
        }
    }

    renderLasso(ctx) {
        if (this.lasso == null) return;

        var points = this.lasso.points

        if (points.length <= 1) {
            return;
        }

        ctx.setLineDash([5, 3]);
        ctx.strokeStyle = 'black';
        ctx.fillStyle = 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 2 * window.devicePixelRatio;
        ctx.beginPath();
        for (var index = 0; index < points.length; index++) {
            var point = points[index];
            point = CameraTransformations.worldToScreen(point, this.createTransform())

            if (index == 0) {
                ctx.moveTo(point.x * window.devicePixelRatio, point.y * window.devicePixelRatio);
            } else {
                ctx.lineTo(point.x * window.devicePixelRatio, point.y * window.devicePixelRatio);
            }
        }

        if (!this.lasso.drawing) {
            var conv = CameraTransformations.worldToScreen(points[0], this.createTransform())
            ctx.lineTo(conv.x * window.devicePixelRatio, conv.y * window.devicePixelRatio);
        }

        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }


    repositionClusters() {
        this.multivariateClusterView?.current.updatePositions(this.camera.zoom)
        this.multivariateClusterView?.current.iterateTrail(this.camera.zoom)
        this.multivariateClusterView?.current.createTriangulatedMesh()
    }

    loadProjection(projection: Embedding) {
        this.props.dataset.vectors.forEach(vector => {
            let position = projection.positions[vector.view.meshIndex]
            vector.x = position.x
            vector.y = position.y
        })

        this.updateXY()
    }

    onClusterZoom(cluster) {
        this.props.setSelectedCluster(cluster, false)
        //this.props.setCurrentAggregation(cluster.vectors)
        //this.props.setSelectedClusters([cluster])
    }


    render() {
        const handleClose = () => {
            this.setState({
                menuX: null,
                menuY: null
            });
        };

        return <div
            onContextMenu={
                (event) => { event.preventDefault() }
            }
            onMouseLeave={
                (event) => { this.onMouseLeave(event) }
            }
            style={{
                width: '100%',
                height: '100%',
                overflow: "hidden",
                position: "relative",
                cursor: getToolCursor(this.props.currentTool)
            }}>

            <div id="container" style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "100%",
                height: "100%"
            }} ref={this.containerRef} tabIndex={0}>




            </div>

            <LassoLayer ref={this.selectionRef}></LassoLayer>

            <MultivariateClustering ref={this.multivariateClusterView}></MultivariateClustering>




            <Menu
                keepMounted
                open={this.state.menuY !== null && !this.state.menuTarget}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    this.state.menuY !== null && this.state.menuX !== null
                        ? { top: this.state.menuY, left: this.state.menuX }
                        : undefined
                }
            >
                <MenuItem onClick={() => {
                    if (this.props.currentAggregation.aggregation.length > 0) {
                        let cluster = Cluster.fromSamples(this.props.currentAggregation.aggregation)

                        if (!this.props.stories.active) {
                            let story = new Storybook([cluster], [])
                            this.props.addStory(story)
                            this.props.setActiveStory(story)
                        } else {
                            this.props.addClusterToStory(cluster)
                        }
                    }

                    handleClose()
                }}>{"Create Group from Selection"}</MenuItem>

                <MenuItem onClick={() => {
                    var coords = CameraTransformations.screenToWorld({ x: this.mouseController.currentMousePosition.x, y: this.mouseController.currentMousePosition.y }, this.createTransform())

                    if (this.props.displayMode == DisplayMode.OnlyClusters) {
                        return;
                    }

                    var idx = this.choose(coords)
                    if (idx >= 0) {
                        var vector = this.props.dataset.vectors[idx]
                        this.props.setActiveLine(vector.view.segment)
                    }
                }}>Investigate Line</MenuItem>
            </Menu>



            <Menu
                keepMounted
                open={this.state.menuY !== null && this.state.menuTarget instanceof Cluster}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    this.state.menuY !== null && this.state.menuX !== null
                        ? { top: this.state.menuY, left: this.state.menuX }
                        : undefined
                }
            >
                <MenuItem onClick={() => {
                    this.props.removeClusterFromStories(this.state.menuTarget)


                    handleClose()
                }}>{'Delete Cluster'}</MenuItem>

                <MenuItem onClick={() => {
                    let paths = this.props.stories.active.getAllStoriesFromSource(this.state.menuTarget.label)



                    if (paths.length > 0) {
                        let mainPath = paths[0].map(id => this.props.stories.active.clusters.find(e => e.label == id))
                        let mainEdges = mainPath.slice(1).map((item, index) => {
                            return this.props.stories.active.edges.find(edge => edge.source == mainPath[index] && edge.destination == item)
                        })
                        this.props.setActiveTrace({
                            mainPath: mainPath,
                            mainEdges: mainEdges,
                            sidePaths: paths.slice(1).map(ids => {
                                let path = ids.map(id => this.props.stories.active.clusters.find(e => e.label == id))
                                let edges = path.slice(1).map((item, index) => {
                                    return this.props.stories.active.edges.find(edge => edge.source == path[index] && edge.destination == item)
                                })
                                return {
                                    nodes: path,
                                    edges: edges,
                                    syncNodes: getSyncNodesAlt(mainPath, path)
                                }
                            })
                        })
                    }

                    handleClose()
                }}>{"Stories ... Starting from this Group"}</MenuItem>

                <MenuItem onClick={() => {
                    this.traceSelect = new TraceSelectTool(this.state.menuTarget)

                    handleClose()
                }}>{"Stories ... Between 2 Group"}</MenuItem>

            </Menu>





            <Menu
                keepMounted
                open={this.state.menuY !== null && this.state.menuTarget instanceof Edge}
                onClose={handleClose}
                anchorReference="anchorPosition"
                anchorPosition={
                    this.state.menuY !== null && this.state.menuX !== null
                        ? { top: this.state.menuY, left: this.state.menuX }
                        : undefined
                }
            >
                <MenuItem onClick={() => {
                    this.props.removeEdgeFromActive(this.state.menuTarget)

                    handleClose()
                }}>{'Delete Edge'}</MenuItem>
            </Menu>

        </div>
    }
})