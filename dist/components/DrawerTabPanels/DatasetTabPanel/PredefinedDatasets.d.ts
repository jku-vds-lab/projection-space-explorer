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
type Props = ConnectedProps<typeof connector> & {
    onChange: any;
};
export declare const PredefinedDatasets: import("react-redux").ConnectedComponent<({ onChange, datasetEntries }: Props) => JSX.Element, import("react-redux").Omit<{
    datasetEntries: {
        values: {
            byId: {
                [id: string]: import("../../..").DatasetEntry;
            };
            allIds: string[];
        };
    };
} & {
    onChange: any;
}, "datasetEntries">>;
export {};
