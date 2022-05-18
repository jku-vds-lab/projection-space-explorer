import { ConnectedProps } from 'react-redux';
import { FeatureConfig } from '../../../BaseConfig';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    hoverSettings: {
        windowMode: any;
    };
    currentAggregation: {
        aggregation: number[];
        selectedClusters: (string | number)[];
        source: "sample" | "cluster";
    };
    dataset: import("../../..").Dataset;
    hoverStateOrientation: any;
    activeStorybook: import("../../..").IBook;
} & {
    setHoverWindowMode: (value: any) => any;
    setAggregation: (value: any) => any;
    setHoverStateOrientation: (value: any) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    config: FeatureConfig;
};
export declare const DetailsTabPanel: import("react-redux").ConnectedComponent<({ hoverSettings, setHoverWindowMode, setAggregation, currentAggregation, dataset, hoverStateOrientation, setHoverStateOrientation, activeStorybook, config, }: Props) => JSX.Element, Pick<Props, "config">>;
export {};
