import { ConnectedProps } from 'react-redux';
import { IVector } from '../../../model/Vector';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    dataset: import("../../..").Dataset;
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    aggregate: boolean;
    selection: IVector[];
};
export declare const TrrackLegend: import("react-redux").ConnectedComponent<({ selection }: Props) => JSX.Element, import("react-redux").Omit<{
    dataset: import("../../..").Dataset;
} & {
    aggregate: boolean;
    selection: IVector[];
}, "dataset">>;
export {};
