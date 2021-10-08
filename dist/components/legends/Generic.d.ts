/// <reference types="react" />
import { IVector } from "../../model/Vector";
import { DatasetType } from "../../model/DatasetType";
declare type GenericLegendProps = {
    type: DatasetType;
    vectors: IVector[];
    aggregate: boolean;
    scale?: number;
};
export declare var GenericLegend: ({ type, vectors, aggregate, scale }: GenericLegendProps) => JSX.Element;
export {};
