import React = require('react');
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
declare type Props = ConnectedProps<typeof connector>;
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    differenceThreshold: any;
} & {
    setDifferenceThreshold: (differenceThreshold: any) => any;
}, {}>;
export declare const DifferenceThresholdSlider: import("react-redux").ConnectedComponent<typeof simpleSlider, Pick<any, string | number | symbol>>;
export {};
