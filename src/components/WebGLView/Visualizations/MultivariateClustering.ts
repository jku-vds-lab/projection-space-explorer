
import { Scene, Vector2 } from "three";
import Cluster from "../../util/Cluster";
import THREE = require("three");
import { Dataset, Vect } from "../../util/datasetselector";
import { ArrowGeometry } from "../../util/ArrowMesh";
import { Zoom } from "@material-ui/core";

const SELECTED_COLOR = 0x4d94ff
const DEFAULT_COLOR = 0xa3a3c2
const LINE_COLOR = 0xFF5733

/**
 * THREE.js helper class to create a visualization for clusters where points
 * have multiple cluster labels.
 */
export class MultivariateClustering {
    clusters: Cluster[]
    scene: Scene
    dataset: Dataset
    lineMesh: THREE.Mesh

    clusterObjects: any[] = []

    constructor(dataset: Dataset, scene: Scene, clusters: Cluster[]) {
        this.dataset = dataset
        this.scene = scene
        this.clusters = clusters
    }

    updatePositions(zoom: number) {
        let lineGeometry = new THREE.Geometry()
        lineGeometry.vertices = []
        lineGeometry.faces = []

        let index = 0

        this.clusterObjects.forEach(clusterObject => {
            let cluster = clusterObject.cluster
            let center = cluster.getCenter()
            let mesh = clusterObject.mesh
            
            mesh.position.set(center.x * zoom, center.y * zoom, 0)

            clusterObject.children.forEach(child => {
                if (child.visible) {
                    let sample = child.sample
                    let dir = new THREE.Vector2(child.sample.x - center.x, child.sample.y - center.y).normalize()
                    let rigth = new Vector2(dir.y, -dir.x).multiplyScalar(1)
                    let left = new Vector2(-dir.y, dir.x).multiplyScalar(1)
    
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
        let lineMateral = new THREE.MeshBasicMaterial({ color: LINE_COLOR, side: THREE.FrontSide })
        lineMateral.opacity = 0.5
        lineMateral.transparent = true
        let lineGeometry = new THREE.Geometry()
        this.lineMesh = new THREE.Mesh(lineGeometry, lineMateral)
        this.lineMesh.position.set(0, 0, -1)
        this.scene.add(this.lineMesh)

        this.clusters.forEach(cluster => {
            // Add circle to scene
            var geometry = new THREE.CircleGeometry(30 * this.dataset.bounds.scaleFactor, 32);
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
                children: []
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

        samples.forEach(sample => {
            sample.clusterLabel.forEach(label => {
                let clusterObject = this.clusterObjects.find(e => e.cluster.label == label)
                if (clusterObject) {
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
        this.clusterObjects.forEach(clusterObject => {
            this.scene.remove(clusterObject.mesh)
            clusterObject.geometry.dispose()
            clusterObject.material.dispose()
        })

        this.scene.remove(this.lineMesh)
        this.lineMesh.geometry.dispose()
        this.lineMesh.material.dispose()
    }
}