"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const three_1 = require("three");
const Cluster_1 = require("../../model/Cluster");
const THREE = require("three");
const DisplayModeDuck_1 = require("../Ducks/DisplayModeDuck");
const React = require("react");
const react_redux_1 = require("react-redux");
const NamedCategoricalScales_1 = require("../Utility/Colors/NamedCategoricalScales");
const TrailVisualization_1 = require("./TrailVisualization");
const material_1 = require("@mui/material");
const CameraTransformations_1 = require("./CameraTransformations");
const nt = require("../NumTs/NumTs");
const d3v5 = require("d3v5");
const GroupVisualizationMode_1 = require("../Ducks/GroupVisualizationMode");
const ContinuosScale_1 = require("../Utility/Colors/ContinuosScale");
const StoriesDuck_1 = require("../Ducks/StoriesDuck");
const tessy_worker_1 = require("../workers/tessy.worker");
const SELECTED_COLOR = 0x007dad;
const DEFAULT_COLOR = 0x808080;
const GRAYED = 0xDCDCDC;
const WING_SIZE = 2.2;
const LINE_WIDTH = 1.5;
const CLUSTER_PIXEL_SIZE = 12;
const mapState = (state) => ({
    dataset: state.dataset,
    displayMode: state.displayMode,
    trailSettings: state.trailSettings,
    stories: state.stories,
    globalPointSize: state.globalPointSize,
    viewTransform: state.viewTransform,
    currentAggregation: state.currentAggregation,
    hoverState: state.hoverState,
    groupVisualizationMode: state.groupVisualizationMode
});
const connector = react_redux_1.connect(mapState, null, null, { forwardRef: true });
/**
 * Clustering visualization as a React component.
 */
exports.MultivariateClustering = connector(class extends React.Component {
    constructor(props) {
        super(props);
        this.clusterObjects = [];
        this.devicePixelRatio = window.devicePixelRatio;
        this.scalingScene = new THREE.Scene();
        this.scene = new THREE.Scene();
        this.clusterScene = new THREE.Scene();
        let arrowMateral = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, vertexColors: true });
        arrowMateral.opacity = 0.8;
        arrowMateral.transparent = true;
        this.arrowMesh = new THREE.Mesh(new THREE.Geometry(), arrowMateral);
        this.scene.add(this.arrowMesh);
        this.trailMesh = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, vertexColors: true }));
        this.scene.add(this.trailMesh);
        this.trail = new TrailVisualization_1.TrailVisualization();
        this.trail.create(this.clusterObjects);
        this.scene.add(this.trail.mesh);
        this.triangulationWorker = new tessy_worker_1.default();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.trailSettings != this.props.trailSettings) {
            this.trail.setVisible(this.props.trailSettings.show);
            this.trail.setLength(this.props.trailSettings.length);
        }
        // If we have clusters now... and are on clusters tab... create cluster visualization
        if (prevProps.stories != this.props.stories) {
            this.destroy();
            this.disposeTriangulatedMesh();
            if (this.props.stories.active !== null) {
                const activeStory = this.props.stories.stories[this.props.stories.active];
                if (activeStory.clusters.allIds.length > 0) {
                    this.create();
                    this.createTriangulatedMesh();
                }
            }
        }
        if (prevProps.displayMode != this.props.displayMode) {
            switch (this.props.displayMode) {
                case DisplayModeDuck_1.DisplayMode.StatesAndClusters:
                    this.highlightCluster(this.props.currentAggregation.selectedClusters);
                    this.clusterScene.visible = true;
                    this.scalingScene.visible = true;
                    this.scene.visible = true;
                    break;
                case DisplayModeDuck_1.DisplayMode.OnlyClusters:
                    this.clusterScene.visible = true;
                    this.scalingScene.visible = true;
                    this.scene.visible = true;
                    this.clusterObjects.forEach(clusterObject => {
                        clusterObject.children.forEach(child => {
                            child.visible = false;
                        });
                    });
                    break;
                case DisplayModeDuck_1.DisplayMode.OnlyStates:
                case DisplayModeDuck_1.DisplayMode.None:
                    this.clusterScene.visible = false;
                    this.scalingScene.visible = false;
                    this.scene.visible = false;
                    break;
            }
        }
        if (prevProps.currentAggregation != this.props.currentAggregation || prevProps.groupVisualizationMode != this.props.groupVisualizationMode) {
            this.deactivateAll();
            if (this.props.currentAggregation.source == 'sample') {
                this.highlightSamples(this.props.currentAggregation.aggregation.map(i => this.props.dataset.vectors[i]));
            }
            // if the hoverCluster state changed and its a multivariate cluster, we need to enable the three js scene part
            if (this.props.currentAggregation.source == 'cluster') {
                this.highlightCluster(this.props.currentAggregation.selectedClusters);
            }
        }
        if (this.props.onInvalidate) {
            this.props.onInvalidate();
        }
    }
    updateArrows(zoom) {
        if (!this.arrowMesh) {
            return;
        }
        this.arrowMesh.visible = true;
        this.arrowMesh.geometry.dispose();
        let arrowGeometry = new THREE.Geometry();
        arrowGeometry.vertices = [];
        arrowGeometry.faces = [];
        let index = 0;
        const activeStory = this.props.stories.stories[this.props.stories.active];
        if (activeStory) {
            for (const [key, edge] of Object.entries(activeStory.edges.byId)) {
                let color = new THREE.Color(DEFAULT_COLOR);
                if (this.props.stories.trace && this.props.stories.trace.mainEdges.includes(key)) {
                    color = new THREE.Color(SELECTED_COLOR);
                }
                const sourceCenter = Cluster_1.ACluster.getCenter(this.props.dataset, StoriesDuck_1.StoriesUtil.retrieveCluster(this.props.stories, edge.source));
                const destCenter = Cluster_1.ACluster.getCenter(this.props.dataset, StoriesDuck_1.StoriesUtil.retrieveCluster(this.props.stories, edge.destination));
                let start = new THREE.Vector2(sourceCenter.x, sourceCenter.y);
                let end = new THREE.Vector2(destCenter.x, destCenter.y);
                let middle = new THREE.Vector2().addVectors(start, new THREE.Vector2().subVectors(end, start).multiplyScalar(0.5));
                let dir = end.clone().sub(start).normalize();
                let markerOffset = start.clone().sub(end).normalize().multiplyScalar(24);
                let left = new three_1.Vector2(-dir.y, dir.x).multiplyScalar(LINE_WIDTH);
                let right = new three_1.Vector2(dir.y, -dir.x).multiplyScalar(LINE_WIDTH);
                let offset = dir.clone().multiplyScalar(this.devicePixelRatio * CLUSTER_PIXEL_SIZE);
                // line without arrow
                arrowGeometry.vertices.push(new THREE.Vector3(start.x * zoom + left.x + offset.x, start.y * zoom + left.y + offset.y, 0));
                arrowGeometry.vertices.push(new THREE.Vector3(start.x * zoom + right.x + offset.x, start.y * zoom + right.y + offset.y, 0));
                arrowGeometry.vertices.push(new THREE.Vector3(end.x * zoom + left.x - offset.x, end.y * zoom + left.y - offset.y, 0));
                arrowGeometry.vertices.push(new THREE.Vector3(end.x * zoom + right.x - offset.x, end.y * zoom + right.y - offset.y, 0));
                // left wing
                arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + left.x - offset.x, middle.y * zoom + left.y - offset.y, 0));
                arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + left.x + offset.x, middle.y * zoom + left.y + offset.y, 0));
                arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + left.x * WING_SIZE - offset.x, middle.y * zoom + left.y * WING_SIZE - offset.y, 0));
                // Right wing
                arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + right.x - offset.x, middle.y * zoom + right.y - offset.y, 0));
                arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + right.x + offset.x, middle.y * zoom + right.y + offset.y, 0));
                arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + right.x * WING_SIZE - offset.x, middle.y * zoom + right.y * WING_SIZE - offset.y, 0));
                let i = index * 10;
                // line without arrow
                arrowGeometry.faces.push(new THREE.Face3(i, i + 1, i + 2, new three_1.Vector3(0, 0, -1), color));
                arrowGeometry.faces.push(new THREE.Face3(i + 1, i + 3, i + 2, new three_1.Vector3(0, 0, -1), color));
                // left wing
                arrowGeometry.faces.push(new THREE.Face3(i + 4, i + 6, i + 5, new three_1.Vector3(0, 0, -1), color));
                // Right wing
                arrowGeometry.faces.push(new THREE.Face3(i + 7, i + 9, i + 8, new three_1.Vector3(0, 0, -1), color));
                index = index + 1;
            }
        }
        this.arrowMesh.geometry = arrowGeometry;
    }
    /**
     * Updates geometry of the trail mesh.
     */
    updateTrail(zoom) {
        this.trail.update(this.clusterObjects, zoom);
    }
    iterateTrail(zoom) {
        const activeStory = this.props.stories.stories[this.props.stories.active];
        this.clusterObjects.forEach(clusterObject => {
            let center = Cluster_1.ACluster.getCenter(this.props.dataset, activeStory.clusters.byId[clusterObject.cluster]);
            let last = clusterObject.trailPositions[clusterObject.trailPositions.length - 1];
            if (!last || new THREE.Vector3(center.x, center.y, 0).distanceTo(last) > 0.1) {
                let positions = clusterObject.trailPositions;
                if (positions.length > this.props.trailSettings.length) {
                    let rem = clusterObject.trailPositions.shift();
                }
                positions.push(new THREE.Vector3(center.x, center.y, 0));
            }
        });
    }
    updatePositions(zoom) {
        if (!this.scene || !this.lineMesh) {
            return;
        }
        this.lineMesh.geometry.dispose();
        let lineGeometry = new THREE.Geometry();
        lineGeometry.vertices = [];
        lineGeometry.faces = [];
        lineGeometry.colors = [];
        let index = 0;
        const activeStory = this.props.stories.stories[this.props.stories.active];
        this.clusterObjects.forEach(clusterObject => {
            let cluster = clusterObject.cluster;
            let center = Cluster_1.ACluster.getCenter(this.props.dataset, activeStory.clusters.byId[cluster]);
            let mesh = clusterObject.mesh;
            mesh.position.set(center.x * zoom, center.y * zoom, -0.5);
            mesh.material.color = this.getColorForClusterObject(clusterObject);
            mesh.scale.set(this.props.globalPointSize[0], this.props.globalPointSize[0], this.props.globalPointSize[0]);
            clusterObject.children.forEach(child => {
                if (child.visible && this.props.displayMode == DisplayModeDuck_1.DisplayMode.StatesAndClusters) {
                    let sample = child.sample;
                    let dir = new THREE.Vector2(child.sample.x - center.x, child.sample.y - center.y).normalize();
                    let rigth = new three_1.Vector2(dir.y, -dir.x).multiplyScalar(this.devicePixelRatio);
                    let left = new three_1.Vector2(-dir.y, dir.x).multiplyScalar(this.devicePixelRatio);
                    lineGeometry.vertices.push(new THREE.Vector3(center.x * zoom + left.x, center.y * zoom + left.y, 0));
                    lineGeometry.vertices.push(new THREE.Vector3(center.x * zoom + rigth.x, center.y * zoom + rigth.y, 0));
                    lineGeometry.vertices.push(new THREE.Vector3(sample.x * zoom + left.x, sample.y * zoom + left.y, 0));
                    lineGeometry.vertices.push(new THREE.Vector3(sample.x * zoom + rigth.x, sample.y * zoom + rigth.y, 0));
                    let i = index * 4;
                    lineGeometry.faces.push(new THREE.Face3(i, i + 1, i + 2, new three_1.Vector3(0, 0, -1), new THREE.Color(clusterObject.lineColor.hex)));
                    lineGeometry.faces.push(new THREE.Face3(i + 1, i + 3, i + 2, new three_1.Vector3(0, 0, -1), new THREE.Color(clusterObject.lineColor.hex)));
                    index = index + 1;
                }
            });
        });
        this.lineMesh.geometry = lineGeometry;
    }
    getColorForClusterObject(clusterObject) {
        var _a;
        if (this.props.currentAggregation.selectedClusters.includes(clusterObject.cluster) || clusterObject.sampleConnection) {
            return new THREE.Color(SELECTED_COLOR);
        }
        const activeStory = this.props.stories.stories[this.props.stories.active];
        if ((_a = activeStory === null || activeStory === void 0 ? void 0 : activeStory.clusters) === null || _a === void 0 ? void 0 : _a.allIds.includes(clusterObject.cluster)) {
            return new THREE.Color(DEFAULT_COLOR);
        }
        else {
            return new THREE.Color(GRAYED);
        }
    }
    /**
     * Creates the visualization.
     */
    create() {
        this.clusterObjects = [];
        let lineMateral = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, vertexColors: true });
        lineMateral.opacity = 0.5;
        lineMateral.transparent = true;
        let lineGeometry = new THREE.Geometry();
        this.lineMesh = new THREE.Mesh(lineGeometry, lineMateral);
        this.lineMesh.position.set(0, 0, -1);
        this.scene.add(this.lineMesh);
        let scale = NamedCategoricalScales_1.NamedCategoricalScales.DARK2();
        const activeStory = this.props.stories.stories[this.props.stories.active];
        let scaleI = 0;
        for (const [ci, cluster] of Object.entries(activeStory.clusters.byId)) {
            // Add circle to scene
            var geometry = new THREE.PlaneGeometry(this.devicePixelRatio * CLUSTER_PIXEL_SIZE, this.devicePixelRatio * CLUSTER_PIXEL_SIZE);
            geometry.rotateZ(Math.PI / 4);
            geometry.scale(0.85, 1.0, 1.0);
            var material = new THREE.MeshBasicMaterial({ color: new THREE.Color(DEFAULT_COLOR) });
            var circle = new THREE.Mesh(geometry, material);
            material.opacity = 0.92;
            material.transparent = true;
            var center = Cluster_1.ACluster.getCenter(this.props.dataset, cluster);
            circle.position.set(center.x, center.y, 0);
            this.clusterScene.add(circle);
            var clusterObject = {
                cluster: ci,
                geometry: geometry,
                material: material,
                mesh: circle,
                children: [],
                trailPositions: [],
                lineColor: ContinuosScale_1.ScaleUtil.mapScale(scale, scaleI),
                triangulatedMesh: {},
                sampleConnection: false
            };
            material.color = this.getColorForClusterObject(clusterObject);
            this.clusterObjects.push(clusterObject);
            // Create line geometry
            cluster.indices.map(i => this.props.dataset.vectors[i]).forEach(vector => {
                clusterObject.children.push({
                    sample: vector,
                    visible: false
                });
            });
            scaleI = scaleI + 1;
        }
    }
    // Activates the lines from given samples to their corresponding clusters
    highlightSamples(samples) {
        // Deactivate all lines
        this.deactivateAll();
        const activeStory = this.props.stories.stories[this.props.stories.active];
        this.clusterObjects.forEach(clusterObject => {
            clusterObject.material.color = new THREE.Color(DEFAULT_COLOR);
        });
        samples.forEach(sample => {
            sample.groupLabel.forEach(label => {
                let clusterObject = this.clusterObjects.find(e => activeStory.clusters.byId[e.cluster].label == label);
                if (clusterObject && this.props.groupVisualizationMode == GroupVisualizationMode_1.GroupVisualizationMode.StarVisualization) {
                    clusterObject.sampleConnection = true;
                    clusterObject.children.forEach(child => {
                        if (child.sample == sample) {
                            child.visible = true;
                        }
                    });
                }
            });
        });
    }
    deactivateAll() {
        var _a;
        this.clusterObjects.forEach(clusterObject => {
            clusterObject.sampleConnection = false;
            clusterObject.material.color = this.getColorForClusterObject(clusterObject);
            clusterObject.children.forEach(child => {
                child.visible = false;
            });
        });
        if (this.clusterVis) {
            this.clusterVis.lineMeshes.forEach(mesh => {
                mesh.visible = false;
            });
            (_a = this.clusterVis.clusterMeshes) === null || _a === void 0 ? void 0 : _a.forEach(mesh => {
                mesh.visible = false;
            });
        }
    }
    highlightCluster(indices) {
        this.clusterObjects.forEach((clusterObject, index) => {
            var visible = indices === null || indices === void 0 ? void 0 : indices.includes(clusterObject.cluster); // for paper used: true
            clusterObject.material.color = visible ? new THREE.Color(SELECTED_COLOR) : new THREE.Color(DEFAULT_COLOR);
            if (this.props.groupVisualizationMode == GroupVisualizationMode_1.GroupVisualizationMode.StarVisualization) {
                clusterObject.children.forEach(child => {
                    child.visible = visible;
                });
            }
            if (this.clusterVis && this.props.groupVisualizationMode == GroupVisualizationMode_1.GroupVisualizationMode.ConvexHull) {
                this.clusterVis.clusterMeshes[index].visible = visible;
                this.clusterVis.lineMeshes[index].visible = visible;
            }
        });
    }
    /**
     * Destroys the visualization.
     */
    destroy() {
        if (this.clusterObjects && this.clusterObjects.length > 0) {
            this.clusterObjects.forEach(clusterObject => {
                this.clusterScene.remove(clusterObject.mesh);
                clusterObject.geometry.dispose();
                clusterObject.material.dispose();
            });
            this.clusterObjects = [];
        }
        if (this.lineMesh) {
            this.scene.remove(this.lineMesh);
            let lineMaterial = this.lineMesh.material;
            this.lineMesh.geometry.dispose();
            lineMaterial.dispose();
        }
    }
    /**
     * Creates the triangulated mesh that visualizes the clustering.
     * @param clusters an array of clusters
     */
    createTriangulatedMesh() {
        this.disposeTriangulatedMesh();
        if (this.props.groupVisualizationMode != GroupVisualizationMode_1.GroupVisualizationMode.ConvexHull) {
            return;
        }
        var clusterMeshes = [];
        var lineMeshes = [];
        if (this.props.stories.active !== null) {
            const activeStory = this.props.stories.stories[this.props.stories.active];
            for (const [ci, cluster] of Object.entries(activeStory.clusters.byId)) {
                const bounds = Cluster_1.ACluster.calcBounds(this.props.dataset, cluster.indices);
                let xAxis = d3v5.scaleLinear()
                    .range([0, 100])
                    .domain([bounds.left, bounds.right]);
                let yAxis = d3v5.scaleLinear()
                    .range([0, 100 * (bounds.height / bounds.width)])
                    .domain([bounds.top, bounds.bottom]);
                let contours = d3v5.contourDensity()
                    .x(d => xAxis(d.x))
                    .y(d => yAxis(d.y))
                    .bandwidth(10)
                    .thresholds(10)
                    .size([100, bounds.width == 0 ? 1 : Math.floor(100 * (bounds.height / bounds.width))])(cluster.indices.map(i => this.props.dataset.vectors[i]).map(vect => ({ x: vect.x, y: vect.y })));
                let clusterObject = this.clusterObjects.find(e => activeStory.clusters.byId[e.cluster].label == cluster.label);
                let material = new THREE.LineBasicMaterial({ color: clusterObject.lineColor.hex });
                const points = [];
                contours.forEach(contour => {
                    const coordinates = contour.coordinates[0][0];
                    for (let i = 0; i < coordinates.length - 1; i++) {
                        let cur = coordinates[i];
                        let next = coordinates[i + 1];
                        points.push(new THREE.Vector3(xAxis.invert(cur[0]), yAxis.invert(cur[1]), -5));
                        points.push(new THREE.Vector3(xAxis.invert(next[0]), yAxis.invert(next[1]), -5));
                    }
                });
                let line = new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(points), material);
                line.visible = false;
                this.scalingScene.add(line);
                lineMeshes.push(line);
                clusterMeshes.push(line);
            }
        }
        this.clusterVis = { clusterMeshes: clusterMeshes, lineMeshes: lineMeshes };
    }
    /**
     * Destroys the triangulated view of the clusters.
     */
    disposeTriangulatedMesh() {
        if (this.clusterVis != null) {
            const { clusterMeshes, lineMeshes } = this.clusterVis;
            clusterMeshes === null || clusterMeshes === void 0 ? void 0 : clusterMeshes.forEach(mesh => {
                mesh.geometry.dispose();
                mesh.material.dispose();
                this.scalingScene.remove(mesh);
            });
            lineMeshes === null || lineMeshes === void 0 ? void 0 : lineMeshes.forEach(mesh => {
                mesh.geometry.dispose();
                mesh.material.dispose();
                this.scalingScene.remove(mesh);
            });
            this.clusterVis = null;
        }
    }
    /**
     * Creates textual representations of the edges of the story.
     */
    createStreetLabels(story) {
        if (!story) {
            return [];
        }
        let labels = [];
        Object.values(story.edges.byId).filter(edge => edge.name && edge.name != "").map(edge => {
            let source = CameraTransformations_1.CameraTransformations.worldToScreen(Cluster_1.ACluster.getCenter(this.props.dataset, StoriesDuck_1.StoriesUtil.retrieveCluster(this.props.stories, edge.source)), this.props.viewTransform);
            let dest = CameraTransformations_1.CameraTransformations.worldToScreen(Cluster_1.ACluster.getCenter(this.props.dataset, StoriesDuck_1.StoriesUtil.retrieveCluster(this.props.stories, edge.destination)), this.props.viewTransform);
            let angle = new nt.VectBase(dest.x - source.x, dest.y - source.y).angle();
            if (angle > Math.PI * 0.5 && angle < Math.PI * 1.5) {
                angle = angle - Math.PI;
            }
            // Only display edge name if it can fit inside the viewport
            if (nt.euclideanDistanceVec(source, dest) > edge.name.length * 10) {
                labels.push(React.createElement(material_1.Typography, { style: {
                        position: 'absolute',
                        left: (source.x + dest.x) / 2,
                        top: (source.y + dest.y) / 2,
                        background: 'transparent',
                        color: 'black',
                        transform: `translate(-50%, 0px) rotateZ(${angle}rad) translate(0, -25px)`,
                        pointerEvents: 'none'
                    } }, edge.name));
            }
        });
        return labels;
    }
    /**
     * Render an empty div, so componentDidMount will get called.
     */
    render() {
        const activeStory = this.props.stories.stories[this.props.stories.active];
        return React.createElement("div", null,
            this.props.stories.active && this.createStreetLabels(activeStory),
            this.props.hoverState.data && Cluster_1.isCluster(this.props.hoverState.data)
                && this.props.hoverState.data.name && hoverLabel(this.props.hoverState.data, this.props.viewTransform, this.props.dataset),
            this.props.stories.trace && this.props.stories.trace.mainPath.map((cluster, index) => {
                let clusterInstance = StoriesDuck_1.StoriesUtil.retrieveCluster(this.props.stories, cluster);
                let screen = CameraTransformations_1.CameraTransformations.worldToScreen(Cluster_1.ACluster.getCenter(this.props.dataset, clusterInstance), this.props.viewTransform);
                return React.createElement(material_1.Typography, { style: {
                        textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
                        position: 'absolute',
                        left: screen.x,
                        top: screen.y,
                        background: 'transparent',
                        color: 'black',
                        fontWeight: "bold",
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none'
                    } }, clusterInstance.label);
            }));
    }
});
const hoverLabel = (hoverState, viewTransform, dataset) => {
    let screen = CameraTransformations_1.CameraTransformations.worldToScreen(Cluster_1.ACluster.getCenter(dataset, hoverState), viewTransform);
    return React.createElement(material_1.Typography, { style: {
            textShadow: '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white',
            position: 'absolute',
            left: screen.x,
            top: screen.y,
            background: 'transparent',
            color: 'black',
            fontWeight: "bold",
            transform: 'translate(-50%, -150%)',
            pointerEvents: 'none',
            fontSize: '16px'
        } }, hoverState.name);
};
