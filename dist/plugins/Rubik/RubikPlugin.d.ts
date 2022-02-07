import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
import { PSEPlugin } from '../../components/Store/PSEPlugin';
export declare class RubikPlugin extends PSEPlugin {
    type: DatasetType;
    hasFileLayout(header: string[]): boolean;
    createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element;
}
