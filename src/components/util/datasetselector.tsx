import { Shapes } from "../WebGLView/meshes"

var d3v5 = require('d3')

const DEFAULT_LINE = "L"
export const DEFAULT_ALGO = "all"






export enum PrebuiltFeatures {
    Line = 'line'
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

export enum DatasetType {
    Rubik,
    Chess,
    Neural,
    Go,
    Test,
    Story,
    Coral,
    None
}

export enum FeatureType {
    Categorical,
    Quantitative,
    Date
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

export type VectorType = {
    x: number
    y: number
}

/**
 * Math class for vector calculations.
 */
export class VectBase implements VectorType {
    x: number
    y: number

    constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    lerp(v: VectorType, alpha: number) {
        this.x += (v.x - this.x) * alpha
        this.y += (v.y - this.y) * alpha

        return this
    }

    angle() {
        return Math.atan2(- this.y, - this.x) + Math.PI;
    }

    multiplyScalar(scalar) {
        this.x *= scalar;
        this.y *= scalar;

        return this;
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    divideScalar(scalar) {
        return this.multiplyScalar(1 / scalar);
    }

    normalize() {
        return this.divideScalar(this.length() || 1);
    }

    static subtract(a, b) {
        return new VectBase(a.x - b.x, a.y - b.y)
    }

    static add(a, b) {
        return new VectBase(a.x + b.x, a.y + b.y)
    }
}



/**
 * Main data class for points
 */
export class Vect {
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


    duplicateOf = null

    // Brightness value of this sample.
    brightness = 1.0

    // Is this point grayed out
    // If this value is null the grayed value will be taken from the segment
    grayed = null

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
            this.data.push([value])
        }
    }

    /**
     * Matrix representation is just the data array.
     */
    toMatrix() {
        return this.data
    }
}