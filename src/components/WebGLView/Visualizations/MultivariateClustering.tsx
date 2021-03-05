
import { Scene, Vector2, Vector3 } from "three";
import Cluster from "../../Utility/Data/Cluster";
import THREE = require("three");
import { Vect } from "../../Utility/Data/Vect";
import { DisplayMode } from "../../Ducks/DisplayModeDuck";
import React = require("react");
import { RootState } from "../../Store/Store";
import { connect, ConnectedProps } from "react-redux";
import { arraysEqual } from "../UtilityFunctions";
import { NamedCategoricalScales } from "../../Utility/Colors/NamedCategoricalScales";
import { TrailVisualization } from "./TrailVisualization";
import { ClusterMode } from "../../Ducks/ClusterModeDuck";
import { Typography } from "@material-ui/core";
import { CameraTransformations } from "../CameraTransformations";
import { Story } from "../../Utility/Data/Story";
import * as nt from '../../NumTs/NumTs'

import * as frontend_utils from "../../../utils/frontend-connect";
import { toPlainObject } from "lodash";

const SELECTED_COLOR = 0x4d94ff
const DEFAULT_COLOR = 0x808080
const GRAYED = 0xDCDCDC

const WING_SIZE = 2.2
const LINE_WIDTH = 1.5

type ClusterObjectType = {
    cluster: Cluster,
    geometry: THREE.Geometry,
    material: THREE.MeshBasicMaterial,
    mesh: THREE.Mesh<THREE.Geometry, THREE.MeshBasicMaterial>,
    children: any[],
    trailPositions: any[],
    lineColor: any,
    triangulatedMesh: any
    sampleConnection: boolean
}

const mapState = (state: RootState) => ({
    dataset: state.dataset,
    displayMode: state.displayMode,
    webGLView: state.webGLView,
    selectedClusters: state.selectedClusters,
    clusterMode: state.clusterMode,
    trailSettings: state.trailSettings,
    stories: state.stories,
    globalPointSize: state.globalPointSize,
    viewTransform: state.viewTransform
})


const connector = connect(mapState, null, null, { forwardRef: true });

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
}

/**
 * Clustering visualization as a React component.
 */
export const MultivariateClustering = connector(class extends React.Component<Props> {
    // arrowMesh
    arrowMesh: THREE.Mesh
    trailMesh: THREE.Mesh
    scene: Scene
    lineMesh: THREE.Mesh
    clusterObjects: ClusterObjectType[] = []
    devicePixelRatio: number
    scalingScene: Scene
    length: number
    clusterVis: { clusterMeshes: THREE.Mesh<THREE.Geometry, THREE.MeshBasicMaterial>[], lineMeshes: THREE.Mesh<THREE.Geometry, THREE.MeshBasicMaterial>[] }
    trail: TrailVisualization
    clusterScene: THREE.Scene

    triangulationWorker: Worker


    constructor(props) {
        super(props)

        this.devicePixelRatio = window.devicePixelRatio
        this.scalingScene = new THREE.Scene()
        this.scene = new THREE.Scene()
        this.clusterScene = new THREE.Scene()

        let arrowMateral = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, vertexColors: true })
        arrowMateral.opacity = 0.8
        arrowMateral.transparent = true

        this.arrowMesh = new THREE.Mesh(new THREE.Geometry(), arrowMateral)
        this.scene.add(this.arrowMesh)

        this.trailMesh = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide, vertexColors: true }))
        this.scene.add(this.trailMesh)

        this.trail = new TrailVisualization()
        this.trail.create(this.clusterObjects)
        this.scene.add(this.trail.mesh)

        this.triangulationWorker = new Worker(frontend_utils.BASE_PATH + 'tessy.js') //dist/
    }


    componentDidUpdate(prevProps) {
        if (prevProps.trailSettings != this.props.trailSettings) {
            this.trail.setVisible(this.props.trailSettings.show)
            this.trail.setLength(this.props.trailSettings.length)
        }

        // If we have clusters now... and are on clusters tab... create cluster visualization
        if (prevProps.stories != this.props.stories) {
            this.destroy()
            this.disposeTriangulatedMesh()

            if (this.props.stories.active && this.props.stories.active.clusters.length > 0) {
                if (this.props.dataset.multivariateLabels) {
                    this.create()
                } else {
                    this.create()
                    this.createTriangulatedMesh()
                }
            }
        }

        if (prevProps.displayMode != this.props.displayMode) {
            switch (this.props.displayMode) {
                case DisplayMode.StatesAndClusters:
                    this.highlightCluster(this.props.selectedClusters)
                    this.clusterScene.visible = true
                    this.scalingScene.visible = true
                    this.scene.visible = true
                    break;
                case DisplayMode.OnlyClusters:
                    this.clusterScene.visible = true
                    this.scalingScene.visible = true
                    this.scene.visible = true
                    this.clusterObjects.forEach(clusterObject => {
                        clusterObject.children.forEach(child => {
                            child.visible = false
                        })
                    })
                    break;
                case DisplayMode.OnlyStates:
                case DisplayMode.None:
                    this.clusterScene.visible = false
                    this.scalingScene.visible = false
                    this.scene.visible = false
                    
                    break;
            }
        }
    }

    updateArrows(zoom: number) {
        if (!this.arrowMesh) {
            return;
        }

        this.arrowMesh.visible = true;
        this.arrowMesh.geometry.dispose()
        let arrowGeometry = new THREE.Geometry()
        arrowGeometry.vertices = []
        arrowGeometry.faces = []

        let index = 0
        this.props.stories.active?.edges.forEach(edge => {
            let color = new THREE.Color(DEFAULT_COLOR)
            if (this.props.stories.trace && this.props.stories.trace.mainEdges.includes(edge)) {
                color = new THREE.Color(SELECTED_COLOR)
            }

            let start = new THREE.Vector2(edge.source.getCenter().x, edge.source.getCenter().y)
            let end = new THREE.Vector2(edge.destination.getCenter().x, edge.destination.getCenter().y)
            let middle = new THREE.Vector2().addVectors(start, new THREE.Vector2().subVectors(end, start).multiplyScalar(0.5))

            let dir = end.clone().sub(start).normalize()
            let markerOffset = start.clone().sub(end).normalize().multiplyScalar(24)
            let left = new Vector2(-dir.y, dir.x).multiplyScalar(LINE_WIDTH)
            let right = new Vector2(dir.y, -dir.x).multiplyScalar(LINE_WIDTH)
            let offset = dir.clone().multiplyScalar(this.devicePixelRatio * 12)

            // line without arrow
            arrowGeometry.vertices.push(new THREE.Vector3(start.x * zoom + left.x + offset.x, start.y * zoom + left.y + offset.y, 0))
            arrowGeometry.vertices.push(new THREE.Vector3(start.x * zoom + right.x + offset.x, start.y * zoom + right.y + offset.y, 0))
            arrowGeometry.vertices.push(new THREE.Vector3(end.x * zoom + left.x - offset.x, end.y * zoom + left.y - offset.y, 0))
            arrowGeometry.vertices.push(new THREE.Vector3(end.x * zoom + right.x - offset.x, end.y * zoom + right.y - offset.y, 0))

            // left wing
            arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + left.x - offset.x, middle.y * zoom + left.y - offset.y, 0))
            arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + left.x + offset.x, middle.y * zoom + left.y + offset.y, 0))
            arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + left.x * WING_SIZE - offset.x, middle.y * zoom + left.y * WING_SIZE - offset.y, 0))

            // Right wing
            arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + right.x - offset.x, middle.y * zoom + right.y - offset.y, 0))
            arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + right.x + offset.x, middle.y * zoom + right.y + offset.y, 0))
            arrowGeometry.vertices.push(new THREE.Vector3(middle.x * zoom + right.x * WING_SIZE - offset.x, middle.y * zoom + right.y * WING_SIZE - offset.y, 0))

            let i = index * 10
            // line without arrow
            arrowGeometry.faces.push(new THREE.Face3(i, i + 1, i + 2, new Vector3(0, 0, -1), color))
            arrowGeometry.faces.push(new THREE.Face3(i + 1, i + 3, i + 2, new Vector3(0, 0, -1), color))

            // left wing
            arrowGeometry.faces.push(new THREE.Face3(i + 4, i + 6, i + 5, new Vector3(0, 0, -1), color))

            // Right wing
            arrowGeometry.faces.push(new THREE.Face3(i + 7, i + 9, i + 8, new Vector3(0, 0, -1), color))

            index = index + 1
        })

        this.arrowMesh.geometry = arrowGeometry
    }



    /**
     * Updates geometry of the trail mesh.
     */
    updateTrail(zoom: number) {
        this.trail.update(this.clusterObjects, zoom)
    }


    iterateTrail(zoom) {
        this.clusterObjects.forEach(clusterObject => {
            let center = clusterObject.cluster.getCenter()

            let last = clusterObject.trailPositions[clusterObject.trailPositions.length - 1]
            if (!last || new THREE.Vector3(center.x, center.y, 0).distanceTo(last) > 0.1) {
                let positions = clusterObject.trailPositions

                if (positions.length > this.props.trailSettings.length) {
                    let rem = clusterObject.trailPositions.shift()
                }

                positions.push(new THREE.Vector3(center.x, center.y, 0))
            }

        })
    }



    updatePositions(zoom: number) {
        if (!this.scene || !this.lineMesh) {
            return;
        }

        this.lineMesh.geometry.dispose()
        let lineGeometry = new THREE.Geometry()
        lineGeometry.vertices = []
        lineGeometry.faces = []
        lineGeometry.colors = []

        let index = 0

        this.clusterObjects.forEach(clusterObject => {
            let cluster = clusterObject.cluster
            let center = cluster.getCenter()
            let mesh = clusterObject.mesh

            mesh.position.set(center.x * zoom, center.y * zoom, -0.5)

            mesh.material.color = this.getColorForClusterObject(clusterObject)

            mesh.scale.set(this.props.globalPointSize[0], this.props.globalPointSize[0], this.props.globalPointSize[0])

            clusterObject.children.forEach(child => {
                if (child.visible && this.props.displayMode == DisplayMode.StatesAndClusters) {
                    let sample = child.sample
                    let dir = new THREE.Vector2(child.sample.x - center.x, child.sample.y - center.y).normalize()
                    let rigth = new Vector2(dir.y, -dir.x).multiplyScalar(this.devicePixelRatio)
                    let left = new Vector2(-dir.y, dir.x).multiplyScalar(this.devicePixelRatio)

                    lineGeometry.vertices.push(new THREE.Vector3(center.x * zoom + left.x, center.y * zoom + left.y, 0))
                    lineGeometry.vertices.push(new THREE.Vector3(center.x * zoom + rigth.x, center.y * zoom + rigth.y, 0))
                    lineGeometry.vertices.push(new THREE.Vector3(sample.x * zoom + left.x, sample.y * zoom + left.y, 0))
                    lineGeometry.vertices.push(new THREE.Vector3(sample.x * zoom + rigth.x, sample.y * zoom + rigth.y, 0))

                    let i = index * 4
                    lineGeometry.faces.push(new THREE.Face3(i, i + 1, i + 2, new Vector3(0, 0, -1), new THREE.Color(clusterObject.lineColor.hex)))
                    lineGeometry.faces.push(new THREE.Face3(i + 1, i + 3, i + 2, new Vector3(0, 0, -1), new THREE.Color(clusterObject.lineColor.hex)))

                    index = index + 1
                }
            })
        })

        this.lineMesh.geometry = lineGeometry
    }

    getColorForClusterObject(clusterObject) {
        if (this.props.selectedClusters.includes(clusterObject.cluster) || clusterObject.sampleConnection) {
            return new THREE.Color(SELECTED_COLOR)
        }

        if (this.props.stories.active?.clusters?.includes(clusterObject.cluster)) {
            return new THREE.Color(DEFAULT_COLOR)
        } else {
            return new THREE.Color(GRAYED)
        }
    }

    /**
     * Creates the visualization.
     */
    create() {
        this.clusterObjects = []

        let lineMateral = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, vertexColors: true })

        lineMateral.opacity = 0.5
        lineMateral.transparent = true
        let lineGeometry = new THREE.Geometry()
        this.lineMesh = new THREE.Mesh(lineGeometry, lineMateral)
        this.lineMesh.position.set(0, 0, -1)
        this.scene.add(this.lineMesh)



        let scale = NamedCategoricalScales.DARK2()

        this.props.stories.active.clusters.forEach((cluster, ci) => {

            // Add circle to scene
            var geometry = new THREE.PlaneGeometry(this.devicePixelRatio * 12, this.devicePixelRatio * 12);
            geometry.rotateZ(Math.PI / 4)
            geometry.scale(0.85, 1.0, 1.0)
            

            var material = new THREE.MeshBasicMaterial({ color: new THREE.Color(DEFAULT_COLOR) });
            var circle = new THREE.Mesh(geometry, material);


            material.opacity = 0.92


            material.transparent = true

            var center = cluster.getCenter()
            circle.position.set(center.x, center.y, 0)
            this.clusterScene.add(circle);

            var clusterObject: ClusterObjectType = {
                cluster: cluster,
                geometry: geometry,
                material: material,
                mesh: circle,
                children: [],
                trailPositions: [],
                lineColor: scale.map(ci),
                triangulatedMesh: {

                },
                sampleConnection: false
            }

            material.color = this.getColorForClusterObject(clusterObject)

            this.clusterObjects.push(clusterObject)

            if (this.props.clusterMode == ClusterMode.Multivariate) {
                // Create line geometry
                cluster.vectors.forEach(vector => {
                    clusterObject.children.push({
                        sample: vector,
                        visible: false
                    })
                })
            }
        })
    }

    // Activates the lines from given samples to their corresponding clusters
    highlightSamples(samples: Vect[]) {
        // Deactivate all lines
        this.deactivateAll()

        this.clusterObjects.forEach(clusterObject => {
            clusterObject.material.color = new THREE.Color(DEFAULT_COLOR)
        })

        samples.forEach(sample => {
            sample.clusterLabel.forEach(label => {
                let clusterObject = this.clusterObjects.find(e => e.cluster.label == label)


                if (clusterObject) {
                    clusterObject.sampleConnection = true

                    clusterObject.children.forEach(child => {
                        if (child.sample == sample) {
                            child.visible = true
                        }
                    })
                }
            })
        })
    }

    deactivateAll() {
        this.clusterObjects.forEach(clusterObject => {
            clusterObject.sampleConnection = false

            clusterObject.material.color = this.getColorForClusterObject(clusterObject)

            clusterObject.children.forEach(child => {
                child.visible = false
            })
        })
        if (this.clusterVis) {
            this.clusterVis.lineMeshes.forEach(mesh => {
                mesh.visible = false
            })
            this.clusterVis.clusterMeshes.forEach(mesh => {
                mesh.visible = false
            })
        }

    }


    highlightCluster(clusters?: Cluster[]) {
        this.deactivateAll()

        this.clusterObjects.forEach((clusterObject, index) => {
            var visible = clusters?.includes(clusterObject.cluster)

            clusterObject.material.color = visible ? new THREE.Color(SELECTED_COLOR) : new THREE.Color(DEFAULT_COLOR)

            clusterObject.children.forEach(child => {
                child.visible = visible
            })

            if (this.clusterVis) {
                let triangulatedMesh = this.clusterVis.clusterMeshes[index]
                let triangulatedHull = this.clusterVis.lineMeshes[index]
                triangulatedHull.visible = visible
                triangulatedMesh.visible = visible
            }

        })
    }


    /**
     * Destroys the visualization.
     */
    destroy() {
        if (this.clusterObjects && this.clusterObjects.length > 0) {
            this.clusterObjects.forEach(clusterObject => {
                this.clusterScene.remove(clusterObject.mesh)
                clusterObject.geometry.dispose()
                clusterObject.material.dispose()
            })
        }

        if (this.lineMesh) {
            this.scene.remove(this.lineMesh)

            let lineMaterial = this.lineMesh.material as THREE.Material
            this.lineMesh.geometry.dispose()
            lineMaterial.dispose()
        }
    }









    /**
     * Creates the triangulated mesh that visualizes the clustering.
     * @param clusters an array of clusters
     */
    createTriangulatedMesh() {
        this.disposeTriangulatedMesh()

        if (this.props.dataset.multivariateLabels) {
            return;
        }

        var clusterMeshes = []
        var lineMeshes = []


        if (this.props.stories.active) {
            this.triangulationWorker.postMessage({
                messageType: 'triangulate',
                input: this.props.stories.active.clusters.map(cluster => cluster.vectors.map(sample => [sample.x, sample.y]))
            })
        }

        this.triangulationWorker.onmessage = (e) => {
            let Y = e.data

            for (let idx = 0; idx < Y.length; idx++) {
                let test = Y[idx].triangulation
                let polygon = Y[idx].hull


                var points = [];

                let material = new THREE.LineBasicMaterial({ color: 0x909090 });
                polygon.forEach(pt => {
                    points.push(new THREE.Vector3(pt[0], pt[1], -5));
                })
                var linege = new THREE.BufferGeometry().setFromPoints(points);
                var line = new THREE.Line(linege, material);
                this.scalingScene.add(line);

                var geometry = new THREE.Geometry();

                var vi = 0
                for (let i = 0; i < test.length; i += 6) {
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
                    color: 0x909090,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.2
                });
                var mesh = new THREE.Mesh(geometry, meshMat);
                clusterMeshes.push(mesh)
                lineMeshes.push(line)
                this.scalingScene.add(mesh);

                mesh.visible = false
                line.visible = false
            }
        }


        this.clusterVis = { clusterMeshes: clusterMeshes, lineMeshes: lineMeshes }
    }



    /**
     * Destroys the triangulated view of the clusters.
     */
    disposeTriangulatedMesh() {
        if (this.clusterVis != null) {
            const { clusterMeshes, lineMeshes } = this.clusterVis
            clusterMeshes.forEach(mesh => {
                mesh.geometry.dispose()
                mesh.material.dispose()
                this.scalingScene.remove(mesh)
            })
            lineMeshes.forEach(mesh => {
                mesh.geometry.dispose()
                mesh.material.dispose()
                this.scalingScene.remove(mesh)
            })

            this.clusterVis = null
        }
    }

    /**
     * Returns the label color of a given cluster
     * 
     * @param cluster A cluster
     */
    textColor(cluster: Cluster) {
        if (this.props.selectedClusters.includes(cluster)) {
            return 'black'
        } else {
            return 'white'
        }
    }



    /**
     * Creates textual representations of the edges of the story.
     */
    createStreetLabels(story: Story) {
        let labels = []

        story.edges.filter(edge => edge.name && edge.name != "").map(edge => {
            let source = CameraTransformations.worldToScreen(edge.source.getCenter(), this.props.viewTransform)
            let dest = CameraTransformations.worldToScreen(edge.destination.getCenter(), this.props.viewTransform)

            let angle = new nt.VectBase(dest.x - source.x, dest.y - source.y).angle()
            if (angle > Math.PI * 0.5 && angle < Math.PI * 1.5) {
                angle = angle - Math.PI
            }

            // Only display edge name if it can fit inside the viewport
            if (nt.euclideanDistanceVec(source, dest) > edge.name.length * 10) {
                labels.push(
                    <Typography style={{
                        position: 'absolute',
                        left: (source.x + dest.x) / 2,
                        top: (source.y + dest.y) / 2,
                        background: 'transparent',
                        color: 'black',
                        transform: `translate(-50%, 0px) rotateZ(${angle}rad) translate(0, -25px)`,
                        pointerEvents: 'none'
                    }}>{edge.name}</Typography>
                )
            }
        })



        return labels
    }



    /**
     * Render an empty div, so componentDidMount will get called.
     */
    render() {
        return <div>

            {
                this.props.stories.active && this.createStreetLabels(this.props.stories.active)
            }

            {
                this.props.stories.trace && this.props.stories.trace.mainPath.map((cluster, index) => {
                    let screen = CameraTransformations.worldToScreen(cluster.getCenter(), this.props.viewTransform)

                    return <Typography style={{
                        position: 'absolute',
                        left: screen.x,
                        top: screen.y,
                        background: 'transparent',
                        color: 'black',
                        fontWeight: "bold",
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'none'
                    }}>{index}</Typography>
                })
            }
        </div>
    }
})