import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
import { PSEPlugin } from '../../components/Store/PSEPlugin';
import { Dataset } from '../../model/Dataset';
export declare class ChessPlugin extends PSEPlugin {
    type: DatasetType;
    hasFileLayout(header: string[]): boolean;
    createFingerprint(dataset: Dataset, vectors: IVector[], scale: number, aggregate: boolean): JSX.Element;
}
//# sourceMappingURL=ChessPlugin.d.ts.map