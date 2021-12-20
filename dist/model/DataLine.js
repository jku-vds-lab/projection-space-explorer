"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Main data class for lines
 */
class DataLine {
    constructor(lineKey, vectors) {
        this.lineKey = lineKey;
        this.vectors = vectors;
        this.__meta__ = new DataLineView();
    }
}
exports.DataLine = DataLine;
/**
 * View information for segments
 */
class DataLineView {
    constructor() {
        /**
         * Is this segment visible through the detailed selection? (line selection treeview)
         */
        this.detailVisible = true;
        /**
         * Is this segment visible through the global switch?
         */
        this.globalVisible = true;
        /**
         * Is this segment currently highlighted?
         */
        this.highlighted = false;
        /**
         * Color set for this line
         */
        this.intrinsicColor = null;
        /**
         * Line mesh
         */
        this.lineMesh = null;
    }
}
exports.DataLineView = DataLineView;
