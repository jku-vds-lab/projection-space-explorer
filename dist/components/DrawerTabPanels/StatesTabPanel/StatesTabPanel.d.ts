import { ConnectedProps } from 'react-redux';
import { EncodingChannel } from '../../../model';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    selectedVectorByShape: any;
    selectedLineBy: {
        options: any[];
        value: any;
    } | {
        options: any;
        value: string;
    };
    vectorByShape: any;
    dataset: import("../../../model").Dataset;
    channelBrightness: any;
    channelSize: any;
    channelColor: any;
} & {
    setSelectedVectorByShape: (selectedVectorByShape: any) => any;
    setVectorByShape: (vectorByShape: any) => any;
    setSelectedLineBy: (lineBy: any) => any;
    setChannelBrightness: (value: any) => any;
    setGlobalPointBrightness: (value: any) => any;
    setChannelSize: (value: any) => any;
    setGlobalPointSize: (value: any) => any;
    setAdvancedColoringSelection: (value: any) => any;
}, {}>;
declare type PropsFromRedux = ConnectedProps<typeof connector>;
declare type Props = PropsFromRedux & {
    webGlView: any;
    encodings: EncodingChannel[];
};
export declare function SelectFeatureComponent({ label, default_val, categoryOptions, onChange, column_info }: any): JSX.Element;
export declare function StatesTabPanelFull({ selectedVectorByShape, vectorByShape, dataset, setSelectedVectorByShape, setVectorByShape, webGlView, channelBrightness, setChannelBrightness, setGlobalPointBrightness, channelSize, setChannelSize, setGlobalPointSize, channelColor, encodings, setAdvancedColoringSelection, }: Props): JSX.Element;
export declare const StatesTabPanel: import("react-redux").ConnectedComponent<typeof StatesTabPanelFull, Pick<Props, "webGlView" | "encodings">>;
export {};
