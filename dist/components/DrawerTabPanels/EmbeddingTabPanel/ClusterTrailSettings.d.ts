import { ConnectedProps } from 'react-redux';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    trailSettings: {
        show: boolean;
        length: any;
    } | {
        show: any;
        length: number;
    };
} & {
    setTrailVisibility: (visibility: any) => any;
    setTrailLength: (length: any) => any;
}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {};
export declare const ClusterTrailSettings: import("react-redux").ConnectedComponent<({ trailSettings, setTrailVisibility, setTrailLength }: Props) => JSX.Element, import("react-redux").Omit<{
    trailSettings: {
        show: boolean;
        length: any;
    } | {
        show: any;
        length: number;
    };
} & {
    setTrailVisibility: (visibility: any) => any;
    setTrailLength: (length: any) => any;
}, "trailSettings" | "setTrailVisibility" | "setTrailLength">>;
export {};
