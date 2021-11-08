import { ConnectedProps } from "react-redux";
export declare const TypeIcon: ({ type }: {
    type: any;
}) => JSX.Element;
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
export declare var PredefinedDatasets: import("react-redux").ConnectedComponent<({ onChange, datasetEntries }: Props) => JSX.Element, Pick<Props, "onChange">>;
export {};
