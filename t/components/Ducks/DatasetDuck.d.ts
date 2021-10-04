import { Dataset } from "../../model/Dataset";
declare const SET = "ducks/database/SET";
interface SetDatasetAction {
    type: typeof SET;
    dataset: Dataset;
}
declare type DatasetActionTypes = SetDatasetAction;
export declare function setDatasetAction(dataset: Dataset): DatasetActionTypes;
export declare const setDatasetVectAction: (input: any) => {
    type: string;
    input: any;
};
export default function dataset(state: Dataset, action: any): Dataset;
export {};
