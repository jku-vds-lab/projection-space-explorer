import { ConnectedProps } from 'react-redux';
export declare function TypeIcon({ type }: {
    type: any;
}): JSX.Element;
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    datasetEntries: {
        values: {
            byId: {
                [id: string]: import("../../..").DatasetEntry;
            };
            allIds: string[];
        };
    };
}, {}>;
declare type Props = ConnectedProps<typeof connector> & {
    onChange: any;
};
export declare const PredefinedDatasets: import("react-redux").ConnectedComponent<({ onChange, datasetEntries }: Props) => JSX.Element, Pick<Props, "onChange">>;
export {};
