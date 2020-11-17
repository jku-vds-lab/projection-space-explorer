import { Shapes } from "../../WebGLView/meshes";
import { DataLine } from "./DataLine";

/**
 * Main data class for points
 */



export class Vect {
    x: number;
    y: number;

    // cluster label and probability
    clusterLabel: any;
    clusterProbability: number;

    // assigned line
    line: any;

    // number of occurences of this vector
    multiplicity: number;

    // algorithm (category)
    algo: any;

    // age (generated)
    age: number;

    __meta__: any;

    constructor(dict) {
        // Copy dictionary values to this object
        Object.keys(dict).forEach(key => {
            this[key] = dict[key];
        });

        this.__meta__ = {};
        this.setMeta('view', new VectView());
    }

    /**
     * Sets some meta data for a key
     */
    setMeta(key, value) {
        this.__meta__[key] = value;
    }

    /**
     * Gets some meta data for a key
     */
    getMeta(key) {
        return this.__meta__[key];
    }

    /**
     * Getter for view details
     */
    get view() {
        return this.getMeta('view') as VectView;
    }


    pureValues() {
        var keys = this.pureHeader();
        return keys.map(key => this[key]);
    }

    pureHeader() {
        return Object.keys(this).filter(value => value != '__meta__');
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