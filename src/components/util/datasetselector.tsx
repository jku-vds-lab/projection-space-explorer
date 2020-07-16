import { Shapes } from "../WebGLView/meshes"

var d3v5 = require('d3')

const DEFAULT_LINE = "L"
const DEFAULT_ALGO = "all"












/**
 * Dummy class that holds information about the files that can be preselected.
 */
export class DatasetDatabase {
    data: { display: string, path: string, type: string }[]

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
                display: "Chess: AlphaZero vs Stockfish",
                path: "datasets/chess/alphazero.csv",
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
                display: "Story: With Names",
                path: "datasets/story/withnames.csv",
                type: "story"
            },
            {
                display: "Story: No Duplicates",
                path: "datasets/story/stories_dup-del_p50_with-names.csv",
                type: "story"
            },
            {
                display: "Story: Test",
                path: "datasets/story/teststories.csv",
                type: "story"
            },
            {
                display: "Go: State features",
                path: "datasets/go/combined.csv",
                type: "go"
            },
            {
                display: "Go: Histogram features",
                path: "datasets/go/histogram.csv",
                type: "go"
            },
            {
                display: "Go: Move features (wavelet)",
                path: "datasets/go/move_wavelet.csv",
                type: "go"
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

















/**
 * Parses a range string and returns an object containing min and max values.
 * eg "[min;max]""
 * @param {*} str the range string
 */
function parseRange(str) {
    var range = str.match(/-?\d+\.?\d*/g)
    return { min: range[0], max: range[1] }
}




/**
 * Class that preprocesses the data set and checks for validity.
 * Will halucinate attributes like x, y, line, algo and multiplicity if
 * they are not present.
 */
export class Preprocessor {
    vectors: Vect[]

    constructor(vectors) {
        this.vectors = vectors
    }

    /**
     * Returns an array of columns that are available in the vectors
     */
    getColumns() {
        var vector = this.vectors[0]
        return Object.keys(vector).filter(e => e != '__meta__')
    }

    /**
     * Returns a unique array of distinct line values.
     */
    distinctLines() {
        return [... new Set(this.vectors.map(vector => vector.line))]
    }

    /**
     * Infers the multiplicity attribute for this dataset.
     */
    inferMultiplicity() {
        if (this.getColumns().includes('multiplicity')) {
            return;
        }

        // Build line pools
        var linePools = {}
        this.distinctLines().forEach(line => {
            // Dictionary holding the x/y values of the line
            linePools[line] = {}
        })

        // Builds x attributes for linepools
        this.vectors.forEach(vector => {
            linePools[vector.line][vector.x] = {}
        })

        var distinctLines = this.distinctLines()
        // Count multiplicities
        this.vectors.forEach(vector => {
            distinctLines.forEach(line => {
                if (linePools[line][vector.x] != null) {
                    if (linePools[line][vector.x][vector.y] == null) {
                        linePools[line][vector.x][vector.y] = 1
                    } else {
                        linePools[line][vector.x][vector.y] = linePools[line][vector.x][vector.y] + 1
                    }
                }
            })
        })


        // Apply multiplicities
        this.vectors.forEach(vector => {
            vector.multiplicity = linePools[vector.line][vector.x][vector.y]
        })
    }


    preprocess() {


        this.inferMultiplicity()

        var vectors = this.vectors
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
        } else {
            // In case we are missing x and y columns, we can just generate a uniformly distributed point cloud
            vectors.forEach(vector => {
                vector.x = (Math.random() - 0.5) * 100
                vector.y = (Math.random() - 0.5) * 100
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
            if ("age" in d) {
                d.age = +d.age
            }
        })

        // If data has no cluster labels, add default ones
        if (!header.includes('clusterLabel')) {
            vectors.forEach(vector => {
                vector.clusterLabel = -1
                vector.clusterProbability = 0.0
            })
        }


        return ranges
    }
}




export function loadFromPath(path, callback) {

    var entry = new DatasetDatabase().getByPath(path)

    // Load csv file
    d3v5.csv(path).then(vectors => {
        // Convert raw dictionaries to classes ...
        vectors = convertFromCSV(vectors)

        // Add missing attributes
        var ranges = new Preprocessor(vectors).preprocess()

        // Split vectors into segments
        var segments = getSegs(vectors)


        callback(new Dataset(vectors, segments, ranges, entry), new InferCategory(vectors, segments).load(ranges))
    })
}



/**
 * Object responsible for infering things from the data structure of a csv file.
 * For example this class can infer the
 * - ranges of columns
 * - type of data file (rubik, story...)
 */
export class InferCategory {
    vectors: Vect[]
    segments: DataLine[]

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
        if (header.includes('aa')) {
            return 'go'
        }

        return 'none'
    }



    /**
     * Infers an array of attributes that can be filtered after, these can be
     * categorical, sequential or continuous attribues.
     * @param {*} ranges 
     */
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

            if (distinct.length > 8 || key in ranges || key == 'multiplicity') {
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
                            range: [1, 2]
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














export function getSegs(vectors) {
    // Get a list of lines that are in the set
    var lineKeys = [... new Set(vectors.map(vector => vector.line))]


    var segments = lineKeys.map(lineKey => {
        var l = new DataLine(lineKey, vectors.filter(vector => vector.line == lineKey).sort((a, b) => a.age - b.age))
        // Set segment of vectors
        l.vectors.forEach((v, vi) => {
            v.view.segment = l
            v.view.sequenceIndex = vi
        })
        return l
    })



    return segments
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
    vectors: Vect[]
    segments: DataLine[]
    bounds: { x, y, scaleBase, scaleFactor }
    ranges: any
    info: any
    columns: any

    constructor(vectors, segments, ranges, info) {
        this.vectors = vectors
        this.ranges = ranges
        this.segments = segments
        this.info = info
        this.columns = {}

        this.calculateBounds()
        this.calculateColumnTypes()
    }

    /**
     * Creates a map which shows the distinct types and data types of the columns.
     */
    calculateColumnTypes() {
        var columnNames = Object.keys(this.vectors[0])
        columnNames.forEach(columnName => {
            this.columns[columnName] = {}

            // Check data type
            if (this.vectors.find(vector => isNaN(vector[columnName]))) {
                this.columns[columnName].distinct = Array.from(new Set([... this.vectors.map(vector => vector[columnName])]))
                this.columns[columnName].isNumeric = false
            } else {
                this.columns[columnName].isNumeric = true
            }
        })
    }


    /**
     * Returns an array of columns that are available in the vectors
     */
    getColumns() {
        var vector = this.vectors[0]
        return Object.keys(vector).filter(e => e != '__meta__')
    }

    /**
     * Returns true if the dataset contains the column.
     */
    hasColumn(column) {
        return this.getColumns().find(e => e == column) != undefined
    }


    /**
     * Returns the vectors in this dataset as a 2d array, which
     * can be used as input for tsne for example.
     */
    asTensor(columns) {
        var tensor = []

        function oneHot(n, length) {
            var arr = new Array(length).fill(0)
            arr[n] = 1
            return arr
        }

        this.vectors.forEach(vector => {
            var data = []
            columns.forEach(column => {
                if (this.columns[column].isNumeric) {
                    // Numeric data can just be appended to the array
                    data.push(+vector[column])
                } else {
                    // Not numeric data can be converted using one-hot encoding
                    data = data.concat(oneHot(this.columns[column].distinct.indexOf(vector[column]), this.columns[column].distinct.length))

                }
            })
            tensor.push(data)
        })

        return tensor
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

    /**
     * Calculates the maximum path length for this dataset.
     */
    getMaxPathLength() {
        return Math.max(... this.segments.map(segment => segment.vectors.length))
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

    /**
     * Color set for this line
     */
    intrinsicColor = null

    /**
     * Line mesh
     */
    lineMesh = null

    pathLengthRange: any

}


/**
 * Main data class for lines
 */
export class DataLine {
    lineKey: any
    vectors: Vect[]
    __meta__: any

    constructor(lineKey, vectors) {
        this.lineKey = lineKey
        this.vectors = vectors

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
        return this.getMeta('view') as DataLineView
    }
}

/**
 * Main data class for points
 */
export class Vect {
    // x, y coordinates
    x: number
    y: number

    // cluster label and probability
    clusterLabel: any
    clusterProbability: number

    // assigned line
    line: any

    // number of occurences of this vector
    multiplicity: number

    // algorithm (category)
    algo: any

    // age (generated)
    age: number

    __meta__: any

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
        return this.getMeta('view') as VectView
    }


    pureValues() {
        var keys = this.pureHeader()
        return keys.map(key => this[key])
    }

    pureHeader() {
        return Object.keys(this).filter(value => value != '__meta__')
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
     * The segment index this vector belongs to.
     */
    lineIndex: any


    /**
     * The segment reference this vector belongs to.
     */
    segment: DataLine = null

    /**
     * Index of sequence from 0 to n, this is needed because the key for the line might be sortable, but not numeric
     */
    sequenceIndex = -1


    /**
     * Set color for this vertice, if null the color of the line is taken
     */
    intrinsicColor = null

    /**
     * Is this vector visible?
     */
    visible = true

    /**
     * Currently displayed shape of the vector.
     */
    shapeType = Shapes.Circle

    /**
     * Base size scaling for this point
     */
    baseSize: number = 16

    highlighted = false

    

    constructor() {
    }
}





/**
 * A class representing a single edge of a DataLine. It has 2 points
 * and specifies the direction of this line part.
 */
export class DataEdge {
    source: any
    target: any
    view: any


    constructor(source, target) {
        this.source = source
        this.target = target

        this.view = {}
    }
}




/**
 * Helper class for structured dictionary data.
 * { key1: [], key2: [] ... }
 */
export class MultiDictionary {
    data: any[]
    lookup: any

    constructor() {
        this.data = []
        this.lookup = {}
    }

    insert(key, value) {
        if (key in this.lookup) {
            // If key is in lookup, add value to array
            this.data[this.lookup[key]].push(value)
        } else {
            // If key is not in lookup, store lookup index and add array
            this.lookup[key] = this.data.length
            this.data.push([ value ])
        }
    }

    /**
     * Matrix representation is just the data array.
     */
    toMatrix() {
        return this.data
    }
}