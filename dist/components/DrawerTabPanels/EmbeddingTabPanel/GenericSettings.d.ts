import { ConnectedProps } from 'react-redux';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    projectionColumns: any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    domainSettings: any;
    open: boolean;
    onClose: any;
    onStart: any;
    projectionParams: any;
};
export declare const GenericSettings: import("react-redux").ConnectedComponent<({ domainSettings, open, onClose, onStart, projectionParams, projectionColumns }: Props) => JSX.Element, Pick<Props, "projectionParams" | "open" | "onClose" | "domainSettings" | "onStart">>;
export {};
