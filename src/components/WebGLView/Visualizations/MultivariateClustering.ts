
import { Scene, Vector2 } from "three";
import Cluster, { Story } from "../../util/Cluster";
import THREE = require("three");
import { Dataset, Vect } from "../../util/datasetselector";
import { DisplayMode } from "../../Ducks/DisplayModeDuck";

const SELECTED_COLOR = 0x4d94ff
const DEFAULT_COLOR = 0xa3a3c2
const LINE_COLOR = 0xFF5733

/**
 * THREE.js helper class to create a visualization for clusters where points
 * have multiple cluster labels.
 */
export class MultivariateClustering {
    // arrowMesh
    arrowMesh: THREE.Mesh
    trailMesh: THREE.Mesh
    clusters: Cluster[]
    scene: Scene
    dataset: Dataset
    lineMesh: THREE.Mesh
    displayMode: DisplayMode
    clusterObjects: any[] = []
    devicePixelRatio: number

    constructor(dataset: Dataset, scene: Scene, clusters: Cluster[], displayMode: DisplayMode, devicePixelRatio: numer) {
        this.dataset = dataset
        this.scene = scene
        this.clusters = clusters
        this.displayMode = displayMode
        this.devicePixelRatio = devicePixelRatio
    }


    updateArrows(zoom: number, activeStory: Story) {
        if (!activeStory) {
            this.arrowMesh.visible = false;
            return;
        }

        this.arrowMesh.visible = true;
        this.arrowMesh.geometry.dispose()
        let arrowGeometry = new THREE.Geometry()
        arrowGeometry.vertices = []
        arrowGeometry.faces = []

    
        let index = 0
        activeStory.edges.forEach(edge => {
            let start = new THREE.Vector2(edge.source.getCenter().x, edge.source.getCenter().y)
            let end = new THREE.Vector2(edge.destination.getCenter().x, edge.destination.getCenter().y)

            let dir = end.clone().sub(start).normalize()
            let markerOffset = start.clone().sub(end).normalize().multiplyScalar(24)
            let left = new Vector2(-dir.y, dir.x).multiplyScalar(2)
            let right = new Vector2(dir.y, -dir.x).multiplyScalar(2)
            let markerLeft = new Vector2(-dir.y, dir.x).multiplyScalar(10)
            let markerRight = new Vector2(dir.y, -dir.x).multiplyScalar(10)
            let markerEnd = end.clone().multiplyScalar(zoom).add(markerOffset)
            let offset = dir.clone().multiplyScalar(this.devicePixelRatio * 16)

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
        if (this.scene.getObjectById(this.trailMesh.id)) {
            
        } else {
            //this.scene.add(this.trailMesh)
        }


        this.clusterObjects.forEach(clusterObject => {
            let center = clusterObject.cluster.getCenter()
           
            let last = clusterObject.trailPositions[clusterObject.trailPositions.length - 1]
            if (!last || new THREE.Vector3(center.x * zoom, center.y * zoom, 0).distanceTo(last.position) > 16) {

                var geometry = new THREE.CircleGeometry(this.devicePixelRatio * 12, 32);
                var material = new THREE.MeshBasicMaterial({ color: DEFAULT_COLOR });
                material.transparent = true
                material.opacity = 1
                var circle = new THREE.Mesh(geometry, material);
                
                circle.position.x = center.x * zoom
                circle.position.y = center.y * zoom
    
                

                clusterObject.trailPositions.push(circle)
                let len= clusterObject.trailPositions.length
                clusterObject.trailPositions.forEach((pos,i) => {
                    pos.material.opacity = i / len
                })
    
                this.scene.add(circle)
            }

        })


    }



    updatePositions(zoom: number) {
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
                if (child.visible && this.displayMode == DisplayMode.StatesAndClusters) {
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
        let arrowMateral = new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide })
        arrowMateral.opacity = 0.8
        arrowMateral.transparent = true
        lineMateral.opacity = 0.5
        lineMateral.transparent = true
        let lineGeometry = new THREE.Geometry()
        this.lineMesh = new THREE.Mesh(lineGeometry, lineMateral)
        this.lineMesh.position.set(0, 0, -1)
        this.scene.add(this.lineMesh)
        


        this.arrowMesh = new THREE.Mesh(new THREE.Geometry(), arrowMateral)

        this.scene.add(this.arrowMesh)


        this.trailMesh = new THREE.Mesh(new THREE.Geometry(), new THREE.MeshBasicMaterial({ color: 0x000000, side: THREE.DoubleSide }))

        this.clusters.forEach(cluster => {
            
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

    setDisplayMode(displayMode: DisplayMode) {
        this.displayMode = displayMode

        switch (displayMode) {
            case DisplayMode.OnlyClusters:
                this.clusterObjects.forEach(clusterObject => {
                    clusterObject.children.forEach(child => {
                        child.visible = false
                    })
                })
                break;
        }
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