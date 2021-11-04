import { IVector } from "../../model/Vector";
import { DatasetType } from "../../model/DatasetType";
import { PSEPlugin } from "../../components/Store/PluginScript";
export declare class CoralPlugin extends PSEPlugin {
    type: DatasetType;
    createFingerprint(vectors: IVector[], scale: number, aggregate: boolean): JSX.Element;
}
