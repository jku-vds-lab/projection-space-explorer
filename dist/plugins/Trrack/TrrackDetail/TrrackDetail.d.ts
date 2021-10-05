import { ConnectedProps } from 'react-redux';
import { IVector } from "../../../model/Vector";
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    dataset: import("../../../model/Dataset.js").Dataset;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    aggregate: boolean;
    selection: IVector[];
};
export declare var TrrackLegend: import("react-redux").ConnectedComponent<({ selection, dataset }: Props) => JSX.Element, Pick<Props, "aggregate" | "selection">>;
export {};
