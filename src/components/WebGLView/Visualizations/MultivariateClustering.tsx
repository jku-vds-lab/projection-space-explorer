
import { Scene, Vector2 } from "three";
import Cluster, { Story } from "../../util/Cluster";
import THREE = require("three");
import { Vect } from "../../util/datasetselector";
import { DisplayMode } from "../../Ducks/DisplayModeDuck";
import React = require("react");
import { RootState } from "../../Store/Store";
import { connect, ConnectedProps } from "react-redux";
import { arraysEqual } from "../UtilityFunctions";
import { ClusterMode } from "../../Ducks/ClusterModeDuck";

const SELECTED_COLOR = 0x4d94ff
const DEFAULT_COLOR = 0xa3a3c2
const LINE_COLOR = 0xFF5733

const mapState = (state: RootState) => ({
    dataset: state.dataset,
    clusters: state.currentClusters,
    displayMode: state.displayMode,
    webGLView: state.webGLView,
    selectedClusters: state.selectedClusters,
    clusterMode: state.clusterMode,
    activeStory: state.activeStory
})

const mapDispatch = dispatch => ({

})

const connector = connect(mapState, mapDispatch, null, { forwardRef: true });

type PropsFromRedux = ConnectedProps<typeof connector>

type Props = PropsFromRedux & {
}

/**
 * THREE.js helper class to create a visualization for clusters where points
 * have multiple cluster labels.
 */
export const MultivariateClustering = connector(class extends React.Component<Props> {
    // arrowMesh
    arrowMesh: THREE.Mesh
    trailMesh: THREE.Mesh
    scene: Scene
    lineMesh: THREE.Mesh
    clusterObjects: any[] = []
    devicePixelRatio: number
    scalingScene: Scene
    length: number



    constructor(props) {
        super(props)

        this.devicePixelRatio = window.devicePixelRatio
        this.scalingScene = new THREE.Scene()
        this.scene = new THREE.Scene()

        let arrowMateral = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
        arrowMateral.opacity = 0.8
        arrowMateral.transparent = true

        this.arrowMesh = new THREE.Mesh(new THREE.Geometry(), arrowMateral)
        this.scene.add(this.arrowMesh)
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.activeStory != this.props.activeStory) {
        }

        // If we have clusters now... and are on clusters tab... create cluster visualization
        if (!arraysEqual(prevProps.clusters, this.props.clusters)) {
            if (this.props.clusters && this.props.clusters.length > 0) {
                if (this.props.dataset.multivariateLabels) {

                    this.create()
                } else {

                    this.createClusters(this.props.clusters)
                }
            } else {
                this.destroy()
                this.dispose()
            }
        }

        if (prevProps.displayMode != this.props.displayMode) {
            switch (this.props.displayMode) {
                case DisplayMode.StatesAndClusters:
                    this.highlightCluster(this.props.selectedClusters)

                    break;
                case DisplayMode.OnlyClusters:
                    this.clusterObjects.forEach(clusterObject => {
                        clusterObject.children.forEach(child => {
                            child.visible = false
                        })
                    })
                    break;
            }
        }
    }

    trailSettings(trailSettings) {
        this.length = trailSettings.length
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
        this.props.activeStory?.edges.forEach(edge => {
            let start = new THREE.Vector2(edge.source.getCenter().x, edge.source.getCenter().y)
            let end = new THREE.Vector2(edge.destination.getCenter().x, edge.destination.getCenter().y)

            let dir = end.clone().sub(start).normalize()
            let markerOffset = start.clone().sub(end).normalize().multiplyScalar(24)
            let left = new Vector2(-dir.y, dir.x).multiplyScalar(2)
            let right = new Vector2(dir.y, -dir.x).multiplyScalar(2)
            let markerLeft = new Vector2(-dir.y, dir.x).multiplyScalar(10)
            let markerRight = new Vector2(dir.y, -dir.x).multiplyScalar(10)
            let markerEnd = end.clone().multiplyScalar(zoom).add(markerOffset)
            let offset = dir.clone().multiplyScalar(this.devicePixelRatio * 12)

            arrowGeometry.vertices.push(new THREE.Vector3(start.x * zoom + left.x + offset.x, start.y * zoom + left.y + offset.y, 0))
            arrowGeometry.vertices.push(new THREE.Vector3(start.x * zoom + right.x + offset.x, start.y * zoom + right.y + offset.y, 0))
            arrowGeometry.vertices.push(new THREE.Vector3(markerEnd.x + left.x - offset.x, markerEnd.y + left.y - offset.y, 0))
            arrowGeometry.vertices.push(new THREE.Vector3(markerEnd.x + right.x - offset.x, markerEnd.y + right.y - offset.y, 0))

            arrowGeometry.vertices.push(new THREE.Vector3(markerEnd.x + markerLeft.x - offset.x, markerEnd.y + markerLeft.y - offset.y, 0))
            arrowGeometry.vertices.push(new THREE.Vector3(markerEnd.x + markerRight.x - offset.x, markerEnd.y + markerRight.y - offset.y, 0))
            arrowGeometry.vertices.push(new THREE.Vector3(end.x * zoom - offset.x, end.y * zoom - offset.y, 0))


            let i = index * 7
            arrowGeometry.faces.push(new THREE.Face3(i, i + 1, i + 2))
            arrowGeometry.faces.push(new THREE.Face3(i + 1, i + 3, i + 2))

            arrowGeometry.faces.push(new THREE.Face3(i + 4, i + 6, i + 5))
            index = index + 1
        })

        this.arrowMesh.geometry = arrowGeometry
    }



    iterateTrail(zoom) {
        this.clusterObjects.forEach(clusterObject => {
            let center = clusterObject.cluster.getCenter()

            let last = clusterObject.trailPositions[clusterObject.trailPositions.length - 1]
            if (!last || new THREE.Vector3(center.x * zoom, center.y * zoom, 0).distanceTo(last.position) > 16) {

                var geometry = new THREE.CircleGeometry(this.devicePixelRatio * 8, 32);
                var material = new THREE.MeshBasicMaterial({ color: 0xd3d3d3 });
                material.transparent = true
                material.opacity = 1
                var circle = new THREE.Mesh(geometry, material);

                circle.position.x = center.x * zoom
                circle.position.y = center.y * zoom
                circle.position.z = -0.75

                let positions = clusterObject.trailPositions



                if (positions.length > 30) {
                    let rem = clusterObject.trailPositions.shift()
                    this.scene.remove(rem)
                }
                positions.push(circle)


                let len = positions.length
                positions.forEach((pos, i) => {
                    pos.material.opacity = (i / len) * 0.7
                })

                this.scene.add(circle)
            }

        })


    }



    updatePositions(zoom: number) {
        if (!this.scene || !this.lineMesh || this.props.clusterMode != ClusterMode.Multivariate) {
            return;
        }

        this.lineMesh.geometry.dispose()
        let lineGeometry = new THREE.Geometry()
        lineGeometry.vertices = []
        lineGeometry.faces = []

        let index = 0

        this.clusterObjects.forEach(clusterObject => {
            let cluster = clusterObject.cluster
            let center = cluster.getCenter()
            let mesh = clusterObject.mesh

            mesh.position.set(center.x * zoom, center.y * zoom, -0.5)

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
                    lineGeometry.faces.push(new THREE.Face3(i, i + 1, i + 2))
                    lineGeometry.faces.push(new THREE.Face3(i + 1, i + 3, i + 2))

                    index = index + 1
                }
            })
        })

        this.lineMesh.geometry = lineGeometry
    }








    /**
     * Creates the visualization.
     */
    create() {
        let lineMateral = new THREE.MeshBasicMaterial({ color: LINE_COLOR, side: THREE.DoubleSide })

        lineMateral.opacity = 0.5
        lineMateral.transparent = true
        let lineGeometry = new THREE.Geometry()
        this.lineMesh = new THREE.Mesh(lineGeometry, lineMateral)
        this.lineMesh.position.set(0, 0, -1)
        this.scene.add(this.lineMesh)

        this.trailMesh = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }))

        this.props.clusters.forEach(cluster => {

            // Add circle to scene
            var geometry = new THREE.CircleGeometry(this.devicePixelRatio * 12, 32);
            var material = new THREE.MeshBasicMaterial({ color: DEFAULT_COLOR });
            var circle = new THREE.Mesh(geometry, material);
            var center = cluster.getCenter()
            circle.position.set(center.x, center.y, 0)
            this.scene.add(circle);

            var clusterObject = {
                cluster: cluster,
                geometry: geometry,
                material: material,
                mesh: circle,
                children: [],
                trailPositions: []
            }
            this.clusterObjects.push(clusterObject)

            // Create line geometry
            cluster.vectors.forEach(vector => {
                clusterObject.children.push({
                    sample: vector,
                    visible: false
                })
            })
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
                    clusterObject.material.color = new THREE.Color(SELECTED_COLOR)

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
            clusterObject.material.color = new THREE.Color(DEFAULT_COLOR)

            clusterObject.children.forEach(child => {
                child.visible = false
            })
        })
    }


    highlightCluster(clusters?: Cluster[]) {
        this.deactivateAll()

        this.clusterObjects.forEach(clusterObject => {
            var visible = clusters?.includes(clusterObject.cluster)

            clusterObject.material.color = visible ? new THREE.Color(SELECTED_COLOR) : new THREE.Color(DEFAULT_COLOR)

            clusterObject.children.forEach(child => {
                child.visible = visible
            })
        })
    }


    /**
     * Destroys the visualization.
     */
    destroy() {

        if (this.clusterObjects && this.clusterObjects.length > 0) {
            this.clusterObjects.forEach(clusterObject => {
                this.scene.remove(clusterObject.mesh)
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
    createClusters(clusters) {
        clusters.sort((a, b) => b.order() - a.order())

        var clusterMeshes = []
        var lineMeshes = []

        clusters.forEach((cluster, ii) => {
            if (cluster.label == -1 || ii > 15) return;

            var test = cluster.triangulation
            var polygon = cluster.hull

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
                color: 0x909090,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.2
            });
            var mesh = new THREE.Mesh(geometry, meshMat);
            clusterMeshes.push(mesh)
            lineMeshes.push(line)
            this.scalingScene.add(mesh);
        })

        this.clusterVis = { clusterMeshes: clusterMeshes, lineMeshes: lineMeshes }



    }



    dispose() {
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
        }
    }












    render() {
        return <div></div>
    }
})