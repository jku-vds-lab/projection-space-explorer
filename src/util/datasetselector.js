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
import { LinearProgress } from '@material-ui/core';
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

    inferType(header) {
        if (header.includes('up00') && header.contains('back00')) {
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

    loadLine(ranges) {

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

            if (distinct.length > 8) {
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
                display: "Minimal X,Y",
                path: "datasets/test/x_y.csv",
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
                display: "Stories: All",
                path: "datasets/story/all.csv",
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

export function testFromPath(path, callback) {
    var entry = new DatasetDatabase().getByPath(path)

    d3v5.csv(path).then(vectors => {
        // Add missing attributes
        var ranges = preprocess(vectors)

        // Split vectors into segments
        var segments = getSegs(vectors)


        callback(new Dataset(vectors, segments, ranges, entry), new InferCategory(vectors, segments).load(ranges))
        // Load json file if present
        d3.json(`datasets/${entry.type}/meta.json`).then(categories => {
            //callback(new Dataset(vectors, segments, ranges, entry), categories)
        }).catch(() => {
            //callback(new Dataset(vectors, segments, ranges, entry), "")
        })
    })
}

export function loadFromPath(path, callback) {

    var entry = new DatasetDatabase().getByPath(path)

    // Load csv file
    d3v5.csv(path).then(vectors => {
        // Add missing attributes
        var ranges = preprocess(vectors)

        // Split vectors into segments
        var segments = getSegs(vectors)


        callback(new Dataset(vectors, segments, ranges, entry), new InferCategory(vectors, segments).load(ranges))
        // Load json file if present
        d3.json(`datasets/${entry.type}/meta.json`).then(categories => {
            //callback(new Dataset(vectors, segments, ranges, entry), categories)
        }).catch(() => {
            //callback(new Dataset(vectors, segments, ranges, entry), "")
        })
    })
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
            <Grid container direction="column" justify="center" alignItems="center" style={{ width: 600, height: 400 }}>
                <LinearProgress style={{ width: 500 }} />
            </Grid>
            :
            <Grid container direction="row" justify="center" alignItems="center" style={{ width: 600, height: 400 }}>
                <Grid item style={{ width: '50%', maxHeight: 400, overflow: 'auto' }}>
                    <List subheader={<li />} style={{ backgroundColor: 'white' }}>
                        {
                            types.map(type => (
                                <li style={{ backgroundColor: 'inherit' }}>
                                    <ul style={{ backgroundColor: 'inherit' }}>
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
                <Grid style={{ width: '50%', padding: '0 30px' }} item container justify="center" alignItems="stretch" direction="column">
                    <DragAndDrop accept="image/*" handleDrop={(files) => {
                        if (files == null || files.length <= 0) {
                            return;
                        }

                        var file = files[0]

                        var reader = new FileReader()
                        reader.onload = (event) => {
                            var content = event.target.result


                            var vectors = d3v5.csvParse(content)

                            var ranges = preprocess(vectors)

                            var segments = getSegs(vectors)

                            onChange(new Dataset(vectors, segments, ranges, { type: "none" }), "")
                        }
                        reader.readAsText(file)
                    }}>
                        <div style={{ height: 200 }}></div>
                    </DragAndDrop>
                </Grid>
            </Grid>
    }

}

export class DatasetSelector extends React.Component {
    constructor(props) {
        super(props)

        this.handleChange = this.handleChange.bind(this);
        this.database = new DatasetDatabase()

        this.state = { value: this.database.data[0].path }
    }

    handleChange(event) {
        this.setState({ value: event.target.value })

        loadFromPath(event.target.value, this.props.onChange)
    }


    init(path) {
        this.setState({ value: path })

        loadFromPath(path, this.props.onChange)
    }

    loadFileContent(content) {

    }

    render() {
        return <Grid
            container
            item
            alignItems="stretch"
            direction="column"
            style={{ padding: '0 16px' }}>

            <Grid container item alignItems="stretch" direction="column">
                <FormControl>
                    <InputLabel id="demo-simple-select-placeholder-label-label">Select Predefined</InputLabel>
                    <Select labelId="demo-simple-select-label"
                        id="demo-simple-select"

                        value={this.state.value}
                        onChange={this.handleChange}>

                        {this.database.data.map(entry => {
                            return <MenuItem value={entry.path}>{entry.display}</MenuItem>
                        })}
                    </Select>
                </FormControl>
            </Grid>

            <Grid container item>
                <input
                    style={{ width: '100%' }}
                    accept="image/*"
                    id="raised-button-file"
                    multiple
                    type="file"
                    onChange={(e) => {
                        var files = e.target.files
                        if (files == null || files.length <= 0) {
                            return;
                        }

                        var file = files[0]

                        var reader = new FileReader()
                        reader.onload = (event) => {
                            var content = event.target.result


                            var vectors = d3v5.csvParse(content)

                            var ranges = preprocess(vectors)

                            var segments = getSegs(vectors)


                            var infer = new InferCategory(vectors, segments)
                            this.props.onChange(new Dataset(vectors, segments, ranges, { type: infer.inferType(Object.keys(vectors[0])) }), infer.load(ranges))
                        }
                        reader.readAsText(file)
                    }}
                />
            </Grid>
        </Grid>
    }
}



function getSegs(vectors) {
    // Get a list of lines that are in the set
    var lineKeys = [... new Set(vectors.map(vector => vector.line))]

    var segments = lineKeys.map(lineKey => {
        return { vectors: vectors.filter(vector => vector.line == lineKey).sort((a, b) => a.age - b.age) }
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




export class Dataset {
    constructor(vectors, segments, ranges, info) {
        this.vectors = vectors
        this.ranges = ranges
        this.segments = segments
        this.info = info
    }
}