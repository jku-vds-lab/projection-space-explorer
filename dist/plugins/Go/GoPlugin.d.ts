import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
import { PSEPlugin } from '../../components/Store/PSEPlugin';
export declare class GoPlugin extends PSEPlugin {
    type: DatasetType;
    createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element;
}
