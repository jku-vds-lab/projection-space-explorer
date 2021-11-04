"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const UtilityFunctions_1 = require("./UtilityFunctions");
const tools_1 = require("./tools");
const React = require("react");
const THREE = require("three");
const LassoLayer_1 = require("./LassoLayer");
const Cluster_1 = require("../../model/Cluster");
const react_redux_1 = require("react-redux");
const Vector_1 = require("../../model/Vector");
const ViewTransformDuck_1 = require("../Ducks/ViewTransformDuck");
const AggregationDuck_1 = require("../Ducks/AggregationDuck");
const CameraTransformations_1 = require("./CameraTransformations");
const meshes_1 = require("./meshes");
const MultivariateClustering_1 = require("./MultivariateClustering");
const DisplayModeDuck_1 = require("../Ducks/DisplayModeDuck");
const ActiveLineDuck_1 = require("../Ducks/ActiveLineDuck");
const colors_1 = require("../Utility/Colors/colors");
const PointColorMappingDuck_1 = require("../Ducks/PointColorMappingDuck");
const material_1 = require("@mui/material");
const nt = require("../NumTs/NumTs");
const MouseController_1 = require("./MouseController");
const StoriesDuck_1 = require("../Ducks/StoriesDuck");
const Book_1 = require("../../model/Book");
const RenderingContextEx_1 = require("../Utility/RenderingContextEx");
const Edge_1 = require("../../model/Edge");
const NumTs_1 = require("../NumTs/NumTs");
const ClusterDragTool_1 = require("./ClusterDragTool");
const TraceSelectTool_1 = require("./TraceSelectTool");
const OpenTabDuck_1 = require("../Ducks/OpenTabDuck");
const HoverStateDuck_1 = require("../Ducks/HoverStateDuck");
const Intersection_1 = require("../Utility/Geometry/Intersection");
const Dataset_1 = require("../../model/Dataset");
const NamedCategoricalScales_1 = require("../Utility/Colors/NamedCategoricalScales");
const ObjectType_1 = require("../../model/ObjectType");
const uuid_1 = require("uuid");
const mapStateToProps = (state) => ({
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
    hoverState: state.hoverState
});
const mapDispatchToProps = dispatch => ({
    selectVectors: (vectors, shiftKey) => dispatch(AggregationDuck_1.selectVectors(vectors, shiftKey)),
    setActiveLine: activeLine => dispatch(ActiveLineDuck_1.setActiveLine(activeLine)),
    setViewTransform: (camera, width, height) => dispatch(ViewTransformDuck_1.setViewTransform(camera, width, height)),
    setHoverState: (hoverState, updater) => dispatch(HoverStateDuck_1.setHoverState(hoverState, updater)),
    setPointColorMapping: mapping => dispatch(PointColorMappingDuck_1.setPointColorMapping(mapping)),
    removeClusterFromStories: (cluster) => dispatch(StoriesDuck_1.removeClusterFromStories(cluster)),
    addStory: (story, activate) => dispatch(StoriesDuck_1.addStory(story, activate)),
    addClusterToStory: cluster => dispatch(StoriesDuck_1.addClusterToStory(cluster)),
    addEdgeToActive: (edge) => dispatch(StoriesDuck_1.addEdgeToActive(edge)),
    setActiveTrace: trace => dispatch(StoriesDuck_1.setActiveTrace(trace)),
    setOpenTab: tab => dispatch(OpenTabDuck_1.setOpenTabAction(tab)),
    setSelectedCluster: (clusters, shiftKey) => dispatch(AggregationDuck_1.selectClusters(clusters, shiftKey)),
    removeEdgeFromActive: (edge) => dispatch(StoriesDuck_1.removeEdgeFromActive(edge))
});
const connector = react_redux_1.connect(mapStateToProps, mapDispatchToProps, null, { forwardRef: true });
const UPDATER = "scatter";
exports.WebGLView = connector(class extends React.Component {
    constructor(props) {
        super(props);
        this.multivariateClusterView = React.createRef();
        this.mouseController = new MouseController_1.MouseController();
        this.containerRef = React.createRef();
        this.selectionRef = React.createRef();
        this.physicsRef = React.createRef();
        this.initMouseController();
        this.mouse = { x: 0, y: 0 };
        this.currentHover = null;
        this.state = {
            // clusters to display using force-directed layout
            displayClusters: [],
            camera: null,
            menuX: null,
            menuY: null,
            menuTarget: null
        };
    }
    /**
     * Initializes the callbacks for the MouseController.
     */
    initMouseController() {
        this.mouseController.onMouseLeave = (event) => {
            var _a, _b, _c;
            if (this.infoTimeout != null) {
                clearTimeout(this.infoTimeout);
            }
            (_a = this.particles) === null || _a === void 0 ? void 0 : _a.highlight(null);
            if ((_b = this.props.dataset) === null || _b === void 0 ? void 0 : _b.isSequential) {
                (_c = this.lines) === null || _c === void 0 ? void 0 : _c.highlight([], this.getWidth(), this.getHeight(), this.scene);
            }
            if (this.currentHover) {
                this.currentHover = null;
                this.props.setHoverState(null, UPDATER);
                this.requestRender();
            }
        };
        this.mouseController.onDragStart = (event, button, initial) => {
            switch (button) {
                case 0:
                    // Check if we have dragged from a cluster
                    let cluster = this.chooseCluster(initial);
                    if (cluster) {
                        // Initiate action to let user drag an arrow to other cluster
                        this.clusterDrag = new ClusterDragTool_1.ClusterDragTool(cluster);
                    }
                    else {
                        // Initiate lasso selection
                        let initialWorld = CameraTransformations_1.CameraTransformations.screenToWorld(initial, this.createTransform());
                        this.lasso = new tools_1.LassoSelection();
                        this.lasso.mouseDown(true, initialWorld.x, initialWorld.y);
                    }
                    break;
            }
        };
        this.mouseController.onDragEnd = (event, button) => {
            switch (button) {
                case 0:
                    let coords = CameraTransformations_1.CameraTransformations.screenToWorld({ x: event.offsetX, y: event.offsetY }, this.createTransform());
                    // In case we dragged a cluster... connect them
                    if (this.clusterDrag) {
                        let cluster = this.chooseCluster({ x: event.offsetX, y: event.offsetY });
                        if (cluster) {
                            const activeStory = StoriesDuck_1.StoriesUtil.getActive(this.props.stories);
                            this.props.addEdgeToActive({
                                source: Object.keys(activeStory.clusters.byId).find(key => activeStory.clusters.byId[key] === this.currentHover),
                                destination: Object.keys(activeStory.clusters.byId).find(key => activeStory.clusters.byId[key] === cluster),
                                objectType: ObjectType_1.ObjectTypes.Edge
                            });
                        }
                        this.clusterDrag = null;
                    }
                    // In case we have a lasso, select states
                    if (this.lasso) {
                        // If there is an active lasso, process it
                        var wasDrawing = this.lasso.drawing;
                        this.lasso.mouseUp(coords.x, coords.y);
                        var indices = this.lasso.selection(this.props.dataset.vectors, (vector) => this.particles.isPointVisible(vector));
                        if (indices.length > 0 && wasDrawing && DisplayModeDuck_1.displayModeSupportsStates(this.props.displayMode)) {
                            this.props.selectVectors(indices, event.ctrlKey);
                            this.props.setOpenTab(4);
                        }
                        else if (wasDrawing) {
                            this.clearSelection();
                        }
                        this.lasso = null;
                    }
                    break;
            }
        };
        this.mouseController.onDragMove = (event, button) => {
            var _a;
            switch (button) {
                case 0:
                    let coords = CameraTransformations_1.CameraTransformations.screenToWorld({ x: event.offsetX, y: event.offsetY }, this.createTransform());
                    (_a = this.lasso) === null || _a === void 0 ? void 0 : _a.mouseMove(coords.x, coords.y);
                    break;
                case 2:
                    this.camera.position.x = this.camera.position.x - CameraTransformations_1.CameraTransformations.pixelToWorldCoordinates(event.movementX, this.createTransform());
                    this.camera.position.y = this.camera.position.y + CameraTransformations_1.CameraTransformations.pixelToWorldCoordinates(event.movementY, this.createTransform());
                    this.camera.updateProjectionMatrix();
                    this.props.setViewTransform(this.camera, this.getWidth(), this.getHeight());
                    this.requestRender();
                    break;
            }
        };
        this.mouseController.onContext = (event, button) => {
            switch (button) {
                case 0:
                    if (this.props.activeLine) {
                        break;
                    }
                    if (this.traceSelect) {
                        let target = this.chooseCluster({ x: event.offsetX, y: event.offsetY });
                        if (target) {
                            const activeStory = StoriesDuck_1.StoriesUtil.getActive(this.props.stories);
                            // We want to select a trace between 2 clusters
                            let paths = Book_1.ABook.depthFirstSearch(Book_1.ABook.toGraph(activeStory), Object.entries(activeStory.clusters.byId).find(([key, value]) => value === this.traceSelect.cluster)[0], Object.entries(activeStory.clusters.byId).find(([key, value]) => value === target)[0]);
                            if (paths.length > 0) {
                                let mainPath = paths[0];
                                let mainEdges = mainPath.slice(1).map((item, index) => {
                                    const [resultEdgeKey, _] = Object.entries(activeStory.edges.byId).find(([key, edge]) => edge.source === mainPath[index] && edge.destination === item);
                                    return resultEdgeKey;
                                });
                                this.props.setActiveTrace({
                                    mainPath: mainPath,
                                    mainEdges: mainEdges,
                                    sidePaths: paths.slice(1).map(ids => {
                                        let path = ids;
                                        let edges = path.slice(1).map((item, index) => {
                                            const [resultEdgeKey, _] = Object.entries(activeStory.edges.byId).find(([key, edge]) => edge.source === path[index] && edge.destination === item);
                                            return resultEdgeKey;
                                        });
                                        return {
                                            nodes: path,
                                            edges: edges,
                                            syncNodes: NumTs_1.getSyncNodesAlt(mainPath, path)
                                        };
                                    })
                                });
                            }
                        }
                        this.traceSelect = null;
                    }
                    else if (this.currentHover && Vector_1.isVector(this.currentHover)) {
                        // We click on a hover target
                        this.props.selectVectors([this.currentHover.__meta__.meshIndex], event.ctrlKey);
                    }
                    else if (this.currentHover && Cluster_1.isCluster(this.currentHover)) {
                        const activeStory = this.props.stories.stories[this.props.stories.active];
                        this.props.setSelectedCluster([Object.keys(activeStory.clusters.byId).find(key => activeStory.clusters.byId[key] === this.currentHover)], event.ctrlKey);
                    }
                    break;
                case 2:
                    let cluster = this.chooseCluster({ x: event.offsetX, y: event.offsetY });
                    if (cluster) {
                        this.setState({
                            menuX: event.clientX,
                            menuY: event.clientY,
                            menuTarget: cluster
                        });
                    }
                    else {
                        let edge = this.chooseEdge(this.mouseController.currentMousePosition);
                        if (edge) {
                            this.setState({
                                menuX: event.clientX,
                                menuY: event.clientY,
                                menuTarget: edge
                            });
                        }
                        else {
                            this.setState({
                                menuX: event.clientX,
                                menuY: event.clientY,
                                menuTarget: null
                            });
                        }
                    }
                    break;
            }
        };
        this.mouseController.onMouseUp = (event) => {
        };
        this.mouseController.onMouseMove = (event) => {
            if (this.props.displayMode == DisplayModeDuck_1.DisplayMode.OnlyClusters) {
                return;
            }
            // In case we have a line in the sequence UI
            if (this.props.activeLine) {
                return;
            }
            if (this.infoTimeout != null) {
                clearTimeout(this.infoTimeout);
            }
            this.infoTimeout = setTimeout(() => {
                this.infoTimeout = null;
                let cluster = this.chooseCluster(this.mouseController.currentMousePosition);
                if (cluster) {
                    if (this.currentHover != cluster) {
                        this.currentHover = cluster;
                        this.props.setHoverState(cluster, UPDATER);
                        if (this.props.dataset.isSequential) {
                            this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene);
                        }
                        this.particles.highlight(-1);
                        this.requestRender();
                    }
                }
                else {
                    let coords = CameraTransformations_1.CameraTransformations.screenToWorld(this.mouseController.currentMousePosition, this.createTransform());
                    let edge = this.chooseEdge(this.mouseController.currentMousePosition);
                    if (edge) {
                        if (this.currentHover !== edge) {
                            this.currentHover = edge;
                            this.props.setHoverState(edge, UPDATER);
                        }
                    }
                    else {
                        // Get index of selected node
                        var idx = this.choose(coords);
                        this.particles.highlight(idx);
                        if (this.props.dataset.isSequential) {
                            if (idx >= 0) {
                                this.lines.highlight([this.props.dataset.vectors[idx].line], this.getWidth(), this.getHeight(), this.scene);
                            }
                            else {
                                this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene);
                            }
                        }
                        if (idx >= 0) {
                            if (this.currentHover != this.props.dataset.vectors[idx]) {
                                this.currentHover = this.props.dataset.vectors[idx];
                                this.props.setHoverState(this.props.dataset.vectors[idx], UPDATER);
                                this.requestRender();
                            }
                        }
                        else {
                            if (this.currentHover) {
                                this.currentHover = null;
                                this.props.setHoverState(null, UPDATER);
                                this.requestRender();
                            }
                        }
                    }
                }
            }, 10);
        };
    }
    chooseCluster(screenPosition) {
        let nearest = null;
        let min = Number.MAX_SAFE_INTEGER;
        const activeStory = this.props.stories.stories[this.props.stories.active];
        if (!activeStory) {
            return null;
        }
        for (const [key, cluster] of Object.entries(activeStory.clusters.byId)) {
            let clusterScreen = CameraTransformations_1.CameraTransformations.worldToScreen(new THREE.Vector2(Cluster_1.ACluster.getCenter(this.props.dataset, cluster).x, Cluster_1.ACluster.getCenter(this.props.dataset, cluster).y), this.createTransform());
            let dist = nt.euclideanDistance(screenPosition.x, screenPosition.y, clusterScreen.x, clusterScreen.y);
            if (dist < min && dist < 16) {
                nearest = cluster;
                min = dist;
            }
        }
        return nearest;
    }
    chooseEdge(position) {
        if (this.props.stories.active === null) {
            return null;
        }
        const activeStory = this.props.stories.stories[this.props.stories.active];
        position = CameraTransformations_1.CameraTransformations.screenToWorld(position, this.createTransform());
        for (const edge of Object.values(activeStory.edges.byId)) {
            const a = Cluster_1.ACluster.getCenterAsVector2(this.props.dataset, StoriesDuck_1.StoriesUtil.retrieveCluster(this.props.stories, edge.source));
            const b = Cluster_1.ACluster.getCenterAsVector2(this.props.dataset, StoriesDuck_1.StoriesUtil.retrieveCluster(this.props.stories, edge.destination));
            const dir = b.clone().sub(a.clone()).normalize();
            const l = new THREE.Vector2(-dir.y, dir.x).multiplyScalar(0.5);
            const r = new THREE.Vector2(dir.y, -dir.x).multiplyScalar(0.5);
            let hull = [a.clone().add(l), b.clone().add(l), b.clone().add(r), a.clone().add(r)];
            if (Intersection_1.pointInHull(position, hull)) {
                return edge;
            }
        }
        return null;
    }
    /**
     * Gives the index of the nearest sample.
     *
     * @param position - The position to pick a sample from
     * @returns The index of a sample
     */
    choose(position) {
        var best = 30 / (this.camera.zoom * 2.0);
        var res = -1;
        for (var index = 0; index < this.props.dataset.vectors.length; index++) {
            var value = this.props.dataset.vectors[index];
            // Skip points matching some criteria
            if (!this.particles.isPointVisible(value)) {
                continue;
            }
            var d = nt.euclideanDistance(position.x, position.y, value.x, value.y);
            if (d < best) {
                best = d;
                res = index;
            }
        }
        return res;
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
        };
    }
    componentDidMount() {
        this.initializeContainerEvents();
        this.setupRenderer();
        this.startRendering();
    }
    normaliseMouse(event) {
        var vec = {
            x: (event.clientX / window.innerWidth) * 2 - 1,
            y: -(event.clientY / window.innerHeight) * 2 + 1
        };
        return vec;
    }
    resize(width, height) {
        this.camera.left = width / -2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = height / -2;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        this.props.setViewTransform(this.camera, width, height);
        this.requestRender();
    }
    onKeyDown(event) {
    }
    onMouseLeave(event) {
        event.preventDefault();
        if (this.props.dataset)
            this.mouseController.mouseLeave(event);
    }
    onMouseDown(event) {
        event.preventDefault();
        if (this.props.dataset)
            this.mouseController.mouseDown(event);
    }
    onMouseMove(event) {
        event.preventDefault();
        if (this.props.dataset)
            this.mouseController.mouseMove(event);
    }
    onMouseUp(event) {
        event.preventDefault();
        if (this.props.dataset)
            this.mouseController.mouseUp(event);
    }
    clearSelection() {
        var _a;
        this.lasso = null;
        if (this.props.dataset.isSequential) {
            this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene);
            this.lines.groupHighlight([]);
        }
        else {
            this.particles.groupHighlight([]);
        }
        this.props.dataset.vectors.forEach((vector, index) => {
            vector.__meta__.selected = false;
        });
        this.props.selectVectors([], false);
        (_a = this.particles) === null || _a === void 0 ? void 0 : _a.updateColor();
    }
    onWheel(event) {
        event.preventDefault();
        if (!this.props.dataset) {
            return;
        }
        var normalized = UtilityFunctions_1.normalizeWheel(event);
        // Store world position under mouse
        var bounds = this.containerRef.current.getBoundingClientRect();
        let worldBefore = CameraTransformations_1.CameraTransformations.screenToWorld({ x: event.clientX - bounds.left, y: event.clientY - bounds.top }, this.createTransform());
        var screenBefore = this.relativeMousePosition(event);
        var newZoom = this.camera.zoom - (normalized.pixelY * 0.013) / this.props.dataset.bounds.scaleFactor;
        if (newZoom < 1.0 / this.props.dataset.bounds.scaleFactor) {
            this.camera.zoom = 1.0 / this.props.dataset.bounds.scaleFactor;
        }
        else {
            this.camera.zoom = newZoom;
        }
        // Restore camera position
        this.restoreCamera(worldBefore, screenBefore);
        // Adjust mesh zoom levels
        this.particles.zoom(this.camera.zoom);
        if (this.props.dataset.isSequential) {
            this.lines.setZoom(this.camera.zoom);
        }
        // Update projection matrix
        this.camera.updateProjectionMatrix();
        this.props.setViewTransform(this.camera, this.getWidth(), this.getHeight());
        this.requestRender();
    }
    restoreCamera(world, screen) {
        this.camera.position.x = world.x - ((screen.x - this.getWidth() / 2) / this.camera.zoom);
        this.camera.position.y = (world.y + ((screen.y - this.getHeight() / 2) / this.camera.zoom));
    }
    getWidth() {
        var _a;
        return (_a = this.containerRef.current) === null || _a === void 0 ? void 0 : _a.offsetWidth;
    }
    getHeight() {
        var _a;
        return (_a = this.containerRef.current) === null || _a === void 0 ? void 0 : _a.offsetHeight;
    }
    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.autoClear = true;
        this.renderer.autoClearColor = false;
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.getWidth(), this.getHeight());
        this.renderer.setClearColor(0xf9f9f9, 1);
        this.renderer.sortObjects = false;
        this.camera = new THREE.OrthographicCamera(this.getWidth() / -2, this.getWidth() / 2, this.getHeight() / 2, this.getHeight() / -2, 1, 1000);
        this.camera.position.z = 1;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.updateProjectionMatrix();
        this.containerRef.current.appendChild(this.renderer.domElement);
        this.scene = new THREE.Scene();
        this.props.setViewTransform(this.camera, this.getWidth(), this.getHeight());
        this.prevTime = performance.now();
    }
    createVisualization(dataset, lineColorScheme, vectorColorScheme) {
        var _a;
        this.scene = new THREE.Scene();
        this.pointScene = new THREE.Scene();
        this.segments = dataset.segments;
        this.lineColorScheme = lineColorScheme;
        this.vectorColorScheme = vectorColorScheme;
        // Update camera zoom to fit the problem
        this.camera.zoom = UtilityFunctions_1.getDefaultZoom(this.props.dataset.vectors, this.getWidth(), this.getHeight());
        this.camera.position.x = 0.0;
        this.camera.position.y = 0.0;
        this.camera.updateProjectionMatrix();
        this.setState({
            camera: this.camera
        });
        if (this.props.dataset.isSequential) {
            this.lines = new meshes_1.LineVisualization(this.segments, this.lineColorScheme);
            this.lines.createMesh(this.props.lineBrightness);
            this.lines.setZoom(this.camera.zoom);
            // First add lines, then particles
            this.lines.meshes.forEach(line => this.scene.add(line.line));
        }
        this.particles = new meshes_1.PointVisualization(this.vectorColorScheme, this.props.dataset, window.devicePixelRatio * 8, (_a = this.lines) === null || _a === void 0 ? void 0 : _a.grayedLayerSystem, this.segments);
        this.particles.createMesh(this.props.dataset.vectors, this.segments);
        this.particles.zoom(this.camera.zoom);
        this.particles.update();
        //this.scene.add(this.particles.mesh);
        this.pointScene.add(this.particles.mesh);
    }
    initializeContainerEvents() {
        var container = this.containerRef.current;
        // Remove old listeners
        container.removeEventListener('mousemove', this.mouseMoveListener);
        container.removeEventListener('mousedown', this.mouseDownListener);
        container.removeEventListener('mouseup', this.mouseUpListener);
        container.removeEventListener('keydown', this.keyDownListener);
        container.removeEventListener('wheel', this.wheelListener);
        // Store new listeners
        this.wheelListener = event => this.onWheel(event);
        this.mouseDownListener = event => this.onMouseDown(event);
        this.mouseMoveListener = event => this.onMouseMove(event);
        this.mouseUpListener = event => this.onMouseUp(event);
        this.keyDownListener = event => this.onKeyDown(event);
        // Add new listeners
        container.addEventListener('mousemove', this.mouseMoveListener, false);
        container.addEventListener('mousedown', this.mouseDownListener, false);
        container.addEventListener('mouseup', this.mouseUpListener, false);
        container.addEventListener('keydown', this.keyDownListener);
        container.addEventListener('wheel', this.wheelListener, false);
        // @ts-ignore
        new ResizeObserver(() => {
            this.resize(container.offsetWidth, container.offsetHeight);
        }).observe(container);
    }
    filterLines(algo, show) {
        this.segments.forEach((segment) => {
            if (segment.vectors[0].algo == algo) {
                segment.__meta__.globalVisible = show;
                segment.vectors.forEach((vector) => {
                    vector.__meta__.visible = show;
                });
            }
        });
        this.lines.update();
        this.particles.update();
    }
    /**
     *
     * @param checked
     */
    setLineFilter(checked) {
        this.segments.forEach((segment) => {
            var show = checked[segment.vectors[0].line];
            segment.__meta__.detailVisible = show;
        });
        this.lines.update();
        this.particles.update();
    }
    /**
     * Updates the x,y coordinates of the visualization only. This will also
     * recalculate the optimal camera zoom level.
     */
    updateXY() {
        this.particles.updatePosition();
        if (this.props.dataset.isSequential) {
            this.lines.updatePosition();
        }
        Dataset_1.DatasetUtil.calculateBounds(this.props.dataset);
        this.camera.zoom = UtilityFunctions_1.getDefaultZoom(this.props.dataset.vectors, this.getWidth(), this.getHeight());
        this.camera.position.x = 0.0;
        this.camera.position.y = 0.0;
        this.camera.updateProjectionMatrix();
        this.requestRender();
    }
    /**
     * This functions sets the zoom target for a given set of points.
     * This function only needs to be called once to set the target, the view
     * will then slowly adjust the zoom value and position of the camera depending on
     * the speed value supplied.
     */
    setZoomTarget(vectors, speed) {
        // Store current camera zoom and position for linear interpolation
        this.sourcePosition = this.camera.position.clone();
        this.sourceZoom = this.camera.zoom;
        // Set target position to the center of mass of the vectors
        this.targetPosition = UtilityFunctions_1.centerOfMass(vectors);
        // Set target zoom the bounds in which all points appear
        this.targetZoom = UtilityFunctions_1.generateZoomForSet(vectors, this.getWidth(), this.getHeight());
        // Reset transition time
        this.transitionTime = 0;
    }
    filterPoints(checkboxes) {
        this.particles.showSymbols = checkboxes;
        this.particles.update();
    }
    disposeScene() {
        this.currentHover = null;
        this.setState({
            displayClusters: []
        });
        if (this.lines != null) {
            this.lines.dispose(this.scene);
            this.lines = null;
        }
        if (this.particles != null) {
            this.scene.remove(this.particles.mesh);
            this.particles.dispose();
            this.particles = null;
        }
        if (this.renderer != null) {
            this.renderer.renderLists.dispose();
        }
    }
    /**
     * Starts the render loop
     */
    startRendering() {
        requestAnimationFrame(() => this.startRendering());
        try {
            this.renderLoop();
        }
        catch (_a) { }
    }
    updateZoom(deltaTime) {
        if (this.targetPosition != null && this.targetZoom != null) {
            // Update transition time, maxing at 1
            this.transitionTime = Math.min(this.transitionTime + deltaTime, 1);
            // Update zoom level and position
            this.camera.position.x = UtilityFunctions_1.interpolateLinear(this.sourcePosition.x, this.targetPosition.x, this.transitionTime);
            this.camera.position.y = UtilityFunctions_1.interpolateLinear(this.sourcePosition.y, this.targetPosition.y, this.transitionTime);
            //this.camera.zoom = interpolateLinear(this.sourceZoom, this.targetZoom, this.transitionTime)
            this.camera.updateProjectionMatrix();
            this.requestRender();
            // End transition
            if (this.transitionTime == 1) {
                this.sourcePosition = null;
                this.sourceZoom = null;
                this.targetPosition = null;
                this.targetZoom = null;
                this.transitionTime = 0;
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
        var ctx = this.selectionRef.current.getContext();
        let extended = new RenderingContextEx_1.RenderingContextEx(ctx, window.devicePixelRatio);
        ctx.clearRect(0, 0, this.getWidth(), this.getHeight());
        this.selectionRef.current.setDimensions(this.getWidth() * window.devicePixelRatio, this.getHeight() * window.devicePixelRatio);
        this.renderLasso(ctx);
        if (this.clusterDrag) {
            this.clusterDrag.renderToContext(extended, CameraTransformations_1.CameraTransformations.worldToScreen(Cluster_1.ACluster.getCenter(this.props.dataset, this.clusterDrag.cluster), this.createTransform()), this.mouseController.currentMousePosition);
        }
        if (this.traceSelect) {
            this.traceSelect.viewTransform = this.createTransform();
            this.traceSelect.mousePosition = this.mouseController.currentMousePosition;
            this.traceSelect.renderToContext(extended);
        }
        if (this.props.highlightedSequence != null) {
            this.selectionRef.current.renderHighlightedSequence(ctx, this.props.highlightedSequence);
        }
    }
    onClusterClicked(cluster, shiftKey = false) {
        const activeStory = this.props.stories.stories[this.props.stories.active];
        this.props.setSelectedCluster([Object.keys(activeStory.clusters.byId).find(key => activeStory.clusters.byId[key] === cluster)], shiftKey);
    }
    renderFrame() {
        this.invalidated = false;
        // Calculate delta time
        var nextTime = performance.now();
        var deltaTime = (nextTime - this.lastTime) / 1000;
        this.lastTime = nextTime;
        // Update zoom in case a target has been set
        this.updateZoom(deltaTime);
        try {
            let camera = new THREE.OrthographicCamera(this.getWidth() / -2, this.getWidth() / 2, this.getHeight() / 2, this.getHeight() / -2, 1, 1000);
            camera.lookAt(0, 0, 0);
            camera.position.z = 1;
            camera.position.x = this.camera.position.x * this.camera.zoom;
            camera.position.y = this.camera.position.y * this.camera.zoom;
            camera.updateProjectionMatrix();
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
            if (this.multivariateClusterView.current) {
                this.multivariateClusterView.current.updatePositions(this.camera.zoom);
                this.multivariateClusterView.current.updateArrows(this.camera.zoom, this.props.stories.active);
                this.multivariateClusterView.current.updateTrail(this.camera.zoom);
                if (this.multivariateClusterView.current.scene) {
                    this.renderer.render(this.multivariateClusterView.current.scene, camera);
                }
                if (this.multivariateClusterView.current.scalingScene) {
                    this.renderer.render(this.multivariateClusterView.current.scalingScene, this.camera);
                }
            }
            if (this.pointScene) {
                this.renderer.render(this.pointScene, this.camera);
            }
            if (this.multivariateClusterView.current) {
                if (this.multivariateClusterView.current.clusterScene) {
                    this.renderer.render(this.multivariateClusterView.current.clusterScene, camera);
                }
            }
        }
        catch (e) {
        }
    }
    updateItemClusterDisplay() {
        switch (this.props.displayMode) {
            case DisplayModeDuck_1.DisplayMode.StatesAndClusters:
            case DisplayModeDuck_1.DisplayMode.OnlyStates:
                if (this.props.dataset.isSequential) {
                    this.lines.meshes.forEach(line => {
                        this.scene.remove(line.line);
                        this.scene.add(line.line);
                    });
                }
                this.pointScene.remove(this.particles.mesh);
                this.pointScene.add(this.particles.mesh);
                break;
            case DisplayModeDuck_1.DisplayMode.OnlyClusters:
            case DisplayModeDuck_1.DisplayMode.None:
                if (this.props.dataset.isSequential) {
                    this.lines.meshes.forEach(line => {
                        this.scene.remove(line.line);
                    });
                }
                this.pointScene.remove(this.particles.mesh);
                break;
        }
    }
    componentDidUpdate(prevProps, prevState) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
        if (prevProps.dataset !== this.props.dataset) {
            this.createVisualization(this.props.dataset, colors_1.mappingFromScale(NamedCategoricalScales_1.NamedCategoricalScales.DARK2(), { key: 'algo' }, this.props.dataset), null);
        }
        if (prevProps.pointColorScale != this.props.pointColorScale || prevProps.stories != this.props.stories) {
            if (this.props.channelColor && this.props.pointColorScale) {
                let mapping = colors_1.mappingFromScale(this.props.pointColorScale, this.props.channelColor, this.props.dataset);
                this.props.setPointColorMapping(mapping);
                this.particles.colorCat(this.props.channelColor, mapping);
            }
            else {
                this.props.setPointColorMapping(null);
                (_a = this.particles) === null || _a === void 0 ? void 0 : _a.colorCat(null, null);
            }
        }
        if (prevProps.stories != this.props.stories) {
            if (this.props.stories.active) {
                (_b = this.particles) === null || _b === void 0 ? void 0 : _b.storyTelling(this.props.stories);
                (_c = this.lines) === null || _c === void 0 ? void 0 : _c.storyTelling(this.props.stories);
                (_d = this.lines) === null || _d === void 0 ? void 0 : _d.update();
                (_e = this.particles) === null || _e === void 0 ? void 0 : _e.update();
                (_f = this.particles) === null || _f === void 0 ? void 0 : _f.updateColor();
            }
            else {
                (_g = this.particles) === null || _g === void 0 ? void 0 : _g.storyTelling(null);
                (_h = this.lines) === null || _h === void 0 ? void 0 : _h.storyTelling(this.props.stories);
                (_j = this.lines) === null || _j === void 0 ? void 0 : _j.update();
                (_k = this.particles) === null || _k === void 0 ? void 0 : _k.update();
                (_l = this.particles) === null || _l === void 0 ? void 0 : _l.updateColor();
            }
        }
        if (prevProps.globalPointSize != this.props.globalPointSize && this.particles) {
            this.particles.sizeCat(this.props.channelSize, this.props.globalPointSize);
            this.particles.updateSize();
        }
        if (prevProps.globalPointBrightness != this.props.globalPointBrightness && this.particles) {
            this.particles.transparencyCat(this.props.channelBrightness, this.props.globalPointBrightness);
            this.particles.updateColor();
            this.particles.update();
        }
        if (prevProps.lineBrightness != this.props.lineBrightness) {
            (_m = this.lines) === null || _m === void 0 ? void 0 : _m.setBrightness(this.props.lineBrightness);
        }
        if (prevProps.displayMode != this.props.displayMode) {
            this.updateItemClusterDisplay();
        }
        if (!UtilityFunctions_1.arraysEqual(prevProps.currentAggregation.aggregation, this.props.currentAggregation.aggregation)) {
            const vectorSelection = this.props.currentAggregation.aggregation.map(i => this.props.dataset.vectors[i]);
            if (this.props.dataset.isSequential) {
                var uniqueIndices = [...new Set(vectorSelection.map(vector => vector.line))];
                this.lines.groupHighlight(uniqueIndices);
            }
            else {
                this.particles.groupHighlight(this.props.currentAggregation.aggregation);
            }
            this.props.dataset.vectors.forEach(sample => sample.__meta__.selected = false);
            vectorSelection.forEach(sample => {
                sample.__meta__.selected = true;
            });
            this.particles.update();
            this.particles.updateColor();
        }
        if (prevProps.hoverState !== this.props.hoverState) {
            const hover_item = this.props.hoverState.data;
            if (Vector_1.isVector(hover_item)) {
                let idx = hover_item.__meta__.meshIndex;
                this.particles.highlight(idx);
                if (this.props.dataset.isSequential) {
                    if (idx >= 0) {
                        this.lines.highlight([this.props.dataset.vectors[idx].line], this.getWidth(), this.getHeight(), this.scene);
                    }
                    else {
                        this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene);
                    }
                }
                if (idx >= 0) {
                    if (this.currentHover != this.props.dataset.vectors[idx]) {
                        this.currentHover = this.props.dataset.vectors[idx];
                        this.requestRender();
                    }
                }
                else {
                    if (this.currentHover) {
                        this.currentHover = null;
                        this.requestRender();
                    }
                }
            }
        }
        // Path length range has changed, update view accordingly
        if (this.props.dataset && this.props.dataset.isSequential && prevProps.pathLengthRange !== this.props.pathLengthRange) {
            // Set path length range on all segment views, and update them
            this.lines.pathLengthRange = this.props.pathLengthRange.range;
            this.particles.pathLengthRange = this.props.pathLengthRange.range;
            this.lines.update();
            this.particles.update();
            this.particles.updateColor();
        }
        if (prevProps.vectorByShape != this.props.vectorByShape && this.particles) {
            this.filterPoints({ 'star': true, 'cross': true, 'circle': true, 'square': true });
            this.particles.shapeCat(this.props.vectorByShape);
        }
        if (prevProps.checkedShapes != this.props.checkedShapes && this.particles) {
            this.filterPoints(this.props.checkedShapes);
        }
        if (prevProps.activeLine != this.props.activeLine) {
            if (this.props.activeLine != null) {
                this.lines.highlight([this.props.activeLine], this.getWidth(), this.getHeight(), this.scene, true);
            }
            else {
                this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene, true);
                this.particles.update();
                this.particles.updateColor();
            }
        }
        if (prevProps.advancedColoringSelection != this.props.advancedColoringSelection && this.particles) {
            this.particles.colorFilter(this.props.advancedColoringSelection);
        }
        this.requestRender();
    }
    requestRender() {
        if (this.invalidated) {
            return;
        }
        this.invalidated = true;
        requestAnimationFrame(() => this.renderFrame());
    }
    createTransform() {
        return {
            camera: this.camera,
            width: this.getWidth(),
            height: this.getHeight()
        };
    }
    renderLasso(ctx) {
        if (this.lasso == null)
            return;
        var points = this.lasso.points;
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
            point = CameraTransformations_1.CameraTransformations.worldToScreen(point, this.createTransform());
            if (index == 0) {
                ctx.moveTo(point.x * window.devicePixelRatio, point.y * window.devicePixelRatio);
            }
            else {
                ctx.lineTo(point.x * window.devicePixelRatio, point.y * window.devicePixelRatio);
            }
        }
        if (!this.lasso.drawing) {
            var conv = CameraTransformations_1.CameraTransformations.worldToScreen(points[0], this.createTransform());
            ctx.lineTo(conv.x * window.devicePixelRatio, conv.y * window.devicePixelRatio);
        }
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    repositionClusters() {
        var _a, _b, _c;
        (_a = this.multivariateClusterView) === null || _a === void 0 ? void 0 : _a.current.updatePositions(this.camera.zoom);
        (_b = this.multivariateClusterView) === null || _b === void 0 ? void 0 : _b.current.iterateTrail(this.camera.zoom);
        (_c = this.multivariateClusterView) === null || _c === void 0 ? void 0 : _c.current.createTriangulatedMesh();
    }
    loadProjection(projection) {
        this.props.dataset.vectors.forEach(vector => {
            let position = projection.positions[vector.__meta__.meshIndex];
            vector.x = position.x;
            vector.y = position.y;
        });
        this.updateXY();
    }
    onClusterZoom(cluster) {
        this.props.setSelectedCluster(cluster, false);
    }
    render() {
        const handleClose = () => {
            this.setState({
                menuX: null,
                menuY: null
            });
        };
        return React.createElement("div", { onContextMenu: (event) => { event.preventDefault(); }, onMouseLeave: (event) => { this.onMouseLeave(event); }, style: {
                width: '100%',
                height: '100%',
                overflow: "hidden",
                position: "relative"
            } },
            React.createElement("div", { id: "container", style: {
                    position: "absolute",
                    top: "0px",
                    left: "0px",
                    width: "100%",
                    height: "100%"
                }, ref: this.containerRef, tabIndex: 0 }),
            React.createElement(LassoLayer_1.LassoLayer, { ref: this.selectionRef }),
            React.createElement(MultivariateClustering_1.MultivariateClustering, { onInvalidate: () => { this.requestRender(); }, ref: this.multivariateClusterView }),
            React.createElement(material_1.Menu, { keepMounted: true, open: this.state.menuY !== null && !this.state.menuTarget, onClose: handleClose, anchorReference: "anchorPosition", anchorPosition: this.state.menuY !== null && this.state.menuX !== null
                    ? { top: this.state.menuY, left: this.state.menuX }
                    : undefined },
                React.createElement(material_1.MenuItem, { onClick: () => {
                        if (this.props.currentAggregation.aggregation.length > 0) {
                            let cluster = Cluster_1.ACluster.fromSamples(this.props.dataset, this.props.currentAggregation.aggregation);
                            if (this.props.stories.active === null) {
                                const handle = uuid_1.v4();
                                const story = {
                                    clusters: {
                                        byId: {
                                            [handle]: cluster
                                        },
                                        allIds: [handle]
                                    },
                                    edges: {
                                        byId: {},
                                        allIds: []
                                    }
                                };
                                this.props.addStory(story, true);
                            }
                            else {
                                this.props.addClusterToStory(cluster);
                            }
                        }
                        handleClose();
                    } }, "Create Group from Selection"),
                React.createElement(material_1.MenuItem, { onClick: () => {
                        var coords = CameraTransformations_1.CameraTransformations.screenToWorld({ x: this.mouseController.currentMousePosition.x, y: this.mouseController.currentMousePosition.y }, this.createTransform());
                        if (this.props.displayMode == DisplayModeDuck_1.DisplayMode.OnlyClusters) {
                            return;
                        }
                        var idx = this.choose(coords);
                        if (idx >= 0) {
                            var vector = this.props.dataset.vectors[idx];
                            this.props.setActiveLine(vector.line);
                        }
                    } }, "Investigate Line")),
            React.createElement(material_1.Menu, { keepMounted: true, open: this.state.menuY !== null && Cluster_1.isCluster(this.state.menuTarget), onClose: handleClose, anchorReference: "anchorPosition", anchorPosition: this.state.menuY !== null && this.state.menuX !== null
                    ? { top: this.state.menuY, left: this.state.menuX }
                    : undefined },
                React.createElement(material_1.MenuItem, { onClick: () => {
                        if (Cluster_1.isCluster(this.state.menuTarget)) {
                            this.props.removeClusterFromStories(this.state.menuTarget);
                        }
                        handleClose();
                    } }, 'Delete Group'),
                React.createElement(material_1.MenuItem, { onClick: () => {
                        if (!Cluster_1.isCluster(this.state.menuTarget)) {
                            handleClose();
                            return;
                        }
                        const activeStory = this.props.stories.stories[this.props.stories.active];
                        let paths = Book_1.ABook.getAllStoriesFromSource(activeStory, Object.entries(activeStory.clusters.byId).find(([key, val]) => val === this.state.menuTarget)[0]);
                        if (paths.length > 0) {
                            let mainPath = paths[0];
                            let mainEdges = mainPath.slice(1).map((item, index) => {
                                const [resultEdgeKey, _] = Object.entries(activeStory.edges.byId).find(([key, edge]) => edge.source === mainPath[index] && edge.destination === item);
                                return resultEdgeKey;
                            });
                            this.props.setActiveTrace({
                                mainPath: mainPath,
                                mainEdges: mainEdges,
                                sidePaths: paths.slice(1).map(ids => {
                                    let path = ids;
                                    let edges = path.slice(1).map((item, index) => {
                                        const [resultEdgeKey, _] = Object.entries(activeStory.edges.byId).find(([key, edge]) => edge.source === path[index] && edge.destination === item);
                                        return resultEdgeKey;
                                    });
                                    return {
                                        nodes: path,
                                        edges: edges,
                                        syncNodes: NumTs_1.getSyncNodesAlt(mainPath, path)
                                    };
                                })
                            });
                        }
                        handleClose();
                    } }, "Stories ... Starting from this Group"),
                React.createElement(material_1.MenuItem, { onClick: () => {
                        if (!Cluster_1.isCluster(this.state.menuTarget)) {
                            handleClose();
                            return;
                        }
                        this.traceSelect = new TraceSelectTool_1.TraceSelectTool(this.props.dataset, this.state.menuTarget);
                        handleClose();
                    } }, "Stories ... Between 2 Groups")),
            React.createElement(material_1.Menu, { keepMounted: true, open: this.state.menuY !== null && Edge_1.isEdge(this.state.menuTarget), onClose: handleClose, anchorReference: "anchorPosition", anchorPosition: this.state.menuY !== null && this.state.menuX !== null
                    ? { top: this.state.menuY, left: this.state.menuX }
                    : undefined },
                React.createElement(material_1.MenuItem, { onClick: () => {
                        this.props.removeEdgeFromActive(this.state.menuTarget);
                        handleClose();
                    } }, 'Delete Edge')));
    }
});
