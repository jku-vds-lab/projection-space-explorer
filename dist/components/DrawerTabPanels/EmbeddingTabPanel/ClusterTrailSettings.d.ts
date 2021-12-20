import { ConnectedProps } from "react-redux";
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
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {};
export declare const ClusterTrailSettings: import("react-redux").ConnectedComponent<({ trailSettings, setTrailVisibility, setTrailLength }: Props) => JSX.Element, Pick<{
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
}, never>>;
export {};
