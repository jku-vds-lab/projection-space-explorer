import { ConnectedProps } from 'react-redux';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    globalLabels: import("..").GlobalLabelsState;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {};
export declare var DefaultLegend: import("react-redux").ConnectedComponent<({ globalLabels }: Props) => JSX.Element, Pick<{
    globalLabels: import("..").GlobalLabelsState;
}, never>>;
export {};
