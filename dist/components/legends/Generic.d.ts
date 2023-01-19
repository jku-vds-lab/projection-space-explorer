import { IVector } from '../../model/Vector';
import { DatasetType } from '../../model/DatasetType';
import { FPOptions } from '../Store/PSEPlugin';
type GenericLegendProps = {
    type: DatasetType;
    vectors: IVector[];
    aggregate: boolean;
    scale?: number;
    options?: FPOptions;
};
export declare function GenericLegend({ type, vectors, aggregate, scale, options }: GenericLegendProps): JSX.Element;
export {};
//# sourceMappingURL=Generic.d.ts.map