import { ConnectedProps } from 'react-redux';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    globalLabels: import("..").GlobalLabelsState;
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {};
export declare var DefaultLegend: import("react-redux").ConnectedComponent<({ globalLabels }: Props) => JSX.Element, import("react-redux").Omit<{
    globalLabels: import("..").GlobalLabelsState;
}, "globalLabels">>;
export {};
