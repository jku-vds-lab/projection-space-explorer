import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
import { PSEPlugin } from '../../components/Store/PSEPlugin';
import { Dataset } from '../../model/Dataset';
export declare class CoralPlugin extends PSEPlugin {
    type: DatasetType;
    createFingerprint(dataset: Dataset, vectors: IVector[], scale: number, aggregate: boolean): JSX.Element;
}
//# sourceMappingURL=CoralPlugin.d.ts.map