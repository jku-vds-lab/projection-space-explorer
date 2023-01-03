import { Loader } from './Loader';
import { DatasetType } from '../../../model/DatasetType';
import { IVector } from '../../../model/Vector';
export declare class JSONLoader implements Loader {
    vectors: IVector[];
    datasetType: DatasetType;
    resolvePath(entry: any, finished: any): void;
    resolveContent(content: any, finished: any): void;
    inferRangeForAttribute(key: string): {
        min: number;
        max: number;
    };
    parseRange(str: any): {
        min: number;
        max: number;
        inferred: boolean;
    };
    getFeatureType(x: any): "number" | "date" | "arbitrary";
    resolve(content: any, finished: any, datasetType: any, entry: any): Promise<void>;
}
//# sourceMappingURL=JSONLoader.d.ts.map