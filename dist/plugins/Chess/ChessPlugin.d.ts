import { IVector } from "../../model/Vector";
import { DatasetType } from "../../model/DatasetType";
import { PSEPlugin } from "../../components/Store/PluginScript";
export declare class ChessPlugin extends PSEPlugin {
    type: DatasetType;
    hasFileLayout(header: string[]): boolean;
    createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element;
}
