import { IVect } from "./Vect";

/**
 * Main data class for lines
 */


export class DataLine {
    lineKey: any;
    vectors: IVect[];
    __meta__: DataLineView;

    constructor(lineKey, vectors) {
        this.lineKey = lineKey;
        this.vectors = vectors;

        this.__meta__ = new DataLineView();
    }
}






/**
 * View information for segments
 */
export class DataLineView {

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
}