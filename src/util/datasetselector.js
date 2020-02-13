import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DragAndDrop from './draganddrop';
import { LinearProgress, Typography, Divider } from '@material-ui/core';
import SvgIcon from '@material-ui/core/SvgIcon';
import MenuBookIcon from '@material-ui/icons/MenuBook';
import ListItemIcon from '@material-ui/core/ListItemIcon';
var d3v5 = require('d3')

const DEFAULT_LINE = "L"
const DEFAULT_ALGO = "all"



function parseRange(str) {
    var range = str.match(/-?\d+\.?\d*/g)
    return { min: range[0], max: range[1] }
}





class InferCategory {
    constructor(vectors, segments) {
        this.vectors = vectors
        this.segments = segments
    }

    /**
     * Infers the type of the dataset from the columns
     * @param {*} header 
     */
    inferType(header) {
        if (header.includes('up00') && header.includes('back00')) {
            return "rubik"
        }
        if (header.includes('cf00')) {
            return 'neural'
        }
        if (header.includes('a8')) {
            return 'chess'
        }
        if (header.includes('new_y')) {
            return 'story'
        }

        return 'none'
    }

    load(ranges) {
        if (this.vectors.length <= 0) {
            return []
        }

        var options = [
            {
                "category": "shape",
                "attributes": []
            },
            {
                "category": "size",
                "attributes": []
            },
            {
                "category": "transparency",
                "attributes": []
            },
            {
                "category": "color",
                "attributes": []
            }
        ]

        var header = Object.keys(this.vectors[0]).filter(a => a != "line")

        header.forEach(key => {
            // Check for given header key if its categorical, sequential or diverging
            var distinct = [... new Set(this.vectors.map(vector => vector[key]))]

            if (distinct.length > 8 || key in ranges) {
                // Check if values are numeric
                if (!distinct.find(value => isNaN(value))) {
                    // If we have a lot of different values, the values or probably sequential data
                    var category = options.find(e => e.category == "color")

                    var min = null, max = null

                    if (key in ranges) {
                        min = ranges[key].min
                        max = ranges[key].max
                    } else {
                        min = Math.min(...distinct)
                        max = Math.max(...distinct)
                    }

                    category.attributes.push({
                        "key": key,
                        "name": key,
                        "type": "sequential",
                        "range": {
                            "min": min,
                            "max": max
                        }
                    })

                    options.find(e => e.category == "transparency").attributes.push({
                        "key": key,
                        "name": key,
                        "type": "sequential",
                        "range": {
                            "min": min,
                            "max": max
                        },
                        "values": {
                            range: [0.3, 1.0]
                        }
                    })

                    options.find(e => e.category == "size").attributes.push({
                        "key": key,
                        "name": key,
                        "type": "sequential",
                        "range": {
                            "min": min,
                            "max": max
                        },
                        "values": {
                            range: [0.5, 1.5]
                        }
                    })
                }
            } else {
                if (distinct.find(value => isNaN(value)) || key == 'algo') {
                    options.find(e => e.category == 'color').attributes.push({
                        "key": key,
                        "name": key,
                        "type": "categorical"
                    })

                    if (distinct.length <= 4) {
                        var shapes = ["star", "cross", "circle", "square"]
                        options.find(e => e.category == 'shape').attributes.push({
                            "key": key,
                            "name": key,
                            "type": "categorical",
                            "values": distinct.map((value, index) => {
                                return {
                                    from: value,
                                    to: shapes[index]
                                }
                            })
                        })
                    }
                }
            }
        })

        return options
    }
}




export class DatasetDatabase {
    constructor() {
        this.data = [
            {
                display: "Minimal Example",
                path: "datasets/test/x_y.csv",
                type: "test"
            },
            {
                display: "Range Header",
                path: "datasets/test/rangeheader.csv",
                type: "test"
            },
            {
                display: "Chess: 190 Games",
                path: "datasets/chess/chess16k.csv",
                type: "chess"
            },
            {
                display: "Chess: 450 Games",
                path: "datasets/chess/chess40k.csv",
                type: "chess"
            },
            {
                display: "Rubik: 1x2 Different Origins",
                path: "datasets/rubik/cube1x2_different_origins.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 1x2 Same Origins",
                path: "datasets/rubik/cube1x2.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 5x2 Different Origins",
                path: "datasets/rubik/cube5x2_different_origins.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 5x2 Same Origins",
                path: "datasets/rubik/cube5x2.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 10x2 Different Origins",
                path: "datasets/rubik/cube10x2_different_origins.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 10x2 Same Origins",
                path: "datasets/rubik/cube10x2.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 100x2 Different Origins",
                path: "datasets/rubik/cube100x2_different_origins.csv",
                type: "rubik"
            },
            {
                display: "Rubik: 100x2 Same Origins",
                path: "datasets/rubik/cube100x2.csv",
                type: "rubik"
            },
            {
                display: "NN: Rnd Weights",
                path: "datasets/neural/random_weights.csv",
                type: "neural"
            },
            {
                display: "NN: Rnd Confusion Matrix",
                path: "datasets/neural/random_confmat.csv",
                type: "neural"
            },
            {
                display: "NN: Weights",
                path: "datasets/neural/learning_weights.csv",
                type: "neural"
            },
            {
                display: "NN: Confusion Matrix",
                path: "datasets/neural/learning_confmat.csv",
                type: "neural"
            },
            {
                display: "Stories: With Names",
                path: "datasets/story/withnames.csv",
                type: "story"
            }
        ]
    }

    getTypes() {
        return [... new Set(this.data.map(value => value.type))]
    }

    getByPath(path) {
        return this.data.filter(e => e.path == path)[0]
    }
}

export function loadFromPath(path, callback) {

    var entry = new DatasetDatabase().getByPath(path)

    // Load csv file
    d3v5.csv(path).then(vectors => {
        // Convert raw dictionaries to classes ...
        vectors = convertFromCSV(vectors)

        // Add missing attributes
        var ranges = preprocess(vectors)

        // Split vectors into segments
        var segments = getSegs(vectors)


        callback(new Dataset(vectors, segments, ranges, entry), new InferCategory(vectors, segments).load(ranges))
    })
}




var TypeIcon = ({ type }) => {
    switch (type) {
        case 'story':
            return <ListItemIcon><MenuBookIcon>
            </MenuBookIcon></ListItemIcon>
        case 'chess':
            return <ListItemIcon><SvgIcon viewBox="0 0 45 45">
                <g style={{ opacity: 1, fill: 'none', fillRule: 'evenodd', fillOpacity: 1, stroke: '#000000', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round', strokeMiterlimit: 4, strokeDasharray: 'none', strokeOpacity: 1 }}>
                    <g style={{ fill: '#000000', stroke: '#000000', strokeLinecap: 'butt' }}>
                        <path
                            d="M 9,36 C 12.39,35.03 19.11,36.43 22.5,34 C 25.89,36.43 32.61,35.03 36,36 C 36,36 37.65,36.54 39,38 C 38.32,38.97 37.35,38.99 36,38.5 C 32.61,37.53 25.89,38.96 22.5,37.5 C 19.11,38.96 12.39,37.53 9,38.5 C 7.646,38.99 6.677,38.97 6,38 C 7.354,36.06 9,36 9,36 z" />
                        <path
                            d="M 15,32 C 17.5,34.5 27.5,34.5 30,32 C 30.5,30.5 30,30 30,30 C 30,27.5 27.5,26 27.5,26 C 33,24.5 33.5,14.5 22.5,10.5 C 11.5,14.5 12,24.5 17.5,26 C 17.5,26 15,27.5 15,30 C 15,30 14.5,30.5 15,32 z" />
                        <path
                            d="M 25 8 A 2.5 2.5 0 1 1  20,8 A 2.5 2.5 0 1 1  25 8 z" />
                    </g>
                    <path
                        d="M 17.5,26 L 27.5,26 M 15,30 L 30,30 M 22.5,15.5 L 22.5,20.5 M 20,18 L 25,18"
                        style={{ fill: 'none', stroke: '#ffffff', strokeLinejoin: 'miter' }} />
                </g>
            </SvgIcon></ListItemIcon>
        default:
            return <div></div>
    }
}

export var DatasetList = ({ onChange }) => {
    var database = new DatasetDatabase()

    const [loading, setLoad] = React.useState(false)

    var handleClick = (path) => {
        loadFromPath(path, onChange)
    }

    var database = new DatasetDatabase()
    var types = database.getTypes()

    {

        return loading ?
            <Grid container direction="column" justify="center" alignItems="center" style={{ width: 600, height: 500 }}>
                <LinearProgress style={{ width: 500 }} />
            </Grid>
            :

            <Grid container direction="row" alignItems="center" justify="center" style={{ width: 600, padding: '32px' }}>
                <Grid item style={{ width: '50%' }} container direction="column">
                    <Typography variant={'h6'} align="center" style={{ margin: '12px 0px' }}>Preloaded Datasets</Typography>

                    <Grid item style={{ overflow: 'auto', height: 400, border: '1px solid gray' }}>
                        <List subheader={<li />} style={{ backgroundColor: 'white' }}>
                            {
                                types.map(type => (
                                    <li style={{ backgroundColor: 'inherit' }}>
                                        <ul style={{ backgroundColor: 'inherit', paddingInlineStart: '0px' }}>
                                            <ListSubheader>{type}</ListSubheader>
                                            {
                                                database.data.filter(value => value.type == type).map(entry => {
                                                    return <ListItem key={entry.path} value={entry.path} button onClick={() => {
                                                        setLoad(true)
                                                        handleClick(entry.path)
                                                    }
                                                    }>

                                                        <ListItemText primary={entry.display}></ListItemText>
                                                    </ListItem>
                                                })
                                            }
                                        </ul>
                                    </li>
                                ))
                            }

                        </List>
                    </Grid>

                </Grid>

                <Grid style={{ width: '50%' }} item>
                    <Typography variant={'h6'} align="center" style={{ margin: '12px 0px' }}>Custom Datasets</Typography>
                    <Grid container item alignItems="stretch" justify="center" direction="column" style={{ height: 400, padding: '30px' }}>
                        <DragAndDrop accept="image/*" handleDrop={(files) => {
                            if (files == null || files.length <= 0) {
                                return;
                            }

                            var file = files[0]

                            var reader = new FileReader()
                            reader.onload = (event) => {
                                var content = event.target.result


                                var vectors = d3v5.csvParse(content)

                                // Convert raw dictionaries to classes ...
                                vectors = convertFromCSV(vectors)

                                var ranges = preprocess(vectors)

                                var segments = getSegs(vectors)

                                var infer = new InferCategory(vectors, segments)

                                onChange(new Dataset(vectors, segments, ranges, { type: infer.inferType(Object.keys(vectors[0])) }), infer.load(ranges))
                            }
                            reader.readAsText(file)
                        }}>
                            <div style={{ height: 200 }}></div>
                        </DragAndDrop>
                    </Grid>

                </Grid>
            </Grid>
    }

}


function getSegs(vectors) {
    // Get a list of lines that are in the set
    var lineKeys = [... new Set(vectors.map(vector => vector.line))]


    var segments = lineKeys.map(lineKey => {
        return new DataLine({ vectors: vectors.filter(vector => vector.line == lineKey).sort((a, b) => a.age - b.age) })
    })


    return segments
}



function preprocess(vectors) {
    var header = Object.keys(vectors[0])

    var ranges = header.reduce((map, value) => {
        var matches = value.match(/\[-?\d+\.?\d* *; *-?\d+\.?\d*\]/)
        if (matches != null) {
            var cutHeader = value.substring(0, value.length - matches[0].length)
            vectors.forEach(vector => {
                vector[cutHeader] = vector[value]
                delete vector[value]
            })
            header[header.indexOf(value)] = cutHeader
            map[cutHeader] = parseRange(matches[0])
        }
        return map
    }, {})

    // If data contains no x and y attributes, its invalid
    if (header.includes("x") && header.includes("y")) {
        vectors.forEach(vector => {
            vector.x = +vector.x
            vector.y = +vector.y
        })
    }

    // If data contains no line attribute, add one
    if (!header.includes("line")) {
        // Add age attribute as index and line as DEFAULT_LINE
        vectors.forEach((vector, index) => {
            vector.line = DEFAULT_LINE
            if (!header.includes("age")) {
                vector.age = index
            }
        })
    } else if (header.includes("line") && !header.includes("age")) {
        var segs = {}
        var distinct = [... new Set(vectors.map(vector => vector.line))]
        distinct.forEach(a => segs[a] = 0)
        vectors.forEach(vector => {
            //vector.age = segs[vector.line]
            segs[vector.line] = segs[vector.line] + 1
        })
        var cur = {}
        distinct.forEach(a => cur[a] = 0)
        vectors.forEach(vector => {
            vector.age = cur[vector.line] / segs[vector.line]
            cur[vector.line] = cur[vector.line] + 1
        })
        ranges["age"] = { min: 0, max: 1 }
    }

    // If data has no algo attribute, add DEFAULT_ALGO
    if (!header.includes("algo")) {
        vectors.forEach(vector => {
            vector.algo = DEFAULT_ALGO
        })
    }


    vectors.forEach(function (d) { // convert strings to numbers
        if ("cubeNum" in d) {
            d.cubeNum = +d.cubeNum
        }
        if ("ep" in d) {
            d.cubeNum = +d.ep
        }


        if ("cp" in d) {
            d.cp = d.cp
        }

        if ("age" in d) {
            d.age = +d.age
        }

        // Attribute that specifies if this vector should be visible or not
        d.visible = true
    })

    return ranges
}


function convertFromCSV(vectors) {
    return vectors.map(vector => {
        return new Vect(vector)
    })
}


/**
 * Dataset class that holds all data, the ranges and additional stuff
 */
export class Dataset {
    constructor(vectors, segments, ranges, info) {
        this.vectors = vectors
        this.ranges = ranges
        this.segments = segments
        this.info = info

        this.calculateBounds()
    }

    /**
     * Calculates the dataset bounds for this set, eg the minimum and maximum x,y values
     * which is needed for the zoom to work correctly
     */
    calculateBounds() {
        var xAxis = this.vectors.map(vector => vector.x)
        var yAxis = this.vectors.map(vector => vector.x)

        var minX = Math.min(...xAxis)
        var maxX = Math.max(...xAxis)
        var minY = Math.min(...yAxis)
        var maxY = Math.max(...yAxis)

        var scaleBase = 100
        var absoluteMaximum = Math.max(Math.abs(minX), Math.abs(maxX), Math.abs(minY), Math.abs(maxY))

        this.bounds = {
            
            scaleBase: scaleBase,
            scaleFactor: absoluteMaximum / scaleBase,
            x: {
                min: minX,
                max: maxX
            },
            y: {
                min: minY,
                max: maxY
            }
        }
    }
}



/**
 * View information for segments
 */
export class DataLineView {
    /**
     * Determines if this line should be grayed out
     */
    grayed = false

    /**
     * Is this segment visible through the detailed selection? (line selection treeview)
     */
    detailVisible = true

    /**
     * Is this segment visible through the global switch?
     */
    globalVisible = true

    /**
     * Is this segment currently highlighted?
     */
    highlighted = false
}


/**
 * Main data class for lines
 */
export class DataLine {
    constructor(dict) {
        // Copy dictionary values to this object
        Object.keys(dict).forEach(key => {
            this[key] = dict[key]
        })

        this.__meta__ = {}

        this.setMeta('view', new DataLineView())
    }

    /**
     * Sets some meta data for a key
     */
    setMeta(key, value) {
        this.__meta__[key] = value
    }

    /**
     * Gets some meta data for a key
     */
    getMeta(key) {
        return this.__meta__[key]
    }

    /**
     * Getter for view details
     */
    get view() {
        return this.getMeta('view')
    }
}



/**
 * Main data class for points
 */
export class Vect {
    constructor(dict) {
        // Copy dictionary values to this object
        Object.keys(dict).forEach(key => {
            this[key] = dict[key]
        })

        this.__meta__ = {}
        this.setMeta('view', new VectView())
    }

    /**
     * Sets some meta data for a key
     */
    setMeta(key, value) {
        this.__meta__[key] = value
    }

    /**
     * Gets some meta data for a key
     */
    getMeta(key) {
        return this.__meta__[key]
    }

    /**
     * Getter for view details
     */
    get view() {
        return this.getMeta('view')
    }
}


/**
 * View information for a vector, this contains all attributes that are not data related, for
 * example the color or the index to the mesh vertex
 */
export class VectView {
    /**
     * Index to the vertice from three
     */
    meshIndex = -1

    /**
     * Is this vector selected?
     */
    selected = false

    /**
     * Set color for this vertice, if null the color of the line is taken
     */
    intrinsicColor = null

    constructor() {
    }
}