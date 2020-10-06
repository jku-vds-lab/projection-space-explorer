
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import { getDefaultZoom, arraysEqual, normalizeWheel, centerOfMass, interpolateLinear, generateZoomForSet } from './UtilityFunctions';
import { LassoSelection } from './tools'
import { isPointInConvaveHull } from '../util/geometry'
import { GenericClusterLegend } from '../legends/Generic'
import * as React from "react";
import * as THREE from 'three'
import { LassoLayer } from './LassoLayer/LassoLayer';
import { ForceLayout } from './ForceLayout/ForceLayout';
import Cluster from '../util/Cluster';
import { connect } from 'react-redux'
import { graphLayout } from '../util/graphs';
import { Tool, getToolCursor } from '../Overlays/ToolSelection/ToolSelection';
import { Dataset, DataLine, Vect } from '../util/datasetselector';
import { setClusterEdgesAction } from "../Ducks/ClusterEdgesDuck";
import { setViewTransform } from "../Ducks/ViewTransformDuck";
import { toggleSelectedCluster } from "../Ducks/SelectedClustersDuck";
import { setAggregationAction, toggleAggregationAction } from "../Ducks/AggregationDuck";
import { ViewTransform } from './ViewTransform'
import { Camera } from 'three';
import { LineVisualization, PointVisualization, ClusterVisualization } from './meshes';
import { MultivariateClustering } from './Visualizations/MultivariateClustering';
import { DisplayMode } from '../Ducks/DisplayModeDuck';
import { setActiveLine } from '../Ducks/ActiveLineDuck';
import { ClusterMode } from '../Ducks/ClusterModeDuck';


const useStyles = makeStyles(theme => ({
    margin: {
        height: theme.spacing(3),
    }
}));

const SettingsPopover = ({ onChangeSlider }) => {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [value, setValue] = React.useState(100);

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const open = Boolean(anchorEl);
    const id = open ? 'simple-popover' : undefined;

    const marks = [
        {
            value: 50,
            label: '50%',
        },
        {
            value: 75,
            label: '75%',
        },
        {
            value: 100,
            label: '100%',
        },
        {
            value: 125,
            label: '125%',
        },
        {
            value: 150,
            label: '150%'
        }
    ];

    return (
        <div>
            <IconButton onClick={handleClick}>
                <SettingsIcon />
            </IconButton>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="stretch"

                    style={{ width: '16rem', height: '16rem', margin: '2rem' }}>
                    <div>
                        <Typography id="discrete-slider" gutterBottom>
                            Point Scale
                        </Typography>
                        <Slider
                            onChange={(event, val: number) => { setValue(val); onChangeSlider(val / 100.0) }}
                            value={value}
                            aria-labelledby="discrete-slider"
                            valueLabelDisplay="auto"
                            step={5}
                            marks={marks}
                            min={50}
                            max={150}
                        />
                    </div>
                </Grid>
            </Popover>
        </div>
    );
}








type ViewProps = {
    dataset: Dataset
    currentTool: Tool
    openTab: number
    currentAggregation: any
    clusters: Cluster[]
    setActiveLine: any
    activeLine: DataLine
    highlightedSequence: any
    setCurrentAggregation: any
    viewTransform: ViewTransform
    onHover: any
    setClusterEdges: any
    setViewTransform: any
    checkedShapes: any
    vectorByShape: any
    pathLengthRange: any
    advancedColoringSelection: boolean[]
    clusterMode: ClusterMode
    toggleSelectedCluster: any
    toggleAggregation: any
    selectedClusters: Cluster[]
    displayMode: DisplayMode
    lineBrightness: number
}

type ViewState = {
    hoverCluster: any
    displayClusters: any
    camera: Camera
    forceLayoutRef: any
}

const mapStateToProps = state => ({
    currentTool: state.currentTool,
    currentAggregation: state.currentAggregation,
    clusters: state.currentClusters,
    openTab: state.openTab,
    vectorByShape: state.vectorByShape,
    checkedShapes: state.checkedShapes,
    dataset: state.dataset,
    highlightedSequence: state.highlightedSequence,
    activeLine: state.activeLine,
    viewTransform: state.viewTransform,
    advancedColoringSelection: state.advancedColoringSelection,
    clusterMode: state.clusterMode,
    selectedClusters: state.selectedClusters,
    displayMode: state.displayMode,
    lineBrightness: state.lineBrightness
})


const mapDispatchToProps = dispatch => ({
    setCurrentAggregation: id => dispatch(setAggregationAction(id)),
    setClusterEdges: clusterEdges => dispatch(setClusterEdgesAction(clusterEdges)),
    setActiveLine: activeLine => dispatch(setActiveLine(activeLine)),
    setViewTransform: viewTransform => dispatch(setViewTransform(viewTransform)),
    toggleSelectedCluster: selectedCluster => dispatch(toggleSelectedCluster(selectedCluster)),
    toggleAggregation: aggregation => dispatch(toggleAggregationAction(aggregation))
})


export const WebGLView = connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true })(class extends React.Component<ViewProps, ViewState> {
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
    clusterVisualization: any;
    mouseMoveListener: any;
    mouseDownListener: any;
    keyDownListener: any;
    wheelListener: any;
    mouseUpListener: any;
    infoTimeout: any
    multivariateClusterView: MultivariateClustering


    constructor(props) {
        super(props)

        this.containerRef = React.createRef()
        this.selectionRef = React.createRef()
        this.physicsRef = React.createRef()
        this.mouseDown = false

        this.mouse = { x: 0, y: 0 }
        this.mouseDownPosition = { x: 0, y: 0 }
        this.initialMousePosition = null

        this.currentHover = null

        this.state = {
            // clusters to display using force-directed layout
            displayClusters: [],
            camera: null,
            forceLayoutRef: React.createRef(),
            hoverCluster: undefined
        }
    }

    dist(x1, y1, x2, y2) {
        var a = x1 - x2;
        var b = y1 - y2;

        var c = Math.sqrt(a * a + b * b);
        return c
    }

    choose(position) {
        var best = 30 / (this.camera.zoom * 2.0)
        var res = -1

        for (var index = 0; index < this.vectors.length; index++) {
            var value = this.vectors[index]

            // Skip points matching some criteria
            if (!this.particles.isPointVisible(value)) {
                continue
            }

            var d = this.dist(position.x, position.y, value.x, value.y)

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


    clientCoordinatesToWorld(clientX, clientY) {
        var container = this.containerRef.current;
        var width = container.offsetWidth;
        var height = container.offsetHeight;

        const rect = container.getBoundingClientRect();



        return {
            x: (clientX - rect.left - width / 2) / this.camera.zoom + this.camera.position.x,
            y: -(clientY - rect.top - height / 2) / this.camera.zoom + this.camera.position.y
        }
    }

    componentDidMount() {
        this.setupRenderer()
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
        this.props.viewTransform.width = width
        this.props.viewTransform.height = height
    }

    onMouseDown(event) {
        event.preventDefault();

        this.mouseDown = true
        this.initialMousePosition = new THREE.Vector2(event.clientX, event.clientY)
        this.mouseDownPosition = this.normaliseMouse(event)
    }


    onKeyDown(event) {
    }





    onMouseMove(event) {
        event.preventDefault();

        var bounds = this.containerRef.current.getBoundingClientRect()
        var coords = this.props.viewTransform.screenToWorld({ x: event.clientX - bounds.left, y: event.clientY - bounds.top })

        switch (this.props.currentTool) {
            case Tool.Default:
                if (this.props.displayMode == DisplayMode.OnlyClusters) {
                    break;
                }

                // In case we have a line in the sequence UI
                if (this.props.activeLine) {
                    break;
                }
                var mousePosition = new THREE.Vector2(event.clientX, event.clientY)

                if (this.initialMousePosition != null && this.initialMousePosition.distanceTo(mousePosition) > 10 && this.lasso == null && this.mouseDown) {
                    var initialWorld = this.clientCoordinatesToWorld(this.initialMousePosition.x, this.initialMousePosition.y)

                    this.lasso = new LassoSelection()
                    this.lasso.mouseDown(true, initialWorld.x, initialWorld.y)
                } else if (this.lasso != null) {
                    this.lasso.mouseMove(coords.x, coords.y)
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
                                this.lines.highlight([this.vectors[idx].view.segment.lineKey], this.getWidth(), this.getHeight(), this.scene)
                            } else {
                                this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene)
                            }
                        }

                        var list = []
                        if (idx >= 0) {
                            this.currentHover = this.vectors[idx]
                            list.push(this.vectors[idx])
                        } else {
                            this.currentHover = null
                        }
                        this.props.onHover(list)

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
                                    this.setState({
                                        hoverCluster: cluster
                                    })
                                }
                            }
                        }
                        case ClusterMode.Multivariate: {
                            if (new THREE.Vector2(coords.x, coords.y).distanceTo(new THREE.Vector2(cluster.getCenter().x, cluster.getCenter().y)) < 1) {
                                found = true
                                this.setState({
                                    hoverCluster: cluster
                                })
                            }
                        }

                    }

                })
                if (!found) {
                    this.setState({
                        hoverCluster: null
                    })
                }
                break;

        }
    }

    onMouseUp(event) {
        var bounds = this.containerRef.current.getBoundingClientRect()
        var coords = this.props.viewTransform.screenToWorld({ x: event.clientX - bounds.left, y: event.clientY - bounds.top })

        switch (this.props.currentTool) {
            case Tool.Default:
                // In case we have a line in the sequence UI
                if (this.props.displayMode == DisplayMode.OnlyClusters) {
                    break;
                }
                if (this.props.activeLine) {
                    break;
                }
                if (this.lasso != null) {
                    // If there is an active lasso, process it
                    var wasDrawing = this.lasso.drawing

                    this.lasso.mouseUp(coords.x, coords.y)

                    var indices = this.lasso.selection(this.vectors, (vector) => this.particles.isPointVisible(vector))
                    if (indices.length > 0 && wasDrawing) {
                        var selected = indices.map(index => this.vectors[index])

                        this.props.toggleAggregation(selected)
                    } else if (wasDrawing) {
                        this.clearSelection()
                    }

                    this.lasso = null
                } else {
                    if (this.currentHover != null) {
                        // There is a hover target ... select it
                        this.props.toggleAggregation([this.currentHover])
                    }
                }

                break;
            case Tool.Grab:
                // In case we have a line in the sequence UI
                if (this.props.activeLine) {
                    break;
                }

                switch (this.props.clusterMode) {
                    case ClusterMode.Univariate: {
                        // current hover is null, check if we are inside a cluster
                        var found = false
                        this.props.clusters?.forEach(cluster => {
                            if (cluster.label != '-1') {
                                if (isPointInConvaveHull(coords, cluster.hull.map(h => ({ x: h[0], y: h[1] })))) {
                                    found = true

                                    if (event.button == 0) {
                                        var selected = cluster.points.map(h => this.dataset.vectors[h.meshIndex])

                                        this.props.toggleAggregation(selected)
                                    } else if (event.button == 1) {
                                        this.setZoomTarget(cluster.vectors, 1)
                                    }
                                }
                            }
                        })
                        if (!found) {
                            this.clearSelection()
                        }
                    }
                    case ClusterMode.Multivariate: {
                        let selected: Cluster = null
                        let minDist = Number.MAX_VALUE
                        this.props.clusters?.forEach(cluster => {
                            let dist = new THREE.Vector2(coords.x, coords.y).distanceTo(new THREE.Vector2(cluster.getCenter().x, cluster.getCenter().y))
                            if (dist < 1 && dist < minDist) {
                                selected = cluster
                                minDist = dist
                            }
                        })

                        // Toggle
                        if (selected) {
                            this.props.toggleSelectedCluster(selected)
                            this.props.toggleAggregation(selected.vectors)
                        }
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

        this.vectors.forEach((vector, index) => {
            vector.view.selected = false
        })

        this.props.setCurrentAggregation([])
    }


    onWheel(event) {
        event.preventDefault()

        var normalized = normalizeWheel(event)

        // Store world position under mouse
        var bounds = this.containerRef.current.getBoundingClientRect()
        var worldBefore = this.props.viewTransform.screenToWorld({ x: event.clientX - bounds.left, y: event.clientY - bounds.top })
        var screenBefore = this.relativeMousePosition(event)

        var newZoom = this.camera.zoom - (normalized.pixelY * 0.013) / this.dataset.bounds.scaleFactor
        if (newZoom < 1.0 / this.dataset.bounds.scaleFactor) {
            this.camera.zoom = 1.0 / this.dataset.bounds.scaleFactor
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
    }

    restoreCamera(world, screen) {
        this.camera.position.x = world.x - ((screen.x - this.getWidth() / 2) / this.camera.zoom)
        this.camera.position.y = (world.y + ((screen.y - this.getHeight() / 2) / this.camera.zoom))
    }

    generateNoisyLoop(count, ccw, radius, noiseSize) {
        var verts = new Array(count * 2);
        var thetaPer = Math.PI * 2 / count;
        var backwards = ccw ? -1 : 1;
        for (var i = 0; i < count; i++) {
            var theta = thetaPer * i * backwards;
            var randomRadius = radius * (1 + Math.random() * noiseSize);
            verts[i * 2] = Math.cos(theta) * randomRadius;
            verts[i * 2 + 1] = Math.sin(theta) * randomRadius;
        }

        return verts;
    }



    deleteClusters() {
        this.clusterVisualization?.dispose(this.scene)
        this.clusterVisualization = null
        this.multivariateClusterView?.destroy()
        this.multivariateClusterView = null
    }


    /**
     * Creates the triangulated mesh that visualizes the clustering.
     * @param clusters an array of clusters
     */
    createClusters(clusters) {

        clusters.sort((a, b) => b.order() - a.order())


        if (this.clusterVisualization != null) {
            this.clusterVisualization.dispose(this.scene)
            this.clusterVisualization = null
        }

        var clusterMeshes = []
        var lineMeshes = []

        clusters.forEach((cluster, ii) => {
            if (cluster.label == -1 || ii > 15) return;

            var test = cluster.triangulation
            var polygon = cluster.hull

            var points = [];

            let material = new THREE.LineBasicMaterial({ color: 0x0000ff });
            polygon.forEach(pt => {
                points.push(new THREE.Vector3(pt[0], pt[1], -5));
            })
            var linege = new THREE.BufferGeometry().setFromPoints(points);
            var line = new THREE.Line(linege, material);
            this.scene.add(line);

            var geometry = new THREE.Geometry();

            var vi = 0
            for (var i = 0; i < test.length; i += 6) {
                var faceIn = []

                for (var x = 0; x < 3; x++) {

                    faceIn.push(vi)
                    var vertex = new THREE.Vector3(test[i + x * 2], test[i + x * 2 + 1])
                    vi = vi + 1
                    geometry.vertices.push(vertex)
                }

                geometry.faces.push(
                    new THREE.Face3(faceIn[0], faceIn[1], faceIn[2])
                )

            }

            let meshMat = new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.1
            });
            var mesh = new THREE.Mesh(geometry, meshMat);
            clusterMeshes.push(mesh)
            lineMeshes.push(line)
            this.scene.add(mesh);
        })

        this.clusterVisualization = new ClusterVisualization(clusterMeshes, lineMeshes)
    }



    createTrajectories(clusters) {
        const [edges] = graphLayout(clusters)

        this.props.setClusterEdges(edges)
    }


    getWidth() {
        return this.containerRef.current?.offsetWidth
    }

    getHeight() {
        return this.containerRef.current?.offsetHeight
    }



    /**
     * Create debug clustering for segments.
     * @param {*} bundles 
     */
    debugSegs(bundles, edgeClusters) {
        var cols = ['#ff0000',
            '#ff4000',
            '#ff8000',
            '#ffff00',
            '#bfff00',
            '#80ff00',
            '#40ff00',
            '#00ff00',
            '#00ff40',
            '#00ffbf',
            '#ff0040',
            '#ff00bf',
            '#bf00ff',
            '#4000ff',
            '#0040ff',
        ]
        Object.keys(bundles).forEach((label, i) => {
            var bundle = bundles[label]


            if (bundle.length > 10) {
                bundle.forEach(part => {
                    var geometry = new THREE.Geometry()
                    var material = new THREE.LineBasicMaterial({
                        color: cols[i % cols.length]
                    })

                    geometry.vertices.push(new THREE.Vector3(part[0], part[1], -1.0))
                    geometry.vertices.push(new THREE.Vector3(part[2], part[3], -1.0))

                    var line = new THREE.Line(geometry, material);
                    this.scene.add(line)
                })
            }
        })
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

        this.props.setViewTransform(new ViewTransform(this.camera, this.getWidth(), this.getHeight()))

        this.prevTime = performance.now()
        this.startRendering()
    }

    createVisualization(dataset, lineColorScheme, vectorColorScheme) {
        this.scene = new THREE.Scene()
        this.pointScene = new THREE.Scene()
        this.vectors = dataset.vectors
        this.segments = dataset.segments
        this.dataset = dataset
        this.lineColorScheme = lineColorScheme
        this.vectorColorScheme = vectorColorScheme


        // Update camera zoom to fit the problem
        this.camera.zoom = getDefaultZoom(this.vectors, this.getWidth(), this.getHeight())
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
        

        this.particles = new PointVisualization(this.vectorColorScheme, this.dataset)
        this.particles.createMesh(this.vectors, this.segments)
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
        container.addEventListener('wheel', this.wheelListener, false);
    }





    /**
     * Getting a list of edges this function will return the indices of all subtrees.
     * eg [[[0,1],[1,2],[1,3]], [...]]
     * @param {*} edgeClusters 
     */
    detectBundles(edgeClusters) {
        var MIN_CLUSTER_SIZE = 5

        var overlap = []
        var trees = []

        var uncheckt = edgeClusters.toMatrix().slice(0)
        uncheckt.forEach((a, ai) => {
            uncheckt.forEach((b, bi) => {
                if (a != b) {
                    if (a.length > MIN_CLUSTER_SIZE && b.length > MIN_CLUSTER_SIZE) {
                        var targetCluster = a.map(edge => edge.target)
                        var sourceCluster = b.map(edge => edge.source)

                        // Check for overlap between these clusters
                        var overlapNodes = targetCluster.filter(value => sourceCluster.includes(value))
                        var overlapPercentage = Math.max(overlapNodes.length / sourceCluster.length, overlapNodes.length / targetCluster.length)

                        if (overlapPercentage > 0.4) {
                            // We have enough overlap, construct a tree instance
                            overlap.push(new EdgeOverlap(ai, bi, overlapPercentage))
                        }
                    }
                }

            })
        })

        var nonStart = []

        // Find any overlap that has no start point
        for (var i = 0; i < overlap.length; i++) {
            var a = overlap[i]

            var predecessor = overlap.find(b => a.source == b.target)
            if (predecessor == undefined) {
                trees.push([a])
            } else {
                nonStart.push(a)
            }
        }

        while (nonStart.length > 0) {
            var a = nonStart.splice(0, 1)[0]
            for (var i = 0; i < trees.length; i++) {
                var tree = trees[i]
                var last = tree[tree.length - 1]

                if (last.target == a.source) {
                    tree.push(a)
                }
            }
        }


        return trees
    }



    /**     debugD3(edgeClusters) {
            this.trees = this.detectBundles(edgeClusters)
            this.edgeClusters = edgeClusters.toMatrix()
    
            var process = []
            this.trees.forEach(tree => {
                tree.forEach((connection, i) => {
                    process.push(this.edgeClusters[connection.source])
                    if (i == tree.length - 1) {
                        process.push(this.edgeClusters[connection.target])
                    }
                })
            })
    
            var cc = process.map(edgeCluster => {
                var vecs = edgeCluster.map(m => m.target)
                var c = new Cluster(vecs, null, null, null)
    
                c.vectors = c.points
                return c
            })
    
            return [this.trees, cc]
        }*/

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
        this.dataset.calculateBounds()
        this.camera.zoom = getDefaultZoom(this.vectors, this.getWidth(), this.getHeight())
        this.camera.position.x = 0.0
        this.camera.position.y = 0.0
        this.camera.updateProjectionMatrix();

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
        }

        if (this.renderer != null) {
            this.renderer.renderLists.dispose()
        }
    }


    startRendering() {
        requestAnimationFrame(() => this.startRendering());

        this.renderFrame()
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


    renderFrame() {
        // Calculate delta time
        var nextTime = performance.now()
        var deltaTime = (nextTime - this.lastTime) / 1000
        this.lastTime = nextTime

        // Update zoom in case a target has been set
        this.updateZoom(deltaTime)

        try {
            let forceLayout = this.state.forceLayoutRef.current

            this.renderer.clear()
            this.renderer.render(this.scene, this.camera)
            this.renderer.render(this.pointScene, this.camera)

            var ctx = this.selectionRef.current.getContext()
            ctx.clearRect(0, 0, this.getWidth(), this.getHeight(), 'white');

            this.selectionRef.current.setDimensions(this.getWidth() * window.devicePixelRatio,
                this.getHeight() * window.devicePixelRatio)

            this.renderLasso(ctx)
            forceLayout.renderLinks(ctx)
            forceLayout.renderClusterEdges(ctx)
            //this.renderEdge(ctx)

            if (this.props.highlightedSequence != null) {
                this.selectionRef.current.renderHighlightedSequence(ctx, this.props.highlightedSequence)
            }

        } catch (e) {
        }
    }



    componentDidUpdate(prevProps, prevState) {
        /**if (prevProps.openTab != this.props.openTab) {
            // openTab changed, check if we left clustering tab
            if (this.props.openTab != 1) {
                // Remove clustering view
                this.clusterVisualization?.dispose(this.scene)
                this.clusterVisualization = null
            }
            // If we changed to clustering tab... and we have clusters... create visualization
            if (this.props.openTab == 1) {
                if (this.clusterVisualization == null) {
                    this.createClusters(this.props.clusters)
                }
            }
        }**/


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

            this.vectors.forEach(sample => sample.view.selected = false)
            this.props.currentAggregation.forEach(sample => {
                sample.view.selected = true
            })

            this.particles.update()
        }

        // If we have clusters now... and are on clusters tab... create cluster visualization
        if (!arraysEqual(prevProps.clusters, this.props.clusters) && this.props.clusters != null) {
            if (this.props.openTab == 1) {
                if (this.props.dataset.multivariateLabels) {
                    this.multivariateClusterView?.destroy()
                    this.multivariateClusterView = new MultivariateClustering(this.props.dataset, this.scene, this.props.clusters)
                    this.multivariateClusterView?.create()
                } else {
                    this.clusterVisualization?.dispose(this.scene)
                    this.createClusters(this.props.clusters)
                }
            }
        } else if (!arraysEqual(prevProps.clusters, this.props.clusters) && this.props.clusters == null) {
            this.deleteClusters()
        }


        if ((this.props.currentTool == Tool.Default && !arraysEqual(prevProps.currentAggregation, this.props.currentAggregation))
            || (prevProps.currentTool != this.props.currentTool && this.props.currentTool == Tool.Default)) {
            this.multivariateClusterView?.highlightSamples(this.props.currentAggregation)
        }

        // if the hoverCluster state changed and its a multivariate cluster, we need to enable the three js scene part
        if (!arraysEqual(prevProps.selectedClusters, this.props.selectedClusters)
            || (prevProps.currentTool != this.props.currentTool && this.props.currentTool == Tool.Grab)) {
            this.multivariateClusterView?.highlightCluster(this.props.selectedClusters)
        }

        // Path length range has changed, update view accordingly
        if (this.props.dataset && this.props.dataset.isSequential && !arraysEqual(prevProps.pathLengthRange, this.props.pathLengthRange)) {
            // Set path length range on all segment views, and update them
            this.segments.forEach(segment => {
                segment.view.pathLengthRange = this.props.pathLengthRange
            })

            this.lines.update()
            this.particles.update()
        }

        if (prevProps.vectorByShape != this.props.vectorByShape) {
            this.filterPoints({ 'star': true, 'cross': true, 'circle': true, 'square': true })
            this.particles.shapeCat(this.props.vectorByShape)
        }

        if (prevProps.checkedShapes != this.props.checkedShapes) {
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

        if (prevProps.advancedColoringSelection != this.props.advancedColoringSelection) {
            this.particles.colorFilter(this.props.advancedColoringSelection)
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
            point = this.props.viewTransform.worldToScreen(point)

            if (index == 0) {
                ctx.moveTo(point.x * window.devicePixelRatio, point.y * window.devicePixelRatio);
            } else {
                ctx.lineTo(point.x * window.devicePixelRatio, point.y * window.devicePixelRatio);
            }
        }

        if (!this.lasso.drawing) {
            var conv = this.props.viewTransform.worldToScreen(points[0])
            ctx.lineTo(conv.x * window.devicePixelRatio, conv.y * window.devicePixelRatio);
        }

        ctx.fill();
        ctx.stroke();
        ctx.closePath();
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

                    var p0 = this.props.viewTransform.worldToScreen(new Cluster(a.map(e => e.source)).getCenter())
                    var p1 = this.props.viewTransform.worldToScreen(new Cluster(a.map(e => e.target)).getCenter())

                    ctx.moveTo(p0.x * window.devicePixelRatio, p0.y * window.devicePixelRatio)
                    ctx.lineTo(p1.x * window.devicePixelRatio, p1.y * window.devicePixelRatio)

                    p0 = this.props.viewTransform.worldToScreen(new Cluster(b.map(e => e.source)).getCenter())
                    p1 = this.props.viewTransform.worldToScreen(new Cluster(b.map(e => e.target)).getCenter())
                    ctx.moveTo(p0.x * window.devicePixelRatio, p0.y * window.devicePixelRatio)
                    ctx.lineTo(p1.x * window.devicePixelRatio, p1.y * window.devicePixelRatio)
                })
            })

            ctx.stroke()
            ctx.closePath()
        }
    }

    render() {
        return <div
            style={{
                display: 'flex',
                flexGrow: 1,
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
                    this.props.clusterMode == ClusterMode.Univariate && this.state.hoverCluster != null && this.props.currentTool == Tool.Grab ?
                        <div
                            className='speech-bubble-ds'
                            style={{
                                position: 'absolute',
                                right: this.getWidth() - this.props.viewTransform.worldToScreen(this.state.hoverCluster.getCenter(this.vectors)).x,
                                bottom: this.getHeight() - this.props.viewTransform.worldToScreen(this.state.hoverCluster.getCenter(this.vectors)).y - 10,
                            }}>
                            <GenericClusterLegend
                                cluster={this.state.hoverCluster}
                                type={this.dataset.info.type}
                            ></GenericClusterLegend>
                        </div>


                        :
                        <div></div>
                }

            </div>

            <LassoLayer ref={this.selectionRef}></LassoLayer>

            <ForceLayout
                ref={this.state.forceLayoutRef}
                dataset={this.dataset}
                camera={this.state.camera}
                width={this.getWidth()}
                height={this.getHeight()}></ForceLayout>


        </div>
    }
})



class EdgeOverlap {
    source: any;
    target: any;
    overlap: any;

    constructor(source, target, overlap) {
        this.source = source
        this.target = target
        this.overlap = overlap
    }
}