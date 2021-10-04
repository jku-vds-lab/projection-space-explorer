import { DatasetType } from "../../../model/DatasetType";
export declare type DatasetEntry = {
    display: string;
    path: string;
    type: DatasetType;
    uploaded?: boolean;
};
/**
 * Dummy class that holds information about the files that can be preselected.
 */
export declare class DatasetDatabase {
    data: DatasetEntry[];
    constructor();
    getTypes(): DatasetType[];
    getByPath(path: any): DatasetEntry;
}
