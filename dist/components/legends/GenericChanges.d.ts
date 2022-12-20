import { IVector } from '../../model/Vector';
import { Dataset } from '../../model/Dataset';
type GenericChangesType = {
    vectorsA: Array<IVector>;
    vectorsB: Array<IVector>;
    dataset: Dataset;
    scale: number;
};
export declare const GenericChanges: import("react-redux").ConnectedComponent<({ vectorsA, vectorsB, dataset, scale }: GenericChangesType) => JSX.Element, import("react-redux").Omit<GenericChangesType, "dataset">>;
export {};
