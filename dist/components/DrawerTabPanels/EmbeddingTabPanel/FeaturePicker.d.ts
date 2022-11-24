import { ConnectedProps } from 'react-redux';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    projectionColumns: any;
    projectionOpen: any;
    dataset: any;
} & {
    setProjectionOpen: (projectionOpen: any) => any;
    setProjectionColumns: (value: any) => any;
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    selection: any;
    setSelection: any;
};
declare const FeaturePicker: import("react-redux").ConnectedComponent<({ selection, setSelection }: Props) => JSX.Element, import("react-redux").Omit<{
    projectionColumns: any;
    projectionOpen: any;
    dataset: any;
} & {
    setProjectionOpen: (projectionOpen: any) => any;
    setProjectionColumns: (value: any) => any;
} & {
    selection: any;
    setSelection: any;
}, "dataset" | "projectionColumns" | "projectionOpen" | "setProjectionOpen" | "setProjectionColumns">>;
export default FeaturePicker;
