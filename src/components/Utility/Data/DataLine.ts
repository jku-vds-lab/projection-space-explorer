import { Vect } from "./Vect";

/**
 * Main data class for lines
 */


export class DataLine {
    lineKey: any;
    vectors: Vect[];
    __meta__: any;

    constructor(lineKey, vectors) {
        this.lineKey = lineKey;
        this.vectors = vectors;

        this.__meta__ = {};

        this.setMeta('view', new DataLineView());
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
        return this.getMeta('view') as DataLineView;
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