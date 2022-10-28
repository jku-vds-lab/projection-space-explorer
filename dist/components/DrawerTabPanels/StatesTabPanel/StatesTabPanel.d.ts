import { ConnectedProps } from 'react-redux';
import { EncodingChannel } from '../../../model';
declare const connector: import("react-redux").InferableComponentEnhancerWithProps<{
    selectedLineBy: {
        options: any[];
        value: any;
    } | {
        options: any;
        value: string;
    };
    dataset: import("../../../model").Dataset;
} & {
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
    encodings: EncodingChannel[];
};
export declare function StatesTabPanelFull({ dataset, setVectorByShape, setChannelBrightness, setGlobalPointBrightness, setChannelSize, setGlobalPointSize, encodings, setAdvancedColoringSelection, }: Props): JSX.Element;
export declare const StatesTabPanel: import("react-redux").ConnectedComponent<typeof StatesTabPanelFull, import("react-redux").Omit<{
    selectedLineBy: {
        options: any[];
        value: any;
    } | {
        options: any;
        value: string;
    };
    dataset: import("../../../model").Dataset;
} & {
    setVectorByShape: (vectorByShape: any) => any;
    setSelectedLineBy: (lineBy: any) => any;
    setChannelBrightness: (value: any) => any;
    setGlobalPointBrightness: (value: any) => any;
    setChannelSize: (value: any) => any;
    setGlobalPointSize: (value: any) => any;
    setAdvancedColoringSelection: (value: any) => any;
} & {
    encodings: EncodingChannel[];
}, "dataset" | "selectedLineBy" | "setVectorByShape" | "setChannelBrightness" | "setGlobalPointBrightness" | "setChannelSize" | "setGlobalPointSize" | "setAdvancedColoringSelection" | "setSelectedLineBy">>;
export {};
