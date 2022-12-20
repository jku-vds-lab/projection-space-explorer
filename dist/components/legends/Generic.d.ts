import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
type GenericLegendProps = {
    type: DatasetType;
    vectors: IVector[];
    aggregate: boolean;
    scale?: number;
};
export declare function GenericLegend({ type, vectors, aggregate, scale }: GenericLegendProps): JSX.Element;
export {};
