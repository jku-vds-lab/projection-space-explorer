var meshes = require('./meshes')
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import { getDefaultZoom, arraysEqual, normalizeWheel, centerOfMass, interpolateLinear, generateZoomForSet } from './utilfunctions';
import { LassoSelection } from '../util/tools'
import { isPointInConvaveHull } from '../util/geometry'
import { GenericClusterLegend, GenericLegend } from '../legends/generic'
import { Cluster } from '../workers/worker_cluster'
var d3 = require('d3')


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
                            onChange={(event, val) => { setValue(val); onChangeSlider(val / 100.0) }}
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













export default class ThreeView extends React.Component {
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

        this.currentAggregation = []

        this.state = {
            // clusters to display using force-directed layout
            displayClusters: [],

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
        var container = this.containerRef.current;
        var width = container.offsetWidth;
        var height = container.offsetHeight;

        const rect = container.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left),
            y: (event.clientY - rect.top)
        }
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



    /**
     * Converts world coordinates to screen coordinates
     * @param {*} vec a vector containing x and y
     */
    worldToScreen(vec) {
        return {
            x: (vec.x - this.camera.position.x) * this.camera.zoom + this.getWidth() / 2,
            y: (-vec.y + this.camera.position.y) * this.camera.zoom + this.getHeight() / 2
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

    resize(width, height) {
        this.camera.left = width / -2


        this.camera.right = width / 2
        this.camera.top = height / 2
        this.camera.bottom = height / -2

        this.camera.updateProjectionMatrix()
        this.renderer.setSize(width, height)
    }

    onMouseDown(event) {
        event.preventDefault();

        this.mouseDown = true
        this.initialMousePosition = new THREE.Vector2(event.clientX, event.clientY)
        this.mouseDownPosition = this.normaliseMouse(event)
    }


    onKeyDown(event) {
        console.log(event)
    }





    onMouseMove(event) {
        event.preventDefault();

        var coords = this.mouseToWorld(event)

        if (this.props.tool == 'default') {
            var mousePosition = new THREE.Vector2(event.clientX, event.clientY)

            if (this.initialMousePosition != null && this.initialMousePosition.distanceTo(mousePosition) > 10 && this.lasso == null && this.mouseDown) {
                var initialWorld = this.clientCoordinatesToWorld(this.initialMousePosition.x, this.initialMousePosition.y)

                this.lasso = new LassoSelection()
                this.lasso.mouseDown(true, initialWorld.x, initialWorld.y)
            } else if (this.lasso != null) {
                this.lasso.mouseMove(coords.x, coords.y)
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
                    if (idx >= 0) {
                        this.lines.highlight([this.vectors[idx].view.lineIndex], this.getWidth(), this.getHeight(), this.scene)
                    } else {
                        this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene)
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
        } else if (this.props.tool == 'move') {
            // If the selected tool is the move tool, process it
            this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;


            if (this.mouseDown) {
                this.camera.position.x = this.camera.position.x - (this.mouse.x - this.mouseDownPosition.x) * (600 / this.camera.zoom);
                this.camera.position.y = this.camera.position.y - (this.mouse.y - this.mouseDownPosition.y) * (600 / this.camera.zoom);
                this.mouseDownPosition = this.normaliseMouse(event)
                this.camera.updateProjectionMatrix()
            }
        } else if (this.props.tool == 'grab') {
            var found = false
            this.props.clusters.forEach(cluster => {
                if (cluster.label == '-1') return;

                if (cluster.containsPoint(coords)) {
                    if (isPointInConvaveHull(coords, cluster.hull.map(h => ({ x: h[0], y: h[1] })))) {
                        found = true
                        this.setState({
                            hoverCluster: cluster
                        })
                    }
                }
            })
            if (!found) {
                this.setState({
                    hoverCluster: null
                })
            }
        }
    }

    onMouseUp(event) {
        var test = this.mouseToWorld(event)

        if (this.props.tool == 'default') {
            if (this.lasso != null) {
                // If there is an active lasso, process it
                var wasDrawing = this.lasso.drawing

                this.lasso.mouseUp(test.x, test.y)

                var indices = this.lasso.selection(this.vectors, (vector) => this.particles.isPointVisible(vector))
                if (indices.length > 0 && wasDrawing) {
                    var selected = indices.map(index => this.vectors[index])



                    // Toggle selected states
                    selected.forEach(vector => {
                        vector.view.selected = !vector.view.selected

                        if (this.currentAggregation.includes(vector) && !vector.view.selected) {
                            this.currentAggregation.splice(this.currentAggregation.indexOf(vector), 1)
                        } else if (!this.currentAggregation.includes(vector) && vector.view.selected) {
                            this.currentAggregation.push(vector)
                        }
                    })


                    var uniqueIndices = [...new Set(this.currentAggregation.map(vector => vector.view.lineIndex))]

                    this.lines.groupHighlight(uniqueIndices)
                    //this.lines.highlight(uniqueIndices, this.getWidth(), this.getHeight(), this.scene)

                    this.props.onAggregate(this.currentAggregation)

                } else if (wasDrawing) {
                    this.clearSelection()
                }

                this.lasso = null
            } else {
                if (this.currentHover != null) {
                    // There is a hover target ... select it
                    this.currentHover.view.selected = !this.currentHover.view.selected

                    if (this.currentAggregation.includes(this.currentHover) && !this.currentHover.view.selected) {
                        this.currentAggregation.splice(this.currentAggregation.indexOf(this.currentHover), 1)
                        this.props.onAggregate(this.currentAggregation)
                    } else if (!this.currentAggregation.includes(this.currentHover) && this.currentHover.view.selected) {
                        this.currentAggregation.push(this.currentHover)
                        this.props.onAggregate(this.currentAggregation)
                    }

                    var uniqueIndices = [...new Set(this.currentAggregation.map(vector => vector.view.lineIndex))]

                    this.lines.groupHighlight(uniqueIndices)
                }
            }
        } else if (this.props.tool == 'grab') {
            // current hover is null, check if we are inside a cluster
            var found = false
            this.props.clusters.forEach(cluster => {
                if (cluster.label != '-1') {
                    if (isPointInConvaveHull(test, cluster.hull.map(h => ({ x: h[0], y: h[1] })))) {
                        found = true

                        if (event.button == 0) {
                            var selected = cluster.points.map(h => this.dataset.vectors[h.meshIndex])

                            selected.forEach(vector => {
                                vector.view.selected = !vector.view.selected

                                if (this.currentAggregation.includes(vector) && !vector.view.selected) {
                                    this.currentAggregation.splice(this.currentAggregation.indexOf(vector), 1)
                                } else if (!this.currentAggregation.includes(vector) && vector.view.selected) {
                                    this.currentAggregation.push(vector)
                                }
                            })


                            var uniqueIndices = [...new Set(this.currentAggregation.map(vector => vector.view.lineIndex))]

                            this.lines.groupHighlight(uniqueIndices)
                            //this.lines.highlight(uniqueIndices, this.getWidth(), this.getHeight(), this.scene)

                            this.props.onAggregate(this.currentAggregation)
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

        this.particles.update()
        this.mouseDown = false;
    }


    clearSelection() {
        this.lasso = null
        this.currentAggregation = []
        this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene)

        this.lines.groupHighlight([])

        this.vectors.forEach((vector, index) => {
            vector.view.selected = false
        })

        this.props.onAggregate([])
    }


    onWheel(event) {
        event.preventDefault()

        var normalized = normalizeWheel(event)

        // Store world position under mouse
        var worldBefore = this.mouseToWorld(event)
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
        this.lines.setZoom(this.camera.zoom)

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

    createClusters(clusters) {

        clusters.sort((a, b) => b.order() - a.order())


        if (this.clusterVisualization != null) {
            this.clusterVisualization.dispose(this.scene)
            this.clusterVisualization = null
        }

        var clusterMeshes = []

        clusters.forEach((cluster, ii) => {
            if (cluster.label == -1 || ii > 15) return;

            var test = cluster.triangulation
            var polygon = cluster.hull

            var points = [];
            var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
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

            var material = new THREE.MeshBasicMaterial({
                color: 0x000000,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.1,
                // vertexColors: true
            });
            var mesh = new THREE.Mesh(geometry, material);
            clusterMeshes.push(mesh)
            this.scene.add(mesh);
        })

        this.clusterVisualization = new meshes.ClusterVisualization(clusterMeshes)
    }



    getWidth() {
        return this.containerRef.current.offsetWidth
    }

    getHeight() {
        return this.containerRef.current.offsetHeight
    }



    /**
     * Create debug clustering for segments.
     * @param {*} bundles 
     */
    debugSegs(bundles, edgeClusters) {
        this.debugD3(edgeClusters)

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

        this.lines = new meshes.LineVisualization(this.segments, this.lineColorScheme)
        this.lines.createMesh()
        this.lines.setZoom(this.camera.zoom)

        this.particles = new meshes.PointVisualization(this.vectorColorScheme, this.dataset)
        this.particles.createMesh(this.vectors, this.segments)
        this.particles.zoom(this.camera.zoom)
        this.particles.update()

        // First add lines, then particles
        this.lines.meshes.forEach(line => this.scene.add(line.line))
        //this.scene.add(this.particles.mesh);
        this.pointScene.add(this.particles.mesh)


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
        console.log(overlap)

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

        console.log(trees.slice(0))
        console.log(nonStart.slice(0))
        
        while (nonStart.length > 0) {
            var a = nonStart.splice(0, 1)[0]
            for (var i = 0; i < trees.length; i++) {
                var tree = trees[i]
                var last = tree[tree.length - 1]

                console.log(`compare `)
                console.log(last)
                console.log(a)

                if (last.target == a.source) {
                    tree.push(a)
                }
            }
        }

        console.log("f")
        
        return trees
    }



    debugD3(edgeClusters) {
        this.trees = this.detectBundles(edgeClusters)
        this.edgeClusters = edgeClusters.toMatrix()

        var self = this
        // Filter out clusters from edgeClusters

        console.log(this.trees)
        
        var process = []
        this.trees.forEach(tree => {
            tree.forEach((connection, i) => {
                process.push(this.edgeClusters[connection.source])
                if (i == tree.length - 1) {
                    process.push(this.edgeClusters[connection.target])
                }
            })
        })

        var displayClusters = process.map(edgeCluster => {
            var vecs = edgeCluster.map(m => m.target)
            var c = new Cluster(vecs, null, null, null)
            c.forceLabelPosition = c.getCenter()
            c.shiftX = 0
            c.shiftY = 0
            return c
        })

        this.setState({
            displayClusters: displayClusters
        })


        var width = this.getWidth();
        var height = this.getHeight();
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var graph = {
            nodes: displayClusters.map(m => {
                return {
                    id: Math.random(),
                    center: m.getCenter()
                }
            })
        }


        var label = {
            'nodes': [],
            'links': []
        };

        graph.nodes.forEach(function (d, i) {
            label.nodes.push({ node: d });
            label.nodes.push({ node: d });
            label.links.push({
                source: i * 2,
                target: i * 2 + 1
            });
        });

        var labelLayout = d3.forceSimulation(label.nodes)
            .force("charge", d3.forceManyBody().strength(-500))
            .force("collide", d3.forceCollide().radius(10))
            .force("link", d3.forceLink(label.links).distance(50).strength(0.5));

        var graphLayout = d3.forceSimulation(graph.nodes)
            //.force("charge", d3.forceManyBody().strength(-30))
            //.force("center", d3.forceCenter(width / 2, height / 2))
            .force("collide", d3.forceCollide().radius(20))
            //.force("x", d3.forceX(width / 2).strength(0.01))
            //.force("y", d3.forceY(height / 2).strength(1))
            //.force("link", d3.forceLink(graph.links).id(function(d) {return d.id; }).distance(50).strength(1))
            .on("tick", ticked);


        var svg = d3.select("#physics").attr("width", width).attr("height", height);
        var container = svg.append("div");

        var node = container.append("div").attr("class", "nodes")
            .selectAll("div")
            .data(graph.nodes)
            .enter()
            .append("div")
            .style("position", "absolute")

        var labelNode = container.append("div").attr("class", "labelNodes")
            .selectAll("div")
            .data(label.nodes)
            .enter()
            .append("div")
            //.text(function (d, i) { return i % 2 == 0 ? "" : d.node.id; })
            .style("position", "absolute")
            .style("fill", "#555")
            //.style("font-family", "Arial")
            //.style("font-size", 12)
            .style("pointer-events", "none"); // to prevent mouseover/drag capture


        var link = container.append("g").attr("class", "links")
            .selectAll("line")
            .data(label.links)
            .enter()
            .append("line")
            .attr("stroke", "#aaa")
            .attr("stroke-width", "1px");

        this.link = link

        function ticked() {

            node.call(updateNode);
            link.call(updateLink);

            labelLayout.alphaTarget(0.3).restart();
            labelNode.each(function (d, i) {
                if (i % 2 == 0) {
                    d.x = d.node.x;
                    d.y = d.node.y;
                } else {
                    var b = { width: 172, height: 230 }

                    var diffX = d.x - d.node.x;
                    var diffY = d.y - d.node.y;

                    var dist = Math.sqrt(diffX * diffX + diffY * diffY);

                    var shiftX = b.width * (diffX - dist) / (dist * 2);
                    shiftX = Math.max(-b.width, Math.min(0, shiftX));
                    var shiftY = 16;
                    shiftY = b.height * (diffY - dist) / (dist * 2);
                    shiftY = Math.max(-b.height, Math.min(0, shiftY))
                    this.setAttribute("transform", "translate(" + shiftX + "," + shiftY + ")");

                    self.state.displayClusters[Math.floor(i / 2)].forceLabelPosition =
                        { x: d.x, y: d.y }
                    self.state.displayClusters[Math.floor(i / 2)].shiftX = shiftX
                    self.state.displayClusters[Math.floor(i / 2)].shiftY = shiftY

                    //self.state.displayClusters[Math.floor(i / 2)].forceLabelPosition = self.state.displayClusters[Math.floor(i / 2)].center

                }
            });

            self.setState({
                displayClusters: self.state.displayClusters
            })

            graphLayout.alphaTarget(0.3).restart();

            var k = 0.2 * this.alpha();

            node.each(function (o, i) {
                var center = self.worldToScreen(o.center)
                o.x += (center.x - o.x) * k;
                o.y += (center.y - o.y) * k;
            });

            labelNode.call(updateNode);

        }

        function updateLink(link) {
            link.attr("x1", function (d) { return fixna(d.source.x); })
                .attr("y1", function (d) { return fixna(d.source.y); })
                .attr("x2", function (d) { return fixna(d.target.x); })
                .attr("y2", function (d) { return fixna(d.target.y); });
        }

        function fixna(x) {
            if (isFinite(x)) return x;
            return 0;
        }


        function updateNode(node) {

            node.style("left", function (d) {
                return fixna(d.x) + "px"
            })
            node.style("top", function (d) {
                return fixna(d.y) + "px"
            })
        }
    }

    filterLines(algo, show) {
        this.segments.forEach((segment) => {
            if (segment.vectors[0].algo == algo) {
                segment.view.globalVisible = show


                segment.vectors.forEach((vector) => {
                    vector.visible = show
                })
            }
        })

        this.lines.update()
        this.particles.update()
    }



    setLineFilter(checked) {
        this.segments.forEach((segment) => {
            var show = checked[segment.vectors[0].line]
            segment.view.detailVisible = show
        })
        this.lines.update()
        this.particles.update()
    }


    updateXY() {
        this.particles.updatePosition()
        this.lines.updatePosition()
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
        if (this.lines != null) {
            this.lines.dispose(this.scene)
        }

        if (this.particles != null) {
            this.scene.remove(this.particles.mesh)
            this.particles.dispose()
        }

        if (this.renderer != null) {
            this.renderer.renderLists.dispose()
        }
    }


    startRendering(lastTime) {
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
            this.renderer.clear()
            this.renderer.render(this.scene, this.camera)
            this.renderer.render(this.pointScene, this.camera)

            var ctx = this.selectionRef.current.getContext('2d')
            ctx.clearRect(0, 0, this.getWidth(), this.getHeight(), 'white');
            this.selectionRef.current.setAttribute('width', this.getWidth())
            this.selectionRef.current.setAttribute('height', this.getHeight())

            this.renderLasso(ctx)
            this.renderLinks(ctx)
            this.renderEdge(ctx)
        } catch (e) {
        }
    }



    componentDidUpdate(prevProps, prevState) {
        // Path length range has changed, update view accordingly
        if (!arraysEqual(prevProps.pathLengthRange, this.props.pathLengthRange)) {
            // Set path length range on all segment views, and update them
            this.segments.forEach(segment => {
                segment.view.pathLengthRange = this.props.pathLengthRange
            })

            this.lines.update()
            this.particles.update()
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
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (var index = 0; index < points.length; index++) {
            var point = points[index];
            point = this.worldToScreen(point)
            if (index == 0) {
                ctx.moveTo(point.x, point.y);
            } else {
                ctx.lineTo(point.x, point.y);
            }
        }

        if (!this.lasso.drawing) {
            var conv = this.worldToScreen(points[0])
            ctx.lineTo(conv.x, conv.y);
        }

        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    renderLinks(ctx) {
        if (this.link) {
            ctx.setLineDash([]);
            ctx.strokeStyle = 'rgba(127, 127, 255, 0.7)';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
            ctx.lineWidth = 3;

            this.link.each((d, i) => {
                ctx.beginPath();
                ctx.arc(d.source.x, d.source.y, 5, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();

                ctx.beginPath();
                ctx.arc(d.target.x, d.target.y, 5, 0, 2 * Math.PI, false);
                ctx.fill();
                ctx.closePath();


                ctx.beginPath();
                ctx.moveTo(d.source.x, d.source.y)
                ctx.lineTo(d.target.x, d.target.y)
                ctx.stroke();
                ctx.closePath();
            })
        }
    }


    renderEdge(ctx) {
        if (this.trees) {

            ctx.setLineDash([]);
            ctx.strokeStyle = 'rgba(127, 127, 255, 0.7)';
            ctx.lineWidth = 10;

            ctx.beginPath()

            this.trees.forEach(tree => {
                tree.forEach((connection, i) => {
                    var a = this.edgeClusters[connection.source]
                    var b = this.edgeClusters[connection.target]


                    var p0 = this.worldToScreen(new Cluster(a.map(e => e.source)).getCenter())
                    var p1 = this.worldToScreen(new Cluster(a.map(e => e.target)).getCenter())
                    ctx.moveTo(p0.x, p0.y)
                    ctx.lineTo(p1.x, p1.y)


                    p0 = this.worldToScreen(new Cluster(b.map(e => e.source)).getCenter())
                    p1 = this.worldToScreen(new Cluster(b.map(e => e.target)).getCenter())
                    ctx.moveTo(p0.x, p0.y)
                    ctx.lineTo(p1.x, p1.y)
                })
            })

            ctx.stroke()
            ctx.closePath()
        }
    }

    render() {
        const containerStyle = {
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%",
            tabIndex: 0
        }

        return <div class="flex-grow-1 d-flex"
            style={{
                overflow: "hidden",
                position: "relative",
                cursor: this.props.tool,
                tabIndex: 1
            }}>

            <div id="container" style={containerStyle} ref={this.containerRef} tabIndex={0}>
                {
                    this.state.displayClusters.map(displayCluster => {
                        return <div
                            style={{
                                position: 'absolute',
                                left: displayCluster.forceLabelPosition.x,
                                top: displayCluster.forceLabelPosition.y,
                                transform: `translate(${displayCluster.shiftX.toFixed(1)}px, ${displayCluster.shiftY.toFixed(1)}px)`
                            }}
                        >

                            <GenericLegend
                                type={this.dataset.info.type}
                                vectors={displayCluster.points}
                                aggregate={true}
                            ></GenericLegend>

                        </div>
                    })
                }

                {
                    this.state.hoverCluster != null && this.props.tool == 'grab' ?
                        <div
                            className='speech-bubble-ds'
                            style={{
                                position: 'absolute',
                                right: this.getWidth() - this.worldToScreen(this.state.hoverCluster.getCenter(this.vectors)).x,
                                bottom: this.getHeight() - this.worldToScreen(this.state.hoverCluster.getCenter(this.vectors)).y - 10,
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
            <canvas id="selection" style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "100%",
                height: "100%",
                pointerEvents: 'none'
            }} ref={this.selectionRef}></canvas>

            <div id="physics" style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "100%",
                height: "100%",
                pointerEvents: 'none'
            }} ref={this.physicsRef}></div>


        </div>
    }
}



class EdgeOverlap {
    constructor(source, target, overlap) {
        this.source = source
        this.target = target
        this.overlap = overlap
    }
}