import { ConnectedProps } from 'react-redux';
import { IVector } from '../../../model/Vector';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    dataset: import("../../..").Dataset;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    aggregate: boolean;
    selection: IVector[];
};
export declare const TrrackLegend: import("react-redux").ConnectedComponent<({ selection }: Props) => JSX.Element, Pick<Props, "aggregate" | "selection">>;
export {};