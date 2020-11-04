import THREE = require("three");

var fragmentShader = require('../../../shaders/trail_fragment.glsl')
var vertexShader = require('../../../shaders/trail_vertex.glsl')

export class TrailVisualization {
    mesh: THREE.Points<THREE.BufferGeometry, THREE.Material>
    maxLength: number = 50

    create(clusterObjects) {
        // hardcoded for 30 clusters, needs to be changed
        let len = 100 * 30

        var positions = new Float32Array(len * 3);
        var colors = new Float32Array(len * 4);
        var sizes = new Float32Array(len);
        var types = new Float32Array(len);
        var show = new Float32Array(len)
        var selected = new Float32Array(len);

        var pointGeometry = new THREE.BufferGeometry();
        pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        pointGeometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 4));
        pointGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
        pointGeometry.setAttribute('type', new THREE.BufferAttribute(types, 1));
        pointGeometry.setAttribute('show', new THREE.BufferAttribute(show, 1))
        pointGeometry.setAttribute('selected', new THREE.BufferAttribute(selected, 1))

        //
        var pointMaterial = new THREE.ShaderMaterial({
            uniforms: {
                zoom: { value: 1.0 },
                color: { value: new THREE.Color(0xffffff) },
                scale: { value: 1.0 },
                atlas: {
                    value: new THREE.TextureLoader().load("textures/sprites/square_white.png")
                }
            },
            transparent: true,
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            alphaTest: 0.05
        })

        this.mesh = new THREE.Points(pointGeometry, pointMaterial)
        this.mesh.frustumCulled = false
    }



    update(clusterObjects, zoom) {
        var i = 0

        

        var position = this.mesh.geometry.attributes.position as THREE.BufferAttribute
        var color = this.mesh.geometry.attributes.customColor as THREE.BufferAttribute
        clusterObjects.forEach(clusterObject => {
            let range = Math.min(this.maxLength, clusterObject.trailPositions.length)

            for (let j = 0; j < range; j++, i++) {
                let vector = clusterObject.trailPositions[clusterObject.trailPositions.length - 1 - j]

                position.setXYZ(i, vector.x * zoom, vector.y * zoom, 0.0)
                color.setXYZW(i, 0.33, 0.33, 0.33, 0.5 * ((clusterObject.trailPositions.length - 1 - j) / clusterObject.trailPositions.length))

                i = i + 1
            }
        })

        // Only draw necessary part
        this.mesh.geometry.setDrawRange(0, i)

        
        position.needsUpdate = true
        color.needsUpdate = true
    }



    setVisible(show: boolean) {
        this.mesh.visible = show
    }

    setLength(length: number) {
        this.maxLength = length
    }
}