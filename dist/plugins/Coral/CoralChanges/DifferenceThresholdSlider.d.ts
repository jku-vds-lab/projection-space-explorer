import * as React from 'react';
import { ConnectedProps } from 'react-redux';
declare class simpleSlider extends React.Component<Props> {
    state: {
        value: number;
    };
    constructor(props: any);
    handleChange: (event: any, value: any) => void;
    componentDidUpdate(prevProps: any): void;
    render(): JSX.Element;
}
type Props = ConnectedProps<typeof connector>;
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    differenceThreshold: any;
} & {
    setDifferenceThreshold: (differenceThreshold: any) => any;
}, {}>;
export declare const DifferenceThresholdSlider: import("react-redux").ConnectedComponent<typeof simpleSlider, import("react-redux").Omit<React.ClassAttributes<simpleSlider> & {
    differenceThreshold: any;
} & {
    setDifferenceThreshold: (differenceThreshold: any) => any;
}, "differenceThreshold" | "setDifferenceThreshold">>;
export {};
