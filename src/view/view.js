var meshes = require('./meshes')
var tools = require('../util/tools')


/**
 * Calculates the default zoom factor by examining the bounds of the data set
 * and then dividing it by the height of the viewport.
 */
function getDefaultZoom(vectors, width, height) {
    var zoom = 10

    // Get rectangle that fits around data set
    var minX = 1000, maxX = -1000, minY = 1000, maxY = -1000;
    vectors.forEach(vector => {
        minX = Math.min(minX, vector.x)
        maxX = Math.max(maxX, vector.x)
        minY = Math.min(minY, vector.y)
        maxY = Math.max(maxY, vector.y)
    })

    // Get biggest scale
    var horizontal = Math.max(Math.abs(minX), Math.abs(maxX))
    var vertical = Math.max(Math.abs(minY), Math.abs(maxY))

    // Divide the height/width through the biggest axis of the data points
    return Math.min(width, height) / Math.max(horizontal, vertical) / 2
}







export default class ThreeView extends React.Component {
    constructor(props) {
        super(props)

        this.containerRef = React.createRef()
        this.mouseDown = false

        this.mouse = { x: 0, y: 0 }
        this.mouseDownPosition = { x: 0, y: 0 }
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
            if ((!this.settings.showIntPoints && value.cp == 0) || value.visible == false) {
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
    mouseToWorld(event) {
        var container = this.containerRef.current;
        var width = container.offsetWidth;
        var height = container.offsetHeight;

        const rect = container.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left - width / 2) / this.camera.zoom + this.camera.position.x,
            y: -(event.clientY - rect.top - height / 2) / this.camera.zoom + this.camera.position.y
        }
    }

    componentDidMount() {
        this.setupRenderer()
    }



    normaliseMouse(event) {
        var vec = {}
        vec.x = (event.clientX / window.innerWidth) * 2 - 1;
        vec.y = - (event.clientY / window.innerHeight) * 2 + 1;
        return vec
    }

    onMouseDown(event) {
        event.preventDefault();

        console.log(event)
        if (event.altKey && this.rectangleSelection != null) {
            var test = this.mouseToWorld(event)
            this.rectangleSelection.mouseDown(test.x, test.y)
        } else {
            // Dragging data around
            this.mouseDownPosition = this.normaliseMouse(event)
            this.mouseDown = true;
        }
    }

    onMouseMove(event) {
        event.preventDefault();

        var coords = this.mouseToWorld(event)

        if (this.rectangleSelection != null) {
            this.rectangleSelection.mouseMove(coords.x, coords.y)
        }

        if (window.infoTimeout != null) {
            clearTimeout(window.infoTimeout)
        }
        if (!this.mouseDown) {
            window.infoTimeout = setTimeout(() => {
                window.infoTimeout = null

                // Get index of selected node
                var idx = this.choose(coords)
                this.particles.highlight(idx)
                if (idx >= 0 && this.currentAggregation == null) {
                    this.lines.highlight([ this.vectors[idx].lineIndex ], this.width, this.height, this.scene)
                }
               

                var list = []
                if (idx >= 0) list.push(this.vectors[idx])
                this.props.onHover(list)

            }, 10);
        }

        // Dragging
        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        if (this.mouseDown) {
            this.camera.position.x = this.camera.position.x - (this.mouse.x - this.mouseDownPosition.x) * (600 / this.camera.zoom);
            this.camera.position.y = this.camera.position.y - (this.mouse.y - this.mouseDownPosition.y) * (600 / this.camera.zoom);
            this.mouseDownPosition = this.normaliseMouse(event)
            this.camera.updateProjectionMatrix()
        }
    }

    onMouseUp(event) {
        var test = this.mouseToWorld(event)

        if (this.rectangleSelection != null) {
            if (this.rectangleSelection.create) {
                var result = this.rectangleSelection.mouseUp(test.x, test.y)
                if (result != null && result.length > 0) {
                    // Highlight aggregation
                    var uniqueIndices = new Set(result.map(vector => vector.lineIndex))
                    this.lines.highlight(uniqueIndices, this.width, this.height, this.scene)
    
                    this.currentAggregation = result
    
                    this.props.onAggregate(result)
                } else {
                    this.currentAggregation = null
                    this.lines.highlight([], this.width, this.height, this.scene)
                }
            }

        }

        this.mouseDown = false;
    }

    onWheel(event) {
        event.preventDefault()
        this.camera.zoom = this.camera.zoom + event.deltaY * 0.02;
        if (this.camera.zoom < 1) {
            this.camera.zoom = 1;
        }

        this.particles.zoom(this.camera.zoom);


        this.lines.setZoom(this.camera.zoom)

        this.camera.updateProjectionMatrix();

    }

    setupRenderer() {
        var container = this.containerRef.current
        this.width = container.offsetWidth
        this.height = container.offsetHeight

        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        this.renderer.autoClear = true
        this.renderer.autoClearColor = false
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(this.width, this.height);
        this.renderer.setClearColor(0xffffff, 1);
        this.renderer.sortObjects = false;

        this.camera = new THREE.OrthographicCamera(this.width / - 2, this.width / 2, this.height / 2, this.height / - 2, 1, 1000);
        //this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0, 1000);
        this.camera.position.z = 1;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.camera.updateProjectionMatrix();

        container.appendChild(this.renderer.domElement);


        this.scene = new THREE.Scene()


        this.startRendering()



    }

    onKeyDown(event) {
        console.log(event)
    }

    createVisualization(vectors, segments, algorithms, settings) {
        this.scene = new THREE.Scene()
        this.pointScene = new THREE.Scene()
        this.vectors = vectors
        this.segments = segments
        this.algorithms = algorithms
        this.settings = settings

        // Update camera zoom to fit the problem
        this.camera.zoom = getDefaultZoom(this.vectors, this.width, this.height)
        this.camera.updateProjectionMatrix()

        this.lines = new meshes.LineVisualization(this.segments, this.algorithms)
        this.lines.createMesh()
        this.lines.setZoom(this.camera.zoom)

        this.particles = new meshes.PointVisualization(this.settings)
        this.particles.createMesh(this.vectors, this.segments, this.algorithms)
        this.particles.zoom(this.camera.zoom)
        this.particles.update()

        // First add lines, then particles
        this.lines.meshes.forEach(line => this.scene.add(line.line))
        //this.scene.add(this.particles.mesh);
        this.pointScene.add(this.particles.mesh)
        

        this.rectangleSelection = new tools.Selection(this.vectors, this.settings, this.scene)


        // Remove old listeners
        container.removeEventListener('mousemove', this.mouseMoveListener)
        container.removeEventListener('mousedown', this.mouseDownListener)
        container.removeEventListener('mouseup', this.mouseUpListener)
        container.removeEventListener('wheel', this.wheelListener)

        // Store new listeners
        this.wheelListener = event => this.onWheel(event)
        this.mouseDownListener = event => this.onMouseDown(event)
        this.mouseMoveListener = event => this.onMouseMove(event)
        this.mouseUpListener = event => this.onMouseUp(event)

        // Add new listeners
        container.addEventListener('mousemove', this.mouseMoveListener, false);
        container.addEventListener('mousedown', this.mouseDownListener, false);
        container.addEventListener('mouseup', this.mouseUpListener, false);
        container.addEventListener('wheel', this.wheelListener, false);
    }


    disposeScene() {
        if (this.lines != null) {
            console.log("dispose lines")
            this.lines.dispose(this.scene)
        }

        if (this.particles != null) {
            this.scene.remove(this.particles.mesh)
            this.particles.dispose()
        }

        if (this.renderer != null) {
            this.renderer.renderLists.dispose()
        }

        if (this.rectangleSelection != null) {
            console.log("dispose rectangle selection")
            this.rectangleSelection.dispose()
        }

    }


    startRendering() {
        requestAnimationFrame(() => this.startRendering());

        try {
            this.renderer.clear()
            this.renderer.render(this.scene, this.camera)
            this.renderer.render(this.pointScene, this.camera)
        } catch (e) {
        }
    }

    render() {
        return <div id="container" class="flex-grow-1" style={{ overflow: "hidden" }} ref={this.containerRef}></div>
    }
}