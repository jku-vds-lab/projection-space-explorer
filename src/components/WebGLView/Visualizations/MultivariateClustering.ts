
import { Scene } from "three";
import Cluster from "../../util/Cluster";
import THREE = require("three");
import { Dataset } from "../../util/datasetselector";

const SELECTED_COLOR = 0xFF0000
const DEFAULT_COLOR = 0xA48F8B
const LINE_COLOR = 0xFF5733

/**
 * THREE.js helper class to create a visualization for clusters where points
 * have multiple cluster labels.
 */
export class MultivariateClustering {
    clusters: Cluster[]
    scene: Scene
    dataset: Dataset

    clusterObjects: any[] = []

    constructor(dataset: Dataset, scene: Scene, clusters: Cluster[]) {
        this.dataset = dataset
        this.scene = scene
        this.clusters = clusters
    }

    /**
     * Creates the visualization.
     */
    create() {
        console.log("createing...")
        console.log(this.clusters)
        this.clusters.forEach(cluster => {
            // Add circle to scene
            var geometry = new THREE.CircleGeometry(3 * this.dataset.bounds.scaleFactor, 32);
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
                var temp = new THREE.Vector2(vector.x - center.x, vector.y - center.y)
                var geometry = new THREE.PlaneGeometry(0.5 * this.dataset.bounds.scaleFactor, temp.length(), 32);
                var material = new THREE.MeshBasicMaterial({ color: LINE_COLOR, side: THREE.DoubleSide });
                var plane = new THREE.Mesh(geometry, material);
                plane.visible = false
                
                plane.position.set((center.x + vector.x) / 2, (center.y + vector.y) / 2, -1)
                var temp = new THREE.Vector2(vector.x - center.x, vector.y - center.y)
                plane.rotateZ(temp.angle() + Math.PI / 2)

                this.scene.add(plane);
                

                clusterObject.children.push({
                    geometry: geometry,
                    material: material,
                    mesh: plane
                })
            })
        })
    }

    highlightCluster(clusters?: Cluster[]) {
        this.clusterObjects.forEach(clusterObject => {
            var visible = clusters?.includes(clusterObject.cluster)

            clusterObject.material.color = visible ? new THREE.Color(SELECTED_COLOR) : new THREE.Color(DEFAULT_COLOR)

            clusterObject.children.forEach(child => {
                child.mesh.visible = visible
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

            clusterObject.children.forEach(child => {
                this.scene.remove(child.mesh)
                child.geometry.dispose()
                child.material.dispose()
            })
        })
    }
}