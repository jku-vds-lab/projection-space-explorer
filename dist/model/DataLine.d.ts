import { IVector } from './Vector';
/**
 * View information for segments
 */
export declare class DataLineView {
    /**
     * Is this segment visible through the detailed selection? (line selection treeview)
     */
    detailVisible: boolean;
    /**
     * Is this segment visible through the global switch?
     */
    globalVisible: boolean;
    /**
     * Is this segment currently highlighted?
     */
    highlighted: boolean;
    /**
     * Color set for this line
     */
    intrinsicColor: any;
    /**
     * Line mesh
     */
    lineMesh: any;
}
/**
 * Main data class for lines
 */
export declare class DataLine {
    lineKey: any;
    vectors: IVector[];
    __meta__: DataLineView;
    constructor(lineKey: any, vectors: any);
}
//# sourceMappingURL=DataLine.d.ts.map