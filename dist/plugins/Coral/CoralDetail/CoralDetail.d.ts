import { ConnectedProps } from 'react-redux';
import './coral.scss';
import type { IVector } from '../../../model/Vector';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    legendAttributes: any[];
    dataset: import("../../..").Dataset;
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    aggregate: boolean;
    selection: IVector[];
};
export declare var CoralLegend: import("react-redux").ConnectedComponent<({ selection, aggregate, legendAttributes, dataset }: Props) => JSX.Element, import("react-redux").Omit<{
    legendAttributes: any[];
    dataset: import("../../..").Dataset;
} & {
    aggregate: boolean;
    selection: IVector[];
}, "dataset" | "legendAttributes">>;
export {};
//# sourceMappingURL=CoralDetail.d.ts.map