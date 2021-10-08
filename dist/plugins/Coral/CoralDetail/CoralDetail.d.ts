import { ConnectedProps } from 'react-redux';
import './coral.scss';
import { IVector } from "../../../model/Vector";
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    legendAttributes: any[];
    dataset: import("../../../index.js").Dataset;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    aggregate: boolean;
    selection: IVector[];
};
export declare var CoralLegend: import("react-redux").ConnectedComponent<({ selection, aggregate, legendAttributes, dataset }: Props) => JSX.Element, Pick<Props, "aggregate" | "selection">>;
export {};
