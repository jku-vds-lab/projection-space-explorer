import { DatasetType } from '../../../model/DatasetType';
import { IVector } from '../../../model/Vector';
import { Dataset } from '../../../model/Dataset';
import { Loader } from './Loader';
import { DatasetEntry } from '../../../model/DatasetEntry';
export declare class CSVLoader implements Loader {
    vectors: IVector[];
    datasetType: DatasetType;
    resolvePath(entry: DatasetEntry, finished: any): void;
    parseRange(str: any): {
        min: any;
        max: any;
        inferred: boolean;
    };
    resolveContent(content: any, finished: any): void;
    resolveVectors(vectors: any, finished: any): void;
    getFeatureType(x: any): "number" | "date" | "arbitrary";
    getClusters(vectors: IVector[], callback: any): void;
    resolve(finished: any, vectors: any, datasetType: any, entry: DatasetEntry, p_metaInformation?: any): Promise<Dataset>;
}
//# sourceMappingURL=CSVLoader.d.ts.map