import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
declare type GenericLegendProps = {
    type: DatasetType;
    vectors: IVector[];
    aggregate: boolean;
    scale?: number;
};
export declare const DefaultLegend: () => JSX.Element;
export declare function GenericLegend({ type, vectors, aggregate, scale }: GenericLegendProps): JSX.Element;
export {};
