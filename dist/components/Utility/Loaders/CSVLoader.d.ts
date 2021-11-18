import { DatasetType } from "../../../model/DatasetType";
import { IVector } from "../../../model/Vector";
import { Loader } from "./Loader";
import { DatasetEntry } from "../../../model/DatasetEntry";
export declare class CSVLoader implements Loader {
    vectors: IVector[];
    datasetType: DatasetType;
    constructor();
    resolvePath(entry: DatasetEntry, finished: any): void;
    parseRange(str: any): {
        min: any;
        max: any;
        inferred: boolean;
    };
    resolveContent(content: any, finished: any): void;
    resolveVectors(vectors: any, finished: any): void;
    getFeatureType(x: any): "date" | "number" | "arbitrary";
    getClusters(vectors: IVector[], callback: any): void;
    resolve(finished: any, vectors: any, datasetType: any, entry: DatasetEntry): Promise<void>;
}
