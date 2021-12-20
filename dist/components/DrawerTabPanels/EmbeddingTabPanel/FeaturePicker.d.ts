import { ConnectedProps } from 'react-redux';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    projectionColumns: any;
    projectionOpen: any;
    dataset: any;
} & {
    setProjectionOpen: (projectionOpen: any) => any;
    setProjectionParams: (projectionParams: any) => any;
    setProjectionColumns: (value: any) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    selection: any;
    setSelection: any;
};
declare const FeaturePicker: import("react-redux").ConnectedComponent<({ selection, setSelection }: Props) => JSX.Element, Pick<Props, "selection" | "setSelection">>;
export default FeaturePicker;
