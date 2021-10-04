import { DatasetType } from "../../../model/DatasetType";
import { IVector } from "../../../model/Vector";
import { Loader } from "./Loader";
export declare class SDFLoader implements Loader {
    vectors: IVector[];
    datasetType: DatasetType;
    loading_area: string;
    constructor();
    resolvePath(entry: any, finished: any, cancellablePromise?: any, modifiers?: string, abort_controller?: any): void;
    resolveContent(file: any, finished: any, cancellablePromise?: any, modifiers?: string, controller?: any): void;
    loadCSV(finished: any, entry: any, cancellablePromise?: any, modifiers?: string, controller?: any): void;
}
