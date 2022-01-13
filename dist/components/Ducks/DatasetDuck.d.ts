import { Dataset } from "../../model/Dataset";
declare const SET = "ducks/dataset/SET";
interface SetDatasetAction {
    type: typeof SET;
    dataset: Dataset;
}
declare type DatasetActionTypes = SetDatasetAction;
export declare function setDatasetAction(dataset: Dataset): DatasetActionTypes;
export default function setDataset(state: Dataset, action: any): Dataset;
export {};
