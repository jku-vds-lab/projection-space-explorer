
import { getDefaultZoom, arraysEqual, normalizeWheel, centerOfMass, interpolateLinear, generateZoomForSet } from './UtilityFunctions';
import { LassoSelection } from './tools'
import { isPointInConvaveHull } from '../Utility/geometry'
import * as React from "react";
import * as THREE from 'three'
import { LassoLayer } from './LassoLayer/LassoLayer';
import Cluster from '../Utility/Data/Cluster';
import { connect, ConnectedProps } from 'react-redux'
import { Tool, getToolCursor, ToolSelectionRedux } from '../Overlays/ToolSelection/ToolSelection';
import { Vect } from "../Utility/Data/Vect";
import { setClusterEdgesAction } from "../Ducks/ClusterEdgesDuck";
import { setViewTransform } from "../Ducks/ViewTransformDuck";
import { setSelectedClusters, toggleSelectedCluster } from "../Ducks/SelectedClustersDuck";
import { setAggregationAction, toggleAggregationAction } from "../Ducks/AggregationDuck";
import { CameraTransformations } from './CameraTransformations'
import { Camera } from 'three';
import { LineVisualization, PointVisualization } from './meshes';
import { MultivariateClustering } from './Visualizations/MultivariateClustering';
import { DisplayMode } from '../Ducks/DisplayModeDuck';
import { setActiveLine } from '../Ducks/ActiveLineDuck';
import { ClusterMode } from '../Ducks/ClusterModeDuck';
import { setHoverState } from '../Ducks/HoverStateDuck';
import { mappingFromScale } from '../Utility/Colors/colors';
import { setPointColorMapping } from '../Ducks/PointColorMappingDuck';
import { RootState } from '../Store/Store';
import { Dialog, DialogContent, Menu, MenuItem, Typography } from '@material-ui/core';
import * as nt from '../NumTs/NumTs'
import { MouseController } from './MouseController';
import { removeClusterFromStories } from '../Ducks/StoriesDuck';
import { removeCluster } from '../Ducks/CurrentClustersDuck';
import * as LineUpJS from 'lineupjs'
import { setLineUpInput } from '../Ducks/LineUpInputDuck';


type ViewState = {
    hoverCluster: any
    displayClusters: any
    camera: Camera
    menuX: number
    menuY: number
    menuTarget: any
}

const mapStateToProps = (state: RootState) => ({
    currentTool: state.currentTool,
    currentAggregation: state.currentAggregation,
    clusters: state.currentClusters,
    vectorByShape: state.vectorByShape,
    checkedShapes: state.checkedShapes,
    dataset: state.dataset,
    highlightedSequence: state.highlightedSequence,
    activeLine: state.activeLine,
    advancedColoringSelection: state.advancedColoringSelection,
    clusterMode: state.clusterMode,
    selectedClusters: state.selectedClusters,
    displayMode: state.displayMode,
    lineBrightness: state.lineBrightness,
    pathLengthRange: state.pathLengthRange,
    globalPointSize: state.globalPointSize,
    channelSize: state.channelSize,
    channelColor: state.channelColor,
    pointColorScale: state.pointColorScale,
    stories: state.stories,
    trailSettings: state.trailSettings
})


const mapDispatchToProps = dispatch => ({
    setCurrentAggregation: id => dispatch(setAggregationAction(id)),
    setClusterEdges: clusterEdges => dispatch(setClusterEdgesAction(clusterEdges)),
    setActiveLine: activeLine => dispatch(setActiveLine(activeLine)),
    setViewTransform: (camera, width, height) => dispatch(setViewTransform(camera, width, height)),
    toggleSelectedCluster: selectedCluster => dispatch(toggleSelectedCluster(selectedCluster)),
    toggleAggregation: aggregation => dispatch(toggleAggregationAction(aggregation)),
    setHoverState: hoverState => dispatch(setHoverState(hoverState)),
    setPointColorMapping: mapping => dispatch(setPointColorMapping(mapping)),
    removeClusterFromStories: cluster => dispatch(removeClusterFromStories(cluster)),
    removeCluster: cluster => dispatch(removeCluster(cluster)),
    setSelectedClusters: clusters => dispatch(setSelectedClusters(clusters)),
    setLineUpInput: input => dispatch(setLineUpInput(input))
})


const connector = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux





export const WebGLView = connector(class extends React.Component<Props, ViewState> {
    lasso: LassoSelection
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
        this.mouseDown = false

        this.initMouseController()

        this.mouse = { x: 0, y: 0 }
        this.mouseDownPosition = { x: 0, y: 0 }
        this.initialMousePosition = null

        this.currentHover = null

        this.state = {
            // clusters to display using force-directed layout
            displayClusters: [],
            camera: null,
            hoverCluster: undefined,
            menuX: null,
            menuY: null,
            menuTarget: null
        }
    }







    /**
     * Initializes the callbacks for the MouseController.
     */
    initMouseController() {
        this.mouseController.onDragStart = (event: MouseEvent, button: number) => {
            //console.log("on drag start")
            switch (button) {
                case 0:
                    if (this.props.currentTool == Tool.Default) {
                        let initialWorld = CameraTransformations.screenToWorld({ x: event.offsetX, y: event.offsetY }, this.createTransform())

                        this.lasso = new LassoSelection()
                        this.lasso.mouseDown(true, initialWorld.x, initialWorld.y)
                    }
                    break;
            }
        }


        this.mouseController.onDragEnd = (event: MouseEvent, button: number) => {
            // console.log("on drag end")
            switch (button) {
                case 0:
                    if (this.props.currentTool == Tool.Default) {
                        let coords = CameraTransformations.screenToWorld({ x: event.offsetX, y: event.offsetY }, this.createTransform())
                        if (this.lasso != null) {
                            // If there is an active lasso, process it
                            var wasDrawing = this.lasso.drawing

                            this.lasso.mouseUp(coords.x, coords.y)

                            var indices = this.lasso.selection(this.props.dataset.vectors, (vector) => this.particles.isPointVisible(vector))
                            if (indices.length > 0 && wasDrawing) {
                                var selected = indices.map(index => this.props.dataset.vectors[index])

                                if (event.shiftKey) {
                                    this.props.toggleAggregation(selected)
                                } else {
                                    this.props.setCurrentAggregation(selected)
                                }

                            } else if (wasDrawing) {
                                this.clearSelection()
                            }

                            this.lasso = null
                        }
                    }
                    break;
            }
        }

        this.mouseController.onDragMove = (event: MouseEvent, button: number) => {
            //console.log("on drag move")

            switch (button) {
                case 0:
                    if (this.props.currentTool == Tool.Default) {
                        let coords = CameraTransformations.screenToWorld({ x: event.offsetX, y: event.offsetY }, this.createTransform())
                        this.lasso?.mouseMove(coords.x, coords.y)
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
            //console.log("on context")

            switch (button) {
                case 0:
                    if (this.props.currentTool == Tool.Default) {
                        if (this.currentHover != null) {
                            if (event.shiftKey) {
                                // There is a hover target ... select it
                                this.props.toggleAggregation([this.currentHover])
                            } else {
                                this.props.setCurrentAggregation([this.currentHover])
                            }
                        }
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
                        this.setState({
                            menuX: event.clientX,
                            menuY: event.clientY,
                            menuTarget: null
                        })
                    }

                    break;
            }
        }

        this.mouseController.onMouseUp = (event: MouseEvent) => {
            //console.log("mouse up")
        }
    }



    chooseCluster(screenPosition: { x: number, y: number }) {
        let nearest = null
        let min = Number.MAX_SAFE_INTEGER

        this.props.clusters?.forEach(cluster => {
            let clusterScreen = CameraTransformations.worldToScreen(new THREE.Vector2(cluster.getCenter().x, cluster.getCenter().y), this.createTransform())
            let dist = nt.euclideanDistance(screenPosition.x, screenPosition.y, clusterScreen.x, clusterScreen.y)

            if (dist < min && dist < 16) {
                nearest = cluster
                min = dist
            }
        })

        return nearest
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

    onMouseDown(event) {
        this.mouseController.mouseDown(event)

        event.preventDefault();


        switch (event.button) {
            case 0:
                this.mouseDown = true
                this.initialMousePosition = new THREE.Vector2(event.offsetX, event.offsetY)
                this.mouseDownPosition = this.normaliseMouse(event)
                break;
            default:
                break;
        }
    }


    onKeyDown(event) {
    }





    onMouseMove(event) {

        this.mouseController.mouseMove(event)

        event.preventDefault();

        var bounds = this.containerRef.current.getBoundingClientRect()
        var coords = CameraTransformations.screenToWorld({ x: event.clientX - bounds.left, y: event.clientY - bounds.top }, this.createTransform())

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
                if (!this.mouseDown) {
                    this.infoTimeout = setTimeout(() => {
                        this.infoTimeout = null

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

                        var list = []
                        if (idx >= 0) {
                            if (this.currentHover != this.props.dataset.vectors[idx]) {
                                this.currentHover = this.props.dataset.vectors[idx]
                                list.push(this.props.dataset.vectors[idx])
                                this.props.setHoverState(list)
                                this.requestRender()
                            }
                        } else {
                            if (this.currentHover) {
                                this.currentHover = null
                                this.props.setHoverState(list)
                                this.requestRender()
                            }
                        }
                    }, 10);
                }
                break;
            case Tool.Move:
                // If the selected tool is the move tool, process it
                this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;


                if (this.mouseDown) {
                    this.camera.position.x = this.camera.position.x - (this.mouse.x - this.mouseDownPosition.x) * (600 / this.camera.zoom);
                    this.camera.position.y = this.camera.position.y - (this.mouse.y - this.mouseDownPosition.y) * (600 / this.camera.zoom);
                    this.mouseDownPosition = this.normaliseMouse(event)
                    this.camera.updateProjectionMatrix()

                    this.requestRender()

                    this.props.setViewTransform(this.camera, this.getWidth(), this.getHeight())
                }
                break;
            case Tool.Grab:
                // In case we have a line in the sequence UI
                if (this.props.activeLine) {
                    break;
                }
                var found = false
                this.props.clusters?.forEach(cluster => {
                    switch (this.props.clusterMode) {
                        case ClusterMode.Univariate: {
                            if (cluster.containsPoint(coords)) {
                                if (isPointInConvaveHull(coords, cluster.hull.map(h => ({ x: h[0], y: h[1] })))) {
                                    found = true
                                    if (this.state.hoverCluster != cluster) {
                                        this.setState({
                                            hoverCluster: cluster
                                        })
                                    }
                                }
                            }
                        }
                        case ClusterMode.Multivariate: {
                            if (new THREE.Vector2(coords.x, coords.y).distanceTo(new THREE.Vector2(cluster.getCenter().x, cluster.getCenter().y)) < 1) {
                                found = true
                                if (this.state.hoverCluster != cluster) {
                                    this.setState({
                                        hoverCluster: cluster
                                    })
                                }

                            }
                        }
                    }
                })
                if (!found && this.state.hoverCluster) {
                    this.setState({
                        hoverCluster: null
                    })
                }
                break;
        }
    }

    onMouseUp(event: MouseEvent) {

        this.mouseController.mouseUp(event)

        var bounds = this.containerRef.current.getBoundingClientRect()
        var coords = CameraTransformations.screenToWorld({ x: event.clientX - bounds.left, y: event.clientY - bounds.top }, this.createTransform())

        switch (this.props.currentTool) {
            case Tool.Default:
                // In case we have a line in the sequence UI
                if (this.props.displayMode == DisplayMode.OnlyClusters) {
                    break;
                }
                if (this.props.activeLine) {
                    break;
                }


                /**if (this.lasso != null) {
                    // If there is an active lasso, process it
                    var wasDrawing = this.lasso.drawing

                    this.lasso.mouseUp(coords.x, coords.y)

                    var indices = this.lasso.selection(this.props.dataset.vectors, (vector) => this.particles.isPointVisible(vector))
                    if (indices.length > 0 && wasDrawing) {
                        var selected = indices.map(index => this.props.dataset.vectors[index])

                        if (event.shiftKey) {
                            this.props.toggleAggregation(selected)
                        } else {
                            this.props.setCurrentAggregation(selected)
                        }

                    } else if (wasDrawing) {
                        this.clearSelection()
                    }

                    this.lasso = null
                } else {
                    if (this.currentHover != null && event.button == 0) {
                        if (event.shiftKey) {
                            // There is a hover target ... select it
                            this.props.toggleAggregation([this.currentHover])
                        } else {
                            this.props.setCurrentAggregation([this.currentHover])
                        }

                    }
                }**/

                break;
            case Tool.Grab:
                // In case we have a line in the sequence UI
                if (this.props.activeLine) {
                    break;
                }


                if (event.button == 0) {
                    let selected = this.chooseCluster({ x: event.offsetX, y: event.offsetY })

                    // Toggle
                    if (selected) {
                        this.onClusterClicked(selected)
                    }
                }



                break;
            case Tool.Crosshair:
                if (this.props.displayMode == DisplayMode.OnlyClusters) {
                    break;
                }

                var idx = this.choose(coords)
                if (idx >= 0) {
                    var vector = this.props.dataset.vectors[idx]
                    this.props.setActiveLine(vector.view.segment)
                }

                break;
        }

        this.particles.update()
        this.mouseDown = false;
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

        this.particles = new PointVisualization(this.vectorColorScheme, this.props.dataset, window.devicePixelRatio * 12, this.lines?.grayedLayerSystem)
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
        }
        catch {

        }
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



    renderLoop() {
        var ctx = this.selectionRef.current.getContext()
        ctx.clearRect(0, 0, this.getWidth(), this.getHeight(), 'white');

        this.selectionRef.current.setDimensions(this.getWidth() * window.devicePixelRatio,
            this.getHeight() * window.devicePixelRatio)

        this.renderLasso(ctx)




        if (this.props.highlightedSequence != null) {
            this.selectionRef.current.renderHighlightedSequence(ctx, this.props.highlightedSequence)
        }
    }

    onClusterClicked(cluster: Cluster) {
        function deriveFromClusters(clusters: Cluster[]) {
            let agg = clusters.map(cluster => cluster.vectors).flat()
            return [...new Set(agg)]
        }

        switch (this.props.currentTool) {
            case Tool.Default:
                this.props.toggleSelectedCluster(cluster)
                this.props.setCurrentAggregation(deriveFromClusters(this.props.selectedClusters))
                break;
            case Tool.Grab:
                this.props.toggleSelectedCluster(cluster)
                this.props.setCurrentAggregation(deriveFromClusters(this.props.selectedClusters))
                break;

        }
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



    componentDidUpdate(prevProps, prevState) {

        if (prevProps.stories != this.props.stories) {
            if (this.props.stories.active) {
                this.particles?.storyTelling(this.props.stories)

                this.lines?.storyTelling(this.props.stories)
                this.lines?.update()

                this.particles?.update()
            } else {
                this.particles?.storyTelling(null)

                this.lines?.storyTelling(this.props.stories)
                this.lines?.update()

                this.particles?.update()
            }
        }

        if (prevProps.pointColorScale != this.props.pointColorScale) {
            if (this.props.channelColor && this.props.pointColorScale) {
                let mapping = mappingFromScale(this.props.pointColorScale, this.props.channelColor, this.props.dataset)
                this.props.setPointColorMapping(mapping)
                this.particles.colorCat(this.props.channelColor, mapping)
            } else {
                this.props.setPointColorMapping(null)
                this.particles.colorCat(null, null)
            }
        }

        if (prevProps.globalPointSize != this.props.globalPointSize && this.particles) {
            this.particles.sizeCat(this.props.channelSize, this.props.globalPointSize)
            this.particles.updateSize()
        }


        if (prevProps.lineBrightness != this.props.lineBrightness) {
            this.lines?.setBrightness(this.props.lineBrightness)
        }

        if (prevProps.displayMode != this.props.displayMode) {
            switch (this.props.displayMode) {
                case DisplayMode.StatesAndClusters:
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
                    if (this.props.dataset.isSequential) {
                        this.lines.meshes.forEach(line => {
                            this.scene.remove(line.line)
                        })
                    }

                    this.pointScene.remove(this.particles.mesh)
                    break;
            }
        }


        if (!arraysEqual(prevProps.currentAggregation, this.props.currentAggregation)) {
            if (this.props.dataset.isSequential) {
                var uniqueIndices = [...new Set(this.props.currentAggregation.map(vector => vector.view.segment.lineKey))]

                this.lines.groupHighlight(uniqueIndices)
            } else {
                this.particles.groupHighlight(this.props.currentAggregation)
            }

            this.props.dataset.vectors.forEach(sample => sample.view.selected = false)
            this.props.currentAggregation.forEach(sample => {
                sample.view.selected = true
            })

            this.particles.update()
        }

        // If 
        if ((this.props.currentTool == Tool.Default && !arraysEqual(prevProps.currentAggregation, this.props.currentAggregation))
            || (prevProps.currentTool != this.props.currentTool && this.props.currentTool == Tool.Default)) {
            this.multivariateClusterView?.current.highlightSamples(this.props.currentAggregation)
        }

        // if the hoverCluster state changed and its a multivariate cluster, we need to enable the three js scene part
        if (!arraysEqual(prevProps.selectedClusters, this.props.selectedClusters)
            || (prevProps.currentTool != this.props.currentTool && this.props.currentTool == Tool.Grab)) {

            this.multivariateClusterView?.current.highlightCluster(this.props.selectedClusters)

            function deriveFromClusters(clusters: Cluster[]) {
                let agg = clusters.map(cluster => cluster.vectors).flat()
                return [...new Set(agg)]
            }

            this.props.setCurrentAggregation(deriveFromClusters(this.props.selectedClusters))
        }

        // Path length range has changed, update view accordingly
        if (this.props.dataset && this.props.dataset.isSequential && prevProps.pathLengthRange !== this.props.pathLengthRange) {
            // Set path length range on all segment views, and update them
            this.segments.forEach(segment => {
                segment.view.pathLengthRange = this.props.pathLengthRange.range
            })

            this.lines.update()
            this.particles.update()
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
                // Highlight correct line

                //this.lines.groupHighlight([this.props.activeLine.lineKey])
                this.lines.highlight([this.props.activeLine.lineKey], this.getWidth(), this.getHeight(), this.scene, true)
            } else {
                this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene, true)
                this.particles.update()
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
        this.multivariateClusterView?.current.createTriangulatedMesh(this.props.clusters)
    }

    renderEdge(ctx) {
        if (this.trees) {

            ctx.setLineDash([]);
            ctx.strokeStyle = 'rgba(127, 127, 255, 0.7)';
            ctx.lineWidth = 10 * window.devicePixelRatio;

            ctx.beginPath()

            this.trees.forEach(tree => {
                tree.forEach((connection, i) => {
                    var a = this.edgeClusters[connection.source]
                    var b = this.edgeClusters[connection.target]

                    var p0 = CameraTransformations.worldToScreen(new Cluster(a.map(e => e.source)).getCenter(), this.createTransform())
                    var p1 = CameraTransformations.worldToScreen(new Cluster(a.map(e => e.target)).getCenter(), this.createTransform())

                    ctx.moveTo(p0.x * window.devicePixelRatio, p0.y * window.devicePixelRatio)
                    ctx.lineTo(p1.x * window.devicePixelRatio, p1.y * window.devicePixelRatio)

                    p0 = CameraTransformations.worldToScreen(new Cluster(b.map(e => e.source)).getCenter(), this.createTransform())
                    p1 = CameraTransformations.worldToScreen(new Cluster(b.map(e => e.target)).getCenter(), this.createTransform())
                    ctx.moveTo(p0.x * window.devicePixelRatio, p0.y * window.devicePixelRatio)
                    ctx.lineTo(p1.x * window.devicePixelRatio, p1.y * window.devicePixelRatio)
                })
            })

            ctx.stroke()
            ctx.closePath()
        }
    }



    onClusterZoom(cluster) {
        this.props.setCurrentAggregation(cluster.vectors)
        this.props.setSelectedClusters([cluster])
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
            style={{
                //display: 'flex',
                //flexGrow: 1,
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

                {
                    this.state.hoverCluster != null && this.props.currentTool == Tool.Grab ?
                        <div
                            className='speech-bubble-ds'
                            style={{
                                position: 'absolute',
                                right: this.getWidth() - CameraTransformations.worldToScreen(this.state.hoverCluster.getCenter(this.vectors), this.createTransform()).x,
                                bottom: this.getHeight() - CameraTransformations.worldToScreen(this.state.hoverCluster.getCenter(this.vectors), this.createTransform()).y - 10,
                            }}>
                            <Typography>{this.state.hoverCluster.getTextRepresentation()}</Typography>
                        </div>


                        :
                        <div></div>
                }


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
                    // Set the whole dataset as input for LineUp
                    this.props.setLineUpInput(this.props.dataset.vectors)

                    handleClose()
                }}>Load LineUp</MenuItem>

                <MenuItem onClick={() => {
                    // Only load LineUp if the current selection is not empty
                    if (this.props.currentAggregation.length > 0) {
                        this.props.setLineUpInput(this.props.currentAggregation)

                        handleClose()
                    }
                }}>Load LineUp (selection only)</MenuItem>

                <MenuItem onClick={() => {
                    // Set LineUp input to null closes it
                    this.props.setLineUpInput(null)

                    handleClose()
                }}>{'Debug -> Close LineUp'}</MenuItem>

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
                    this.props.removeCluster(this.state.menuTarget)


                    handleClose()
                }}>Delete Cluster</MenuItem>
            </Menu>

            
        </div>
    }
})