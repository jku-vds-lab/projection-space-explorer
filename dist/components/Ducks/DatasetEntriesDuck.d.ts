import { DatasetEntry } from '../../model/DatasetEntry';
export declare function setDatasetEntriesAction(pdatasetEntries: Array<DatasetEntry>): {
    byId: {
        [id: string]: DatasetEntry;
    };
    allIds: string[];
    type: string;
};
declare type InitialType = {
    values: {
        byId: {
            [id: string]: DatasetEntry;
        };
        allIds: string[];
    };
};
export declare class DatasetEntriesAPI {
    static getTypes(state: InitialType): import("../..").DatasetType[];
    static getByPath(state: InitialType, path: string): DatasetEntry;
}
export default function datasetEntries(state: InitialType, action: any): InitialType;
export {};
