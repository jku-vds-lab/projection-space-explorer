import { IVector } from '../../../model/Vector';
export declare class Preprocessor {
    vectors: IVector[];
    constructor(vectors: any);
    /**
     * Returns an array of columns that are available in the vectors
     */
    getColumns(): string[];
    /**
     * Returns a unique array of distinct line values.
     */
    distinctLines(): any[];
    /**
     * Infers the multiplicity attribute for this dataset.
     */
    inferMultiplicity(): void;
    preprocess(ranges: any): any[];
}
//# sourceMappingURL=Preprocessor.d.ts.map