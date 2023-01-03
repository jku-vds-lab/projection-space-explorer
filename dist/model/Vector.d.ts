import { Shapes } from '../components/WebGLView/Shapes';
import { TypedObject } from './TypedObject';
/**
 * Vector type.
 */
export interface IVector extends TypedObject {
    x: number;
    y: number;
    groupLabel: any[];
    line: any;
    multiplicity: number;
    algo: any;
    age: number;
    __meta__: VectView;
}
/**
 * Vector methods.
 */
/**
 * View information for a vector, this contains all attributes that are not data related, for
 * example the color or the index to the mesh vertex
 */
export declare class VectView {
    /**
     * Index to the vertice from three
     */
    meshIndex: number;
    /**
     * Is this vector selected?
     */
    selected: boolean;
    /**
     * The segment index this vector belongs to.
     */
    lineIndex: any;
    /**
     * Index of sequence from 0 to n, this is needed because the key for the line might be sortable, but not numeric
     */
    sequenceIndex: number;
    /**
     * Set color for this vertice, if null the color of the line is taken
     */
    intrinsicColor: any;
    /**
     * Is this vector visible?
     */
    visible: boolean;
    /**
     * Currently displayed shape of the vector.
     */
    shapeType: Shapes;
    highlighted: boolean;
    duplicateOf: any;
    brightness: number;
    lineUpFiltered: boolean;
}
/**
 * Vector type guard.
 */
export declare function isVector(object: TypedObject): object is IVector;
export declare class AVector {
    static create(dict: any): IVector;
}
//# sourceMappingURL=Vector.d.ts.map