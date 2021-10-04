/// <reference types="react" />
import { ConnectedProps } from "react-redux";
import { DownloadJob } from "./DownloadJob";
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    job: DownloadJob;
    onFinish: any;
    onCancel: any;
};
export declare function DownloadProgress({ job, onFinish, onCancel }: Props): JSX.Element;
export {};
