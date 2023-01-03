import { DatasetType } from '../../../model/DatasetType';
import { IVector } from '../../../model/Vector';
/**
 * Object responsible for infering things from the data structure of a csv file.
 * For example this class can infer the
 * - ranges of columns
 * - type of data file (rubik, story...)
 */
export declare class InferCategory {
    vectors: IVector[];
    constructor(vectors: any);
    /**
     * Infers the type of the dataset from the columns
     * @param {*} header
     */
    inferType(): DatasetType.Rubik | DatasetType.Chess | DatasetType.Neural | DatasetType.Go | DatasetType.Story | DatasetType.Trrack | DatasetType.None | DatasetType.Sound;
}
//# sourceMappingURL=InferCategory.d.ts.map