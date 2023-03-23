import { ConnectedProps } from 'react-redux';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{}, {}>;
type PropsFromRedux = ConnectedProps<typeof connector>;
type Props = PropsFromRedux & {
    onCancel: any;
};
export declare function DownloadProgress({ onCancel }: Props): JSX.Element;
export {};
//# sourceMappingURL=DownloadProgress.d.ts.map