"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const meshes_1 = require("../components/WebGLView/meshes");
const ObjectType_1 = require("./ObjectType");
/**
 * Vector methods.
 */
class AVector {
    static create(dict) {
        let vect = {};
        // Copy dictionary values to this object
        Object.keys(dict).forEach(key => {
            vect[key] = dict[key];
        });
        vect['__meta__'] = new VectView();
        vect['objectType'] = ObjectType_1.ObjectTypes.Vector;
        return vect;
    }
}
exports.AVector = AVector;
/**
 * View information for a vector, this contains all attributes that are not data related, for
 * example the color or the index to the mesh vertex
 */
class VectView {
    constructor() {
        /**
         * Index to the vertice from three
         */
        this.meshIndex = -1;
        /**
         * Is this vector selected?
         */
        this.selected = false;
        /**
         * Index of sequence from 0 to n, this is needed because the key for the line might be sortable, but not numeric
         */
        this.sequenceIndex = -1;
        /**
         * Set color for this vertice, if null the color of the line is taken
         */
        this.intrinsicColor = null;
        /**
         * Is this vector visible?
         */
        this.visible = true;
        /**
         * Currently displayed shape of the vector.
         */
        this.shapeType = meshes_1.Shapes.Circle;
        /**
         * Base size scaling for this point
         */
        this.baseSize = 16;
        this.highlighted = false;
        this.duplicateOf = null;
        // Brightness value of this sample.
        this.brightness = 1.0;
        // is this sample filtered out in lineup
        this.lineUpFiltered = false;
    }
}
exports.VectView = VectView;
/**
 * Vector type guard.
 */
function isVector(object) {
    return object && object.objectType === ObjectType_1.ObjectTypes.Vector;
}
exports.isVector = isVector;
