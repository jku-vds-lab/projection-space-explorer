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
var d3v5 = require('d3')

const DEFAULT_LINE = "L"
const DEFAULT_ALGO = "all"





class InferCategory {
    constructor(vectors) {
        this.vectors = vectors
    }

    load() {
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

        var header = Object.keys(this.vectors[0]).filter(a => !(a in [ "x", "y", "line" ]))
        header.forEach(key => {
            // Check for given header key if its categorical, sequential or diverging
            var distinct = [... new Set(this.vectors.map(vector => vector[key]))]
            if (distinct.length > 8) {
                // Check if values are numeric
                if (!distinct.find(value => isNaN(value))) {
                    // If we have a lot of different values, the values or probably sequential data
                    var category = options.find(e => e.category == "color")

                    var min = Math.min(...distinct)
                    var max = Math.max(...distinct)

                    category.attributes.push({
                        "key": key,
                        "name": key,
                        "type": "sequential",
                        "range": {
                            "min": min,
                            "max": max
                        }
                    })
                }
            } else {
                if (distinct.find(value => isNaN(value))) {
                    options.find(e => e.category == 'color').attributes.push({
                        "key": key,
                        "name": key,
                        "type": "categorical"
                    })

                    
                }
            }
        })
        console.log(options)

        return options
    }
}




class DatasetDatabase {
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

    getByPath(path) {
        return this.data.filter(e => e.path == path)[0]
    }
}



function loadFromPath(path, callback) {
    var entry = new DatasetDatabase().getByPath(path)

    // Load csv file
    d3v5.csv(path).then(vectors => {
        // Add missing attributes
        preprocess(vectors)

        // Split vectors into segments
        var segments = getSegs(vectors)

        // Load json file if present
        d3.json(`datasets/${entry.type}/meta.json`).then(categories => {
            callback(vectors, segments, categories, entry)
        }).catch(() => {
            callback(vectors, segments, "", entry)
        })
    })
}



export var DatasetList = ({ onChange }) => {
    var database = new DatasetDatabase()

    var handleClick = (path) => {
        loadFromPath(path, onChange)
    }

    return <Grid container direction="row" justify="center" alignItems="center">
        <List>
            {database.data.map(entry => {
                return <ListItem key={entry.path} value={entry.path} button onClick={() => handleClick(entry.path)}>
                    <ListItemText primary={entry.display}></ListItemText>
                </ListItem>
            })}
        </List>
        <input
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

                    preprocess(vectors)

                    var segments = getSegs(vectors)

                    onChange(vectors, segments, "", { type: "none" })
                }
                reader.readAsText(file)
            }}
        />
    </Grid>
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
            justify="center"
            alignItems="stretch"
            direction="column">
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

            <input
                accept="image/*"
                id="raised-button-file"
                multiple
                type="file"
                onChange={(e) => {
                    console.log("file selected")
                    var files = e.target.files
                    if (files == null || files.length <= 0) {
                        return;
                    }

                    var file = files[0]

                    var reader = new FileReader()
                    reader.onload = (event) => {
                        var content = event.target.result


                        var vectors = d3v5.csvParse(content)

                        preprocess(vectors)

                        var segments = getSegs(vectors)



                        this.props.onChange(vectors, segments, new InferCategory(vectors).load(), { type: "none" })
                    }
                    reader.readAsText(file)
                }}
            />
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

    // If data contains no x and y attributes, its invalid
    if (header.includes("x") && header.includes("y")) {
        vectors.forEach(vector => {
            vector.x = +vector.x
            vector.y = +vector.y
        })
    } else {

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
            vector.age = segs[vector.line]
            segs[vector.line] = segs[vector.line] + 1
        })
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

}