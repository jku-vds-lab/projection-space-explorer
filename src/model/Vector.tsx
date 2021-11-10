import { Shapes } from "../components/WebGLView/meshes";
import { TypedObject } from "./TypedObject";
import { ObjectTypes } from "./ObjectType";

/**
 * Vector type.
 */
export interface IVector extends TypedObject {
    x: number;
    y: number;

    // cluster label and probability
    groupLabel: any[];

    // assigned line
    line: any;

    // number of occurences of this vector
    multiplicity: number;

    // algorithm (category)
    algo: any;

    // age (generated)
    age: number;

    __meta__: VectView;
}




/**
 * Vector methods.
 */
export class AVector {
    static create(dict): IVector {
        let vect = {}

        // Copy dictionary values to this object
        Object.keys(dict).forEach(key => {
            vect[key] = dict[key];
        });

        vect['__meta__'] = new VectView()
        vect['objectType'] = ObjectTypes.Vector

        return vect as IVector
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


    // is this sample filtered out in lineup
    lineUpFiltered: boolean = false

    constructor() {
    }
}




/**
 * Vector type guard.
 */
export function isVector(object: TypedObject): object is IVector {
    return object && object.objectType === ObjectTypes.Vector
}