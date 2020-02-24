var meshes = require('./meshes')
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import IconButton from '@material-ui/core/IconButton';
import SettingsIcon from '@material-ui/icons/Settings';
import { makeStyles } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Grid from '@material-ui/core/Grid';
import { getDefaultZoom, arraysEqual, normalizeWheel } from './utilfunctions';
import { LassoSelection } from '../util/tools'
import { Vector3 } from 'three';


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
        this.mouseDown = false

        this.mouse = { x: 0, y: 0 }
        this.mouseDownPosition = { x: 0, y: 0 }
        this.initialMousePosition = null

        this.currentHover = null

        this.currentAggregation = []
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

    onMouseMove(event) {
        event.preventDefault();

        var coords = this.mouseToWorld(event)

        if (this.props.tool == 'default') {
            var mousePosition = new THREE.Vector2(event.clientX, event.clientY)

            if (this.initialMousePosition != null && this.initialMousePosition.distanceTo(mousePosition) > 30 && this.lasso == null && this.mouseDown) {
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
                        this.lines.highlight([this.vectors[idx].lineIndex], this.getWidth(), this.getHeight(), this.scene)
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

    }

    onMouseUp(event) {
        var test = this.mouseToWorld(event)

        if (this.props.tool == 'default') {
            if (this.lasso != null) {
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


                    var uniqueIndices = [...new Set(this.currentAggregation.map(vector => vector.lineIndex))]

                    this.lines.groupHighlight(uniqueIndices)
                    //this.lines.highlight(uniqueIndices, this.getWidth(), this.getHeight(), this.scene)

                    this.props.onAggregate(this.currentAggregation)

                } else if (wasDrawing) {
                    this.lasso = null
                    this.currentAggregation = []
                    this.lines.highlight([], this.getWidth(), this.getHeight(), this.scene)

                    this.lines.groupHighlight([])

                    this.vectors.forEach((vector, index) => {
                        vector.view.selected = false
                    })

                    this.props.onAggregate([])
                }

                this.lasso = null
            } else {
                if (this.currentHover != null) {
                    this.currentHover.view.selected = !this.currentHover.view.selected

                    if (this.currentAggregation.includes(this.currentHover) && !this.currentHover.view.selected) {
                        this.currentAggregation.splice(this.currentAggregation.indexOf(this.currentHover), 1)
                        this.props.onAggregate(this.currentAggregation)
                    } else if (!this.currentAggregation.includes(this.currentHover) && this.currentHover.view.selected) {
                        this.currentAggregation.push(this.currentHover)
                        this.props.onAggregate(this.currentAggregation)
                    }

                    var uniqueIndices = [...new Set(this.currentAggregation.map(vector => vector.lineIndex))]

                    this.lines.groupHighlight(uniqueIndices)
                }
            }
        }


        this.particles.update()
        this.mouseDown = false;
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

    getWidth() {
        return this.containerRef.current.offsetWidth
    }

    getHeight() {
        return this.containerRef.current.offsetHeight
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


    startRendering() {
        requestAnimationFrame(() => this.startRendering());

        try {
            this.renderer.clear()
            this.renderer.render(this.scene, this.camera)
            this.renderer.render(this.pointScene, this.camera)

            this.renderLasso()
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


    renderLasso() {
        var ctx = this.selectionRef.current.getContext('2d')
        ctx.clearRect(0, 0, this.getWidth(), this.getHeight(), 'white');


        if (this.lasso == null) return;

        var points = this.lasso.points

        if (points.length <= 1) {
            return;
        }
        this.selectionRef.current.setAttribute('width', this.getWidth())
        this.selectionRef.current.setAttribute('height', this.getHeight())




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


    render() {
        const containerStyle = {
            position: "absolute",
            top: "0px",
            left: "0px",
            width: "100%",
            height: "100%"
        }

        return <div class="flex-grow-1 d-flex"
            style={{
                overflow: "hidden",
                position: "relative",
                cursor: this.props.tool
            }}>
            <div id="container" style={containerStyle} ref={this.containerRef}>
            </div>
            <canvas id="selection" style={{
                position: "absolute",
                top: "0px",
                left: "0px",
                width: "100%",
                height: "100%",
                pointerEvents: 'none'
            }} ref={this.selectionRef}></canvas>

            <div style={{ position: 'absolute', top: '0px', left: '0px' }}>
                <SettingsPopover onChangeSlider={(ratio) => this.particles.setPointScaling(ratio)}></SettingsPopover>
            </div>


        </div>
    }
}